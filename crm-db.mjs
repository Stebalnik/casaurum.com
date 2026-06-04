import { createHash, randomBytes, createCipheriv, createDecipheriv } from "node:crypto";
import { existsSync, mkdirSync, chmodSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

loadEnvFile("/var/www/casaurum.com/.env.production");

const DB_PATH = process.env.CRM_DB_PATH || "/var/www/casaurum.com/data/casaurum-crm.sqlite";
const ENCRYPTION_KEY = getEncryptionKey();

let db;

export function initCrmDb() {
  if (db) return db;
  mkdirSync(dirname(DB_PATH), { recursive: true });
  db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA busy_timeout = 5000");
  db.exec("PRAGMA foreign_keys = ON");
  db.exec(schemaSql());
  try {
    chmodSync(DB_PATH, 0o600);
    if (existsSync(`${DB_PATH}-wal`)) chmodSync(`${DB_PATH}-wal`, 0o600);
    if (existsSync(`${DB_PATH}-shm`)) chmodSync(`${DB_PATH}-shm`, 0o600);
  } catch {}
  return db;
}

export function insertLead(lead) {
  const database = initCrmDb();
  const row = leadToRow(lead);
  database.prepare(`
    insert into leads (
      id, created_at, status, lead_type, form_type, source_url, language,
      vertical, service, intent, object_type, material, country, state, province,
      metro, city, neighborhood, zip_code, budget, timeline, project_type,
      service_needed, page_id, canonical_url, indexing_status, utm_source,
      utm_medium, utm_campaign, utm_term, utm_content, email_hash, phone_hash,
      encrypted_payload
    ) values (
      @id, @created_at, @status, @lead_type, @form_type, @source_url, @language,
      @vertical, @service, @intent, @object_type, @material, @country, @state, @province,
      @metro, @city, @neighborhood, @zip_code, @budget, @timeline, @project_type,
      @service_needed, @page_id, @canonical_url, @indexing_status, @utm_source,
      @utm_medium, @utm_campaign, @utm_term, @utm_content, @email_hash, @phone_hash,
      @encrypted_payload
    )
  `).run(row);
  return getLead(lead.id);
}

export function getLead(id) {
  const row = initCrmDb().prepare("select * from leads where id = ?").get(id);
  return row ? decryptLeadRow(row) : null;
}

export function getNewLeads(limit = 10) {
  return initCrmDb()
    .prepare("select * from leads where status = 'new' order by created_at asc limit @limit")
    .all({ limit })
    .map(decryptLeadRow);
}

export function getOldUncontactedLeads(cutoffIso, limit = 10) {
  return initCrmDb()
    .prepare("select * from leads where status in ('new','notified','crm_created') and created_at <= @cutoffIso order by created_at asc limit @limit")
    .all({ cutoffIso, limit })
    .map(decryptLeadRow);
}

export function updateLeadStatus(id, status) {
  initCrmDb().prepare("update leads set status = ?, updated_at = datetime('now') where id = ?").run(status, id);
}

export function upsertNotification({ leadId, chatId, messageId, payload }) {
  initCrmDb().prepare(`
    insert into lead_notifications (lead_id, telegram_chat_id, telegram_message_id, sent_at, status, encrypted_payload)
    values (?, ?, ?, datetime('now'), 'sent', ?)
    on conflict(lead_id) do update set
      telegram_chat_id = excluded.telegram_chat_id,
      telegram_message_id = excluded.telegram_message_id,
      sent_at = datetime('now'),
      status = 'sent',
      encrypted_payload = excluded.encrypted_payload
  `).run(leadId, String(chatId), String(messageId), encryptJson(payload || {}));
}

export function acknowledgeNotification(leadId) {
  initCrmDb().prepare("update lead_notifications set acknowledged_at = datetime('now'), status = 'acknowledged' where lead_id = ?").run(leadId);
}

export function bumpNotificationReminder(leadId) {
  initCrmDb().prepare("update lead_notifications set last_reminded_at = datetime('now'), reminder_count = reminder_count + 1, status = 'reminded' where lead_id = ?").run(leadId);
}

export function ensureCrmForLead(leadId) {
  const lead = getLead(leadId);
  if (!lead) throw new Error(`Lead not found: ${leadId}`);
  const contact = upsertContactFromLead(lead);
  const deal = upsertDealFromLead(lead, contact);
  return { lead, contact, deal };
}

export function upsertContactFromLead(lead) {
  const database = initCrmDb();
  const emailHash = hashValue(lead.email);
  const phoneHash = hashValue(lead.phone);
  let existing = null;
  if (emailHash) existing = database.prepare("select * from contacts where email_hash = ? limit 1").get(emailHash);
  if (!existing && phoneHash) existing = database.prepare("select * from contacts where phone_hash = ? limit 1").get(phoneHash);
  const payload = {
    first_name: lead.firstName || lead.first_name || "",
    last_name: lead.lastName || lead.last_name || "",
    email: lead.email || "",
    phone: lead.phone || "",
    whatsapp: lead.whatsapp || "",
    preferred_language: lead.preferredLanguage || lead.preferred_language || lead.language || "",
    country: lead.country || "",
    state: lead.state || lead.stateProvince || "",
    province: lead.province || "",
    city: lead.city || "",
    zip_code: lead.zipCode || lead.zip_code || "",
    source_lead_id: lead.id,
  };
  const encrypted = encryptJson({ ...payload, payload: lead });
  if (existing) {
    database.prepare(`
      update contacts set updated_at = datetime('now'), first_name_hint = ?, email_hash = ?, phone_hash = ?,
      source_lead_id = ?, encrypted_payload = ? where id = ?
    `).run(payload.first_name, emailHash, phoneHash, lead.id, encrypted, existing.id);
    return decryptContactRow(database.prepare("select * from contacts where id = ?").get(existing.id));
  }
  const id = cryptoId();
  database.prepare(`
    insert into contacts (id, first_name_hint, email_hash, phone_hash, source_lead_id, encrypted_payload)
    values (?, ?, ?, ?, ?, ?)
  `).run(id, payload.first_name, emailHash, phoneHash, lead.id, encrypted);
  return decryptContactRow(database.prepare("select * from contacts where id = ?").get(id));
}

export function upsertDealFromLead(lead, contact) {
  const database = initCrmDb();
  const existing = database.prepare("select * from deals where lead_id = ? limit 1").get(lead.id);
  const payload = {
    lead_id: lead.id,
    contact_id: contact.id,
    title: dealTitle(lead),
    vertical: lead.vertical || "",
    service: lead.service || lead.serviceNeeded || "",
    project_type: lead.projectType || lead.project_type || "",
    budget: lead.budget || "",
    timeline: lead.timeline || "",
    country: lead.country || "",
    state: lead.state || lead.stateProvince || "",
    city: lead.city || "",
    neighborhood: lead.neighborhood || "",
    status: existing?.status || "contact_needed",
    priority: dealPriority(lead),
    source_url: lead.sourceUrl || lead.source_url || "",
    next_follow_up_at: existing?.next_follow_up_at || new Date(Date.now() + Number(process.env.BOT_REMINDER_AFTER_MINUTES || 60) * 60_000).toISOString(),
    encrypted_payload: encryptJson({ lead }),
  };
  if (existing) {
    const { lead_id, ...updatePayload } = payload;
    database.prepare(`
      update deals set updated_at = datetime('now'), contact_id = @contact_id, title = @title, vertical = @vertical,
      service = @service, project_type = @project_type, budget = @budget, timeline = @timeline,
      country = @country, state = @state, city = @city, neighborhood = @neighborhood, status = @status,
      priority = @priority, source_url = @source_url, next_follow_up_at = @next_follow_up_at,
      encrypted_payload = @encrypted_payload where id = @id
    `).run({ ...updatePayload, id: existing.id });
    return decryptDealRow(database.prepare("select * from deals where id = ?").get(existing.id));
  }
  const id = cryptoId();
  database.prepare(`
    insert into deals (
      id, lead_id, contact_id, title, vertical, service, project_type, budget, timeline,
      country, state, city, neighborhood, status, priority, source_url, next_follow_up_at, encrypted_payload
    ) values (
      @id, @lead_id, @contact_id, @title, @vertical, @service, @project_type, @budget, @timeline,
      @country, @state, @city, @neighborhood, @status, @priority, @source_url, @next_follow_up_at, @encrypted_payload
    )
  `).run({ ...payload, id });
  insertActivity({ leadId: lead.id, contactId: contact.id, dealId: id, type: "new_lead", status: "completed", completedAt: new Date().toISOString(), notes: "Deal created from local CRM bot." });
  return decryptDealRow(database.prepare("select * from deals where id = ?").get(id));
}

export function insertActivity({ leadId, contactId, dealId, type, status = "open", dueAt = null, completedAt = null, notes = "", payload = {} }) {
  const id = cryptoId();
  initCrmDb().prepare(`
    insert into activities (id, lead_id, contact_id, deal_id, type, status, due_at, completed_at, notes_enc, encrypted_payload)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, leadId || null, contactId || null, dealId || null, type, status, dueAt, completedAt, encryptText(notes), encryptJson(payload));
  return id;
}

export function updateDeal(id, fields) {
  const allowed = ["status", "next_follow_up_at", "priority"];
  const entries = Object.entries(fields).filter(([key]) => allowed.includes(key));
  if (!entries.length) return;
  const set = entries.map(([key]) => `${key} = ?`).join(", ");
  initCrmDb().prepare(`update deals set ${set}, updated_at = datetime('now') where id = ?`).run(...entries.map(([, value]) => value), id);
}

export function closeActivity(id, status = "closed") {
  initCrmDb().prepare("update activities set status = ?, completed_at = datetime('now') where id = ?").run(status, id);
}

export function getDueActivities(cutoffIso, limit = 10) {
  const rows = initCrmDb().prepare(`
    select a.*, d.title as deal_title, d.status as deal_status, c.encrypted_payload as contact_payload
    from activities a
    left join deals d on d.id = a.deal_id
    left join contacts c on c.id = a.contact_id
    where a.status = 'open' and a.type = 'follow_up' and a.due_at <= @cutoffIso
    order by a.due_at asc limit @limit
  `).all({ cutoffIso, limit });
  return rows.map((row) => ({
    ...row,
    notes: decryptText(row.notes_enc),
    contact: row.contact_payload ? decryptJson(row.contact_payload) : {},
  }));
}

export function getLeadActivities(leadId, limit = 20) {
  return initCrmDb()
    .prepare("select * from activities where lead_id = @leadId order by created_at desc limit @limit")
    .all({ leadId, limit })
    .map((row) => ({
      ...row,
      notes: decryptText(row.notes_enc),
      payload: decryptJson(row.encrypted_payload),
    }));
}

export function getCrmSummary(leadId) {
  const crm = ensureCrmForLead(leadId);
  const activities = getLeadActivities(leadId, 12);
  return { ...crm, activities };
}

export function listCrmLeads({ status = "active", search = "", limit = 50 } = {}) {
  const database = initCrmDb();
  const cappedLimit = Math.min(Math.max(Number(limit) || 50, 1), 200);
  const rows = database.prepare(`
    select * from leads
    order by created_at desc
    limit @limit
  `).all({ limit: cappedLimit * 3 }).map(decryptLeadRow);
  const normalizedSearch = String(search || "").trim().toLowerCase();
  return rows
    .filter((lead) => {
      if (status && status !== "all" && status !== "active" && lead.status !== status) return false;
      if (status === "active" && ["not_fit", "lost", "won"].includes(lead.status)) return false;
      if (!normalizedSearch) return true;
      const haystack = [
        lead.id,
        lead.firstName,
        lead.lastName,
        lead.fullName,
        lead.email,
        lead.phone,
        lead.zipCode,
        lead.zip_code,
        lead.city,
        lead.serviceNeeded,
        lead.vertical,
        lead.message,
      ].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(normalizedSearch);
    })
    .slice(0, cappedLimit)
    .map((lead) => {
      let crm = null;
      try {
        crm = getCrmSummary(lead.id);
      } catch {}
      return crm ? summarizeCrmLead(crm) : summarizeCrmLead({ lead, contact: null, deal: null, activities: [] });
    });
}

export function addLeadNote(leadId, notes) {
  const crm = ensureCrmForLead(leadId);
  insertActivity({ leadId, contactId: crm.contact?.id, dealId: crm.deal?.id, type: "note", status: "completed", completedAt: new Date().toISOString(), notes });
  return getCrmSummary(leadId);
}

export function summarizeCrmLead(summary) {
  const { lead, contact, deal, activities = [] } = summary;
  return {
    id: lead.id,
    createdAt: lead.created_at || lead.timestamp || "",
    updatedAt: lead.updated_at || "",
    status: lead.status || "",
    name: [contact?.first_name, contact?.last_name].filter(Boolean).join(" ") || [lead.firstName || lead.first_name, lead.lastName || lead.last_name].filter(Boolean).join(" ") || lead.fullName || "",
    email: contact?.email || lead.email || "",
    phone: contact?.phone || lead.phone || "",
    zipCode: contact?.zip_code || lead.zipCode || lead.zip_code || "",
    location: [lead.city, lead.state || lead.stateProvince, lead.country].filter(Boolean).join(", "),
    projectType: lead.projectType || lead.project_type || deal?.project_type || "",
    service: lead.vertical || lead.serviceNeeded || lead.service || deal?.service || "",
    budget: lead.budget || deal?.budget || "",
    timeline: lead.timeline || deal?.timeline || "",
    sourceUrl: lead.sourceUrl || lead.source_url || deal?.source_url || "",
    message: lead.message || "",
    dealStatus: deal?.status || "",
    priority: deal?.priority || "",
    nextFollowUpAt: deal?.next_follow_up_at || "",
    activities: activities.map((activity) => ({
      id: activity.id,
      createdAt: activity.created_at,
      type: activity.type,
      status: activity.status,
      dueAt: activity.due_at,
      completedAt: activity.completed_at,
      notes: activity.notes || "",
    })),
  };
}

export function setLeadFollowUp(leadId, minutes) {
  const crm = ensureCrmForLead(leadId);
  const dueAt = new Date(Date.now() + minutes * 60_000).toISOString();
  updateDeal(crm.deal.id, { next_follow_up_at: dueAt });
  insertActivity({ leadId, contactId: crm.contact.id, dealId: crm.deal.id, type: "follow_up", status: "open", dueAt, notes: "Telegram reminder requested." });
  return crm;
}

export function setLeadFollowUpAt(leadId, dueAt, notes = "Telegram reminder requested.") {
  const crm = ensureCrmForLead(leadId);
  updateDeal(crm.deal.id, { next_follow_up_at: dueAt });
  insertActivity({ leadId, contactId: crm.contact.id, dealId: crm.deal.id, type: "follow_up", status: "open", dueAt, notes });
  return crm;
}

export function markLeadContacted(leadId) {
  const crm = ensureCrmForLead(leadId);
  const wasContacted = crm.lead.status === "contacted";
  updateLeadStatus(leadId, "contacted");
  updateDeal(crm.deal.id, { status: "contacted" });
  insertActivity({ leadId, contactId: crm.contact.id, dealId: crm.deal.id, type: wasContacted ? "contacted_again" : "contacted", status: "completed", completedAt: new Date().toISOString(), notes: wasContacted ? "Marked contacted again from Telegram." : "Marked contacted from Telegram." });
  acknowledgeNotification(leadId);
  return crm;
}

export function markLeadNotFit(leadId) {
  const crm = ensureCrmForLead(leadId);
  updateLeadStatus(leadId, "not_fit");
  updateDeal(crm.deal.id, { status: "not_fit" });
  insertActivity({ leadId, contactId: crm.contact.id, dealId: crm.deal.id, type: "not_fit", status: "completed", completedAt: new Date().toISOString(), notes: "Marked not fit from Telegram." });
  acknowledgeNotification(leadId);
  return crm;
}

export function isTelegramUserAuthorized(userId) {
  const normalized = String(userId || "").trim();
  if (!normalized) return false;
  const owners = String(process.env.TELEGRAM_ALLOWED_USER_IDS || process.env.TELEGRAM_CHAT_ID || "").split(",").map((id) => id.trim()).filter(Boolean);
  if (owners.includes(normalized)) return true;
  const row = initCrmDb().prepare("select 1 from telegram_authorized_users where user_id = ? and status = 'active' limit 1").get(normalized);
  return Boolean(row);
}

export function createTelegramAccessPin({ requestedBy, username = "", firstName = "", ttlMinutes = 15 }) {
  const pin = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + ttlMinutes * 60_000).toISOString();
  initCrmDb().prepare(`
    insert into telegram_access_pins (pin, requested_by, username, first_name, expires_at, status)
    values (?, ?, ?, ?, ?, 'pending')
  `).run(pin, String(requestedBy || ""), username, firstName, expiresAt);
  return { pin, expiresAt };
}

export function consumeTelegramAccessPin({ pin, userId, username = "", firstName = "", lastName = "" }) {
  const normalizedPin = String(pin || "").trim();
  const normalizedUserId = String(userId || "").trim();
  if (!normalizedPin || !normalizedUserId) return { ok: false, message: "PIN and user id are required." };
  const database = initCrmDb();
  const row = database.prepare("select * from telegram_access_pins where pin = ? and status = 'pending' order by created_at desc limit 1").get(normalizedPin);
  if (!row) return { ok: false, message: "PIN не найден или уже использован." };
  if (new Date(row.expires_at).getTime() < Date.now()) {
    database.prepare("update telegram_access_pins set status = 'expired' where id = ?").run(row.id);
    return { ok: false, message: "PIN истек. Запроси новый PIN." };
  }
  database.prepare(`
    insert into telegram_authorized_users (user_id, username, first_name, last_name, status, authorized_at)
    values (?, ?, ?, ?, 'active', datetime('now'))
    on conflict(user_id) do update set
      username = excluded.username,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      status = 'active',
      authorized_at = datetime('now')
  `).run(normalizedUserId, username, firstName, lastName);
  database.prepare("update telegram_access_pins set status = 'used', used_by = ?, used_at = datetime('now') where id = ?").run(normalizedUserId, row.id);
  return { ok: true };
}

export function listTelegramAccessUsers() {
  const ownerIds = String(process.env.TELEGRAM_ALLOWED_USER_IDS || process.env.TELEGRAM_CHAT_ID || "").split(",").map((id) => id.trim()).filter(Boolean);
  const database = initCrmDb();
  const rows = database.prepare("select user_id, username, first_name, last_name, status, authorized_at, updated_at from telegram_authorized_users order by authorized_at desc").all();
  const seen = new Set(rows.map((row) => row.user_id));
  const owners = ownerIds.filter((id) => !seen.has(id)).map((id) => ({
    user_id: id,
    username: "",
    first_name: "Owner",
    last_name: "",
    status: "active",
    role: "owner",
    authorized_at: "",
    updated_at: "",
  }));
  return [
    ...owners,
    ...rows.map((row) => ({ ...row, role: ownerIds.includes(row.user_id) ? "owner" : "member" })),
  ];
}

export function listTelegramAccessPins(limit = 10) {
  return initCrmDb().prepare(`
    select id, requested_by, username, first_name, created_at, expires_at, status, used_by, used_at
    from telegram_access_pins
    order by created_at desc
    limit @limit
  `).all({ limit: Math.min(Math.max(Number(limit) || 10, 1), 50) });
}

function leadToRow(lead) {
  return {
    id: lead.id,
    created_at: lead.timestamp || new Date().toISOString(),
    status: "new",
    lead_type: lead.leadType || lead.formType || "",
    form_type: lead.formType || "",
    source_url: lead.sourceUrl || "",
    language: lead.language || "",
    vertical: lead.vertical || "",
    service: lead.service || lead.serviceNeeded || "",
    intent: lead.intent || "",
    object_type: lead.objectType || "",
    material: lead.material || "",
    country: lead.country || "",
    state: lead.state || lead.stateProvince || "",
    province: lead.province || "",
    metro: lead.metro || "",
    city: lead.city || "",
    neighborhood: lead.neighborhood || "",
    zip_code: lead.zipCode || "",
    budget: lead.budget || "",
    timeline: lead.timeline || "",
    project_type: lead.projectType || "",
    service_needed: lead.serviceNeeded || "",
    page_id: lead.pageId || "",
    canonical_url: lead.canonicalUrl || "",
    indexing_status: lead.indexingStatus || "",
    utm_source: lead.utmSource || "",
    utm_medium: lead.utmMedium || "",
    utm_campaign: lead.utmCampaign || "",
    utm_term: lead.utmTerm || "",
    utm_content: lead.utmContent || "",
    email_hash: hashValue(lead.email),
    phone_hash: hashValue(lead.phone),
    encrypted_payload: encryptJson(lead),
  };
}

function decryptLeadRow(row) {
  return { ...decryptJson(row.encrypted_payload), ...row, uploadedFiles: decryptJson(row.encrypted_payload).uploadedFiles || [] };
}

function decryptContactRow(row) {
  return { ...decryptJson(row.encrypted_payload), id: row.id, created_at: row.created_at, updated_at: row.updated_at };
}

function decryptDealRow(row) {
  return { ...row, payload: decryptJson(row.encrypted_payload) };
}

function schemaSql() {
  return `
    create table if not exists leads (
      id text primary key,
      created_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now')),
      status text not null default 'new',
      lead_type text, form_type text, source_url text, language text,
      vertical text, service text, intent text, object_type text, material text,
      country text, state text, province text, metro text, city text, neighborhood text, zip_code text,
      budget text, timeline text, project_type text, service_needed text,
      page_id text, canonical_url text, indexing_status text,
      utm_source text, utm_medium text, utm_campaign text, utm_term text, utm_content text,
      email_hash text, phone_hash text,
      encrypted_payload text not null
    );
    create index if not exists leads_status_idx on leads(status, created_at);
    create index if not exists leads_email_hash_idx on leads(email_hash);
    create index if not exists leads_phone_hash_idx on leads(phone_hash);
    create index if not exists leads_vertical_idx on leads(vertical);

    create table if not exists contacts (
      id text primary key,
      created_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now')),
      first_name_hint text,
      email_hash text,
      phone_hash text,
      source_lead_id text,
      encrypted_payload text not null
    );
    create unique index if not exists contacts_email_hash_idx on contacts(email_hash) where email_hash is not null and email_hash <> '';
    create unique index if not exists contacts_phone_hash_idx on contacts(phone_hash) where phone_hash is not null and phone_hash <> '';

    create table if not exists deals (
      id text primary key,
      created_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now')),
      lead_id text,
      contact_id text,
      title text,
      vertical text,
      service text,
      project_type text,
      budget text,
      timeline text,
      country text,
      state text,
      city text,
      neighborhood text,
      status text not null default 'contact_needed',
      priority text not null default 'normal',
      source_url text,
      next_follow_up_at text,
      encrypted_payload text not null
    );
    create index if not exists deals_status_idx on deals(status);
    create index if not exists deals_lead_id_idx on deals(lead_id);
    create index if not exists deals_next_follow_up_idx on deals(next_follow_up_at);

    create table if not exists activities (
      id text primary key,
      created_at text not null default (datetime('now')),
      lead_id text,
      contact_id text,
      deal_id text,
      type text not null,
      status text not null default 'open',
      due_at text,
      completed_at text,
      notes_enc text,
      encrypted_payload text not null
    );
    create index if not exists activities_due_idx on activities(status, type, due_at);

    create table if not exists lead_notifications (
      id text primary key default (lower(hex(randomblob(16)))),
      created_at text not null default (datetime('now')),
      lead_id text unique,
      telegram_chat_id text,
      telegram_message_id text,
      sent_at text,
      acknowledged_at text,
      last_reminded_at text,
      reminder_count integer not null default 0,
      status text not null default 'sent',
      encrypted_payload text not null
    );

    create table if not exists telegram_authorized_users (
      user_id text primary key,
      username text,
      first_name text,
      last_name text,
      status text not null default 'active',
      authorized_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now'))
    );

    create table if not exists telegram_access_pins (
      id integer primary key autoincrement,
      pin text not null,
      requested_by text,
      username text,
      first_name text,
      created_at text not null default (datetime('now')),
      expires_at text not null,
      status text not null default 'pending',
      used_by text,
      used_at text
    );
    create index if not exists telegram_access_pins_pin_idx on telegram_access_pins(pin, status, expires_at);
  `;
}

function dealTitle(lead) {
  const name = [lead.firstName || lead.first_name, lead.lastName || lead.last_name].filter(Boolean).join(" ") || lead.email || lead.phone || "New lead";
  const service = lead.vertical || lead.serviceNeeded || lead.service || "Project";
  const city = lead.city ? ` · ${lead.city}` : "";
  return `${service} · ${name}${city}`;
}

function dealPriority(lead) {
  if (String(lead.budget || "").includes("$100,000")) return "high";
  if (["ASAP", "1-3 months"].includes(lead.timeline)) return "high";
  if (["Hotel / Hospitality", "Development project"].includes(lead.projectType || lead.project_type)) return "high";
  return "normal";
}

function encryptJson(value) {
  return encryptText(JSON.stringify(value || {}));
}

function decryptJson(value) {
  if (!value) return {};
  try {
    return JSON.parse(decryptText(value));
  } catch {
    return {};
  }
}

function encryptText(value) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(String(value || ""), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${ciphertext.toString("base64")}`;
}

function decryptText(value) {
  if (!value) return "";
  const [version, ivB64, tagB64, dataB64] = String(value).split(":");
  if (version !== "v1") return "";
  const decipher = createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]).toString("utf8");
}

function hashValue(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return "";
  return createHash("sha256").update(normalized).digest("hex");
}

function getEncryptionKey() {
  const raw = process.env.LEADS_ENCRYPTION_KEY || "";
  if (!raw) throw new Error("Missing LEADS_ENCRYPTION_KEY");
  const asBase64 = Buffer.from(raw, "base64");
  if (asBase64.length === 32) return asBase64;
  const asUtf8 = Buffer.from(raw, "utf8");
  if (asUtf8.length === 32) return asUtf8;
  throw new Error("LEADS_ENCRYPTION_KEY must be 32 bytes or base64-encoded 32 bytes");
}

function cryptoId() {
  return randomBytes(16).toString("hex").replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/, "$1-$2-$3-$4-$5");
}

function loadEnvFile(path) {
  try {
    const text = readFileSync(path, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match) continue;
      if (process.env[match[1]] !== undefined && process.env[match[1]] !== "") continue;
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  } catch (error) {
    if (error.code !== "ENOENT") console.warn(`Could not load env file ${path}: ${error.message}`);
  }
}
