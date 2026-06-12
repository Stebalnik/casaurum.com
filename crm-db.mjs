import { createHash, randomBytes, createCipheriv, createDecipheriv, pbkdf2Sync, timingSafeEqual } from "node:crypto";
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
  ensureCrmMigrations(db);
  try {
    chmodSync(DB_PATH, 0o600);
    if (existsSync(`${DB_PATH}-wal`)) chmodSync(`${DB_PATH}-wal`, 0o600);
    if (existsSync(`${DB_PATH}-shm`)) chmodSync(`${DB_PATH}-shm`, 0o600);
  } catch {}
  return db;
}

function ensureCrmMigrations(database) {
  try {
    database.prepare("alter table deals add column partner_id text").run();
  } catch {}
  try {
    database.prepare("create index if not exists deals_partner_idx on deals(partner_id)").run();
  } catch {}
  try {
    database.prepare("alter table partners add column portal_token_hash text").run();
  } catch {}
  try {
    database.prepare("create index if not exists partners_portal_token_idx on partners(portal_token_hash)").run();
  } catch {}
  try {
    ensureWebUserSchema(database);
  } catch {}
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
  const emailHash = hashEmail(lead.email);
  const phoneHash = hashPhone(lead.phone);
  const emailMatch = findContactByIdentity("email", emailHash) || (emailHash ? database.prepare("select * from contacts where email_hash = ? limit 1").get(emailHash) : null);
  const phoneMatch = findContactByIdentity("phone", phoneHash) || (phoneHash ? database.prepare("select * from contacts where phone_hash = ? limit 1").get(phoneHash) : null);
  const existing = mergeContactMatches(emailMatch, phoneMatch);
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
  const previous = existing ? decryptJson(existing.encrypted_payload) : {};
  const aliases = contactAliases(previous, payload);
  const changed = contactAliasChanges(previous, payload);
  const encrypted = encryptJson({ ...previous, ...payload, emails: aliases.emails, phones: aliases.phones, payload: lead });
  if (existing) {
    database.prepare(`
      update contacts set updated_at = datetime('now'), first_name_hint = ?, email_hash = ?, phone_hash = ?,
      source_lead_id = ?, encrypted_payload = ? where id = ?
    `).run(payload.first_name, emailHash, phoneHash, lead.id, encrypted, existing.id);
    const contact = decryptContactRow(database.prepare("select * from contacts where id = ?").get(existing.id));
    upsertContactIdentityKeys(contact.id, aliases);
    if (changed.length) {
      insertActivity({
        leadId: lead.id,
        contactId: contact.id,
        type: "contact_alias",
        status: "completed",
        completedAt: new Date().toISOString(),
        notes: `Same client matched by contact data. New alternate ${changed.join(" and ")} detected.`,
        payload: { aliases },
      });
    }
    return contact;
  }
  const id = cryptoId();
  database.prepare(`
    insert into contacts (id, first_name_hint, email_hash, phone_hash, source_lead_id, encrypted_payload)
    values (?, ?, ?, ?, ?, ?)
  `).run(id, payload.first_name, emailHash, phoneHash, lead.id, encrypted);
  const contact = decryptContactRow(database.prepare("select * from contacts where id = ?").get(id));
  upsertContactIdentityKeys(contact.id, aliases);
  return contact;
}

function findContactByIdentity(kind, identityHash) {
  if (!identityHash) return null;
  const row = initCrmDb().prepare(`
    select c.* from contact_identity_keys k
    join contacts c on c.id = k.contact_id
    where k.kind = ? and k.identity_hash = ?
    limit 1
  `).get(kind, identityHash);
  return row || null;
}

function upsertContactIdentityKeys(contactId, aliases) {
  const database = initCrmDb();
  for (const email of aliases.emails || []) {
    const hash = hashEmail(email);
    if (hash) database.prepare("insert or ignore into contact_identity_keys (contact_id, kind, identity_hash) values (?, 'email', ?)").run(contactId, hash);
  }
  for (const phone of aliases.phones || []) {
    const hash = hashPhone(phone);
    if (hash) database.prepare("insert or ignore into contact_identity_keys (contact_id, kind, identity_hash) values (?, 'phone', ?)").run(contactId, hash);
  }
}

function mergeContactMatches(emailMatch, phoneMatch) {
  if (!emailMatch) return phoneMatch || null;
  if (!phoneMatch || phoneMatch.id === emailMatch.id) return emailMatch;
  const database = initCrmDb();
  const primary = emailMatch;
  const secondary = phoneMatch;
  const primaryPayload = decryptJson(primary.encrypted_payload);
  const secondaryPayload = decryptJson(secondary.encrypted_payload);
  const emails = uniqueList([...(primaryPayload.emails || []), primaryPayload.email, ...(secondaryPayload.emails || []), secondaryPayload.email]);
  const phones = uniqueList([...(primaryPayload.phones || []), primaryPayload.phone, ...(secondaryPayload.phones || []), secondaryPayload.phone]);
  database.exec("begin immediate");
  try {
    database.prepare("update deals set contact_id = ? where contact_id = ?").run(primary.id, secondary.id);
    database.prepare("update activities set contact_id = ? where contact_id = ?").run(primary.id, secondary.id);
    database.prepare("update or ignore contact_identity_keys set contact_id = ? where contact_id = ?").run(primary.id, secondary.id);
    database.prepare("delete from contact_identity_keys where contact_id = ?").run(secondary.id);
    database.prepare("delete from contacts where id = ?").run(secondary.id);
    database.prepare("update contacts set updated_at = datetime('now'), encrypted_payload = ? where id = ?").run(encryptJson({ ...secondaryPayload, ...primaryPayload, emails, phones }), primary.id);
    database.exec("commit");
  } catch (error) {
    database.exec("rollback");
    throw error;
  }
  return database.prepare("select * from contacts where id = ? limit 1").get(primary.id);
}

function contactAliases(previous, payload) {
  return {
    emails: uniqueList([...(previous.emails || []), previous.email, payload.email]),
    phones: uniqueList([...(previous.phones || []), previous.phone, payload.phone]),
  };
}

function contactAliasChanges(previous, payload) {
  const changes = [];
  if (payload.email && previous.email && normalizeEmail(payload.email) !== normalizeEmail(previous.email)) changes.push("email");
  if (payload.phone && previous.phone && normalizePhone(payload.phone) !== normalizePhone(previous.phone)) changes.push("phone");
  return changes;
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
  const allowed = ["status", "next_follow_up_at", "priority", "partner_id"];
  const entries = Object.entries(fields).filter(([key]) => allowed.includes(key));
  if (!entries.length) return;
  const set = entries.map(([key]) => `${key} = ?`).join(", ");
  initCrmDb().prepare(`update deals set ${set}, updated_at = datetime('now') where id = ?`).run(...entries.map(([, value]) => value), id);
}

export const partnerProgramTiers = {
  project_partner: {
    label: "Project Partner",
    discount: 10,
    monthlyTarget: 1,
    annualTarget: 1,
    description: "One accepted project or first collaboration.",
  },
  portfolio_partner: {
    label: "Portfolio Partner",
    discount: 20,
    monthlyTarget: 0,
    annualTarget: 5,
    description: "Five or more accepted projects, or comparable multi-room / multi-unit volume.",
  },
  annual_channel_partner: {
    label: "Annual Channel Partner",
    discount: 30,
    monthlyTarget: 5,
    annualTarget: 60,
    description: "Stable annual channel with five or more qualified projects per month.",
  },
};

export function upsertPartner(partner) {
  const database = initCrmDb();
  const emailHash = hashEmail(partner.email);
  const phoneHash = hashPhone(partner.phone);
  const companyHint = String(partner.company || "").trim();
  const nameHint = String(partner.name || [partner.firstName, partner.lastName].filter(Boolean).join(" ")).trim();
  const tier = normalizePartnerTier(partner.programTier || partner.tier);
  const discount = normalizePartnerDiscount(partner.discountPercent, tier);
  const existing = partner.id
    ? database.prepare("select * from partners where id = ? limit 1").get(partner.id)
    : findPartnerMatch(emailHash, phoneHash, companyHint, nameHint);
  const payload = {
    name: nameHint,
    company: companyHint,
    role: partner.role || "",
    email: partner.email || "",
    phone: partner.phone || "",
    market: partner.market || partner.region || "",
    city: partner.city || "",
    state: partner.state || "",
    country: partner.country || "",
    agreementStatus: partner.agreementStatus || partner.agreement_status || "prospect",
    manager: partner.manager || "",
    source: partner.source || "",
    notes: partner.notes || "",
  };
  const previousPayload = existing ? decryptJson(existing.encrypted_payload) : {};
  const portalToken = partner.portalToken || previousPayload.portalToken || randomToken();
  const encrypted = encryptJson({ ...previousPayload, ...payload, portalToken });
  if (existing) {
    database.prepare(`
      update partners set updated_at = datetime('now'), status = @status, program_tier = @program_tier,
      discount_percent = @discount_percent, monthly_target = @monthly_target, annual_target = @annual_target,
      company_hint = @company_hint, name_hint = @name_hint, email_hash = @email_hash, phone_hash = @phone_hash,
      portal_token_hash = @portal_token_hash, encrypted_payload = @encrypted_payload where id = @id
    `).run({
      id: existing.id,
      status: partner.status || existing.status || "prospect",
      program_tier: tier,
      discount_percent: discount,
      monthly_target: partner.monthlyTarget ?? partnerProgramTiers[tier].monthlyTarget,
      annual_target: partner.annualTarget ?? partnerProgramTiers[tier].annualTarget,
      company_hint: companyHint,
      name_hint: nameHint,
      email_hash: emailHash,
      phone_hash: phoneHash,
      portal_token_hash: hashToken(portalToken),
      encrypted_payload: encrypted,
    });
    return getPartner(existing.id);
  }
  const id = cryptoId();
  database.prepare(`
    insert into partners (
      id, status, program_tier, discount_percent, monthly_target, annual_target,
      company_hint, name_hint, email_hash, phone_hash, portal_token_hash, encrypted_payload
    ) values (
      @id, @status, @program_tier, @discount_percent, @monthly_target, @annual_target,
      @company_hint, @name_hint, @email_hash, @phone_hash, @portal_token_hash, @encrypted_payload
    )
  `).run({
    id,
    status: partner.status || "prospect",
    program_tier: tier,
    discount_percent: discount,
    monthly_target: partner.monthlyTarget ?? partnerProgramTiers[tier].monthlyTarget,
    annual_target: partner.annualTarget ?? partnerProgramTiers[tier].annualTarget,
    company_hint: companyHint,
    name_hint: nameHint,
    email_hash: emailHash,
    phone_hash: phoneHash,
    portal_token_hash: hashToken(portalToken),
    encrypted_payload: encrypted,
  });
  return getPartner(id);
}

export function linkPartnerToLead({ partnerId, leadId, relationship = "referral", notes = "" }) {
  const crm = ensureCrmForLead(leadId);
  return linkPartnerToDeal({ partnerId, dealId: crm.deal.id, leadId, relationship, notes });
}

export function linkPartnerToDeal({ partnerId, dealId, leadId = null, relationship = "referral", notes = "" }) {
  const database = initCrmDb();
  const partner = getPartner(partnerId);
  const deal = database.prepare("select * from deals where id = ? limit 1").get(dealId);
  if (!partner || !deal) return null;
  database.prepare(`
    insert into partner_project_links (partner_id, deal_id, lead_id, relationship, status, notes_enc)
    values (?, ?, ?, ?, 'active', ?)
    on conflict(partner_id, deal_id) do update set
      lead_id = excluded.lead_id,
      relationship = excluded.relationship,
      status = 'active',
      notes_enc = excluded.notes_enc
  `).run(partnerId, dealId, leadId || deal.lead_id || null, relationship, encryptText(notes));
  updateDeal(dealId, { partner_id: partnerId });
  insertActivity({
    leadId: leadId || deal.lead_id,
    contactId: deal.contact_id,
    dealId,
    type: "partner_linked",
    status: "completed",
    completedAt: new Date().toISOString(),
    notes: `Linked to partner: ${partner.displayName}`,
    payload: { partnerId, relationship },
  });
  return getPartnerSummary(partnerId);
}

export function getPartner(id) {
  const row = initCrmDb().prepare("select * from partners where id = ?").get(id);
  return row ? decryptPartnerRow(row) : null;
}

export function getPartnerByPortalToken(id, token) {
  const normalizedId = String(id || "").trim();
  const normalizedToken = String(token || "").trim();
  if (!normalizedId || !normalizedToken) return null;
  const row = initCrmDb().prepare("select * from partners where id = ? and portal_token_hash = ? limit 1").get(normalizedId, hashToken(normalizedToken));
  return row ? decryptPartnerRow(row) : null;
}

export function listPartners({ status = "active", search = "", limit = 80 } = {}) {
  const cappedLimit = Math.min(Math.max(Number(limit) || 80, 1), 200);
  const rows = initCrmDb().prepare("select * from partners order by updated_at desc limit @limit").all({ limit: cappedLimit * 2 }).map(decryptPartnerRow);
  const normalizedSearch = String(search || "").trim().toLowerCase();
  return rows
    .filter((partner) => {
      if (status && status !== "all" && status !== "active" && partner.status !== status) return false;
      if (status === "active" && partner.status !== "active") return false;
      if (!normalizedSearch) return true;
      return [partner.displayName, partner.company, partner.role, partner.market, partner.city, partner.email, partner.phone].filter(Boolean).join(" ").toLowerCase().includes(normalizedSearch);
    })
    .slice(0, cappedLimit)
    .map(summarizePartner);
}

export function getPartnerSummary(id) {
  const partner = getPartner(id);
  if (!partner) return null;
  return summarizePartner(partner, { includeProjects: true });
}

export function updatePartnerStatus(id, status, agreementStatus = "") {
  const partner = getPartner(id);
  if (!partner) return null;
  return upsertPartner({
    id,
    name: partner.name || partner.displayName,
    company: partner.company,
    role: partner.role,
    email: partner.email,
    phone: partner.phone,
    market: partner.market,
    city: partner.city,
    state: partner.state,
    country: partner.country,
    programTier: partner.program_tier,
    discountPercent: partner.discount_percent,
    monthlyTarget: partner.monthly_target,
    annualTarget: partner.annual_target,
    agreementStatus: agreementStatus || partner.agreementStatus || status,
    manager: partner.manager,
    source: partner.source,
    notes: partner.notes,
    status,
    portalToken: partner.portalToken,
  });
}

export function summarizePartner(partner, { includeProjects = false } = {}) {
  const database = initCrmDb();
  const linked = database.prepare(`
    select l.*, d.title, d.status as deal_status, d.budget, d.timeline, d.city, d.country, d.next_follow_up_at, d.created_at as deal_created_at
    from partner_project_links l
    join deals d on d.id = l.deal_id
    where l.partner_id = ?
    order by d.created_at desc
  `).all(partner.id).map((row) => ({ ...row, notes: decryptText(row.notes_enc) }));
  const now = new Date();
  const monthPrefix = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const activeProjects = linked.filter((row) => !["not_fit", "lost", "won", "completed"].includes(row.deal_status));
  const monthlyProjects = linked.filter((row) => String(row.deal_created_at || "").startsWith(monthPrefix));
  const completedProjects = linked.filter((row) => ["won", "completed"].includes(row.deal_status));
  const pipeline = {
    submitted: linked.length,
    active: activeProjects.length,
    month: monthlyProjects.length,
    completed: completedProjects.length,
  };
  return {
    id: partner.id,
    createdAt: partner.created_at,
    updatedAt: partner.updated_at,
    status: partner.status,
    programTier: partner.program_tier,
    programLabel: partnerProgramTiers[partner.program_tier]?.label || partner.program_tier,
    discountPercent: partner.discount_percent,
    monthlyTarget: partner.monthly_target,
    annualTarget: partner.annual_target,
    displayName: partner.displayName,
    company: partner.company || "",
    role: partner.role || "",
    market: partner.market || "",
    city: partner.city || "",
    country: partner.country || "",
    email: partner.email || "",
    phone: partner.phone || "",
    portalToken: partner.portalToken || "",
    agreementStatus: partner.agreementStatus || "",
    manager: partner.manager || "",
    source: partner.source || "",
    notes: partner.notes || "",
    pipeline,
    progress: {
      monthly: partner.monthly_target ? Math.min(monthlyProjects.length / partner.monthly_target, 1) : 0,
      annual: partner.annual_target ? Math.min(linked.length / partner.annual_target, 1) : 0,
    },
    projects: includeProjects ? linked.map((row) => ({
      dealId: row.deal_id,
      leadId: row.lead_id,
      title: row.title,
      status: row.deal_status,
      budget: row.budget,
      timeline: row.timeline,
      location: [row.city, row.country].filter(Boolean).join(", "),
      nextFollowUpAt: row.next_follow_up_at,
      relationship: row.relationship,
      notes: row.notes,
    })) : [],
  };
}

export function upsertPlannerProject({ projectId = "", accessToken = "", leadId = null, contactId = null, dealId = null, status = "draft", title = "", projectType = "", email = "", phone = "", snapshot = {}, estimate = "", notes = "" } = {}) {
  const database = initCrmDb();
  const existing = projectId ? database.prepare("select * from planner_projects where id = ? limit 1").get(projectId) : null;
  if (existing && existing.access_token_hash !== hashToken(accessToken)) return null;
  const id = existing?.id || cryptoId();
  const token = existing && accessToken ? accessToken : randomToken();
  const cleanSnapshot = normalizePlannerSnapshot(snapshot);
  const versionNo = Number(database.prepare("select coalesce(max(version_no), 0) as n from planner_project_versions where project_id = ?").get(id)?.n || 0) + 1;
  const payload = {
    title: title || cleanSnapshot.projectName || "Technical planner project",
    projectType: projectType || cleanSnapshot.projectType || "",
    estimate,
    notes,
    snapshot: cleanSnapshot,
  };
  if (existing) {
    database.prepare(`
      update planner_projects set updated_at = datetime('now'), lead_id = coalesce(@lead_id, lead_id),
      contact_id = coalesce(@contact_id, contact_id), deal_id = coalesce(@deal_id, deal_id), status = @status,
      title = @title, project_type = @project_type, email_hash = @email_hash, phone_hash = @phone_hash,
      encrypted_payload = @encrypted_payload where id = @id
    `).run({
      id,
      lead_id: leadId,
      contact_id: contactId,
      deal_id: dealId,
      status,
      title: payload.title,
      project_type: payload.projectType,
      email_hash: hashEmail(email),
      phone_hash: hashPhone(phone),
      encrypted_payload: encryptJson(payload),
    });
  } else {
    database.prepare(`
      insert into planner_projects (
        id, lead_id, contact_id, deal_id, status, title, project_type, email_hash, phone_hash,
        access_token_hash, encrypted_payload
      ) values (
        @id, @lead_id, @contact_id, @deal_id, @status, @title, @project_type, @email_hash, @phone_hash,
        @access_token_hash, @encrypted_payload
      )
    `).run({
      id,
      lead_id: leadId,
      contact_id: contactId,
      deal_id: dealId,
      status,
      title: payload.title,
      project_type: payload.projectType,
      email_hash: hashEmail(email),
      phone_hash: hashPhone(phone),
      access_token_hash: hashToken(token),
      encrypted_payload: encryptJson(payload),
    });
  }
  database.prepare(`
    insert into planner_project_versions (id, project_id, version_no, lead_id, deal_id, notes_enc, encrypted_snapshot)
    values (?, ?, ?, ?, ?, ?, ?)
  `).run(cryptoId(), id, versionNo, leadId, dealId, encryptText(notes), encryptJson(cleanSnapshot));
  return getPlannerProjectForToken(id, token);
}

export function getPlannerProjectForToken(id, accessToken) {
  const row = initCrmDb().prepare("select * from planner_projects where id = ? and access_token_hash = ? limit 1").get(String(id || ""), hashToken(accessToken));
  return row ? summarizePlannerProject(row, { includeSnapshot: true, includeToken: accessToken }) : null;
}

export function getPlannerProject(id) {
  const row = initCrmDb().prepare("select * from planner_projects where id = ? limit 1").get(String(id || ""));
  return row ? summarizePlannerProject(row, { includeSnapshot: true }) : null;
}

export function listPlannerProjects({ limit = 80, dealId = "", leadId = "" } = {}) {
  const cappedLimit = Math.min(Math.max(Number(limit) || 80, 1), 200);
  let rows;
  if (dealId) rows = initCrmDb().prepare("select * from planner_projects where deal_id = ? order by updated_at desc limit ?").all(dealId, cappedLimit);
  else if (leadId) rows = initCrmDb().prepare("select * from planner_projects where lead_id = ? order by updated_at desc limit ?").all(leadId, cappedLimit);
  else rows = initCrmDb().prepare("select * from planner_projects order by updated_at desc limit ?").all(cappedLimit);
  return rows.map((row) => summarizePlannerProject(row));
}

export function savePlannerProjectFromLead(lead) {
  if (lead.formType !== "technical_millwork_planner" || !lead.plannerConfig) return null;
  const crm = ensureCrmForLead(lead.id);
  const snapshot = typeof lead.plannerConfig === "string" ? parseJsonObject(lead.plannerConfig) : lead.plannerConfig;
  return upsertPlannerProject({
    projectId: lead.plannerProjectId || "",
    accessToken: lead.plannerProjectToken || "",
    leadId: lead.id,
    contactId: crm.contact?.id,
    dealId: crm.deal?.id,
    status: "submitted",
    title: snapshot.projectName || lead.fullName || "Technical planner project",
    projectType: snapshot.projectType || lead.projectType || "",
    email: lead.email,
    phone: lead.phone,
    snapshot,
    estimate: lead.plannerEstimate || "",
    notes: lead.designerNotes || lead.message || "",
  });
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
    emails: contact?.emails || [contact?.email || lead.email].filter(Boolean),
    phones: contact?.phones || [contact?.phone || lead.phone].filter(Boolean),
    contactWarnings: [
      contact?.emails?.length > 1 ? `Alternate emails: ${contact.emails.join(", ")}` : "",
      contact?.phones?.length > 1 ? `Alternate phones: ${contact.phones.join(", ")}` : "",
    ].filter(Boolean),
    zipCode: contact?.zip_code || lead.zipCode || lead.zip_code || "",
    location: [lead.city, lead.state || lead.stateProvince, lead.country].filter(Boolean).join(", "),
    projectType: lead.projectType || lead.project_type || deal?.project_type || "",
    service: lead.vertical || lead.serviceNeeded || lead.service || deal?.service || "",
    budget: lead.budget || deal?.budget || "",
    timeline: lead.timeline || deal?.timeline || "",
    sourceUrl: lead.sourceUrl || lead.source_url || deal?.source_url || "",
    message: lead.message || "",
    dealStatus: deal?.status || "",
    partnerId: deal?.partner_id || "",
    plannerProjectId: lead.plannerProjectId || "",
    plannerProjectToken: lead.plannerProjectToken || "",
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

export function deleteLeadFromCrm(leadId) {
  const normalized = String(leadId || "").trim();
  if (!normalized) return { ok: false };
  const database = initCrmDb();
  const dealRows = database.prepare("select id, contact_id from deals where lead_id = ?").all(normalized);
  const contactIds = [...new Set(dealRows.map((row) => row.contact_id).filter(Boolean))];
  database.exec("begin immediate");
  try {
    database.prepare("delete from activities where lead_id = ?").run(normalized);
    database.prepare("delete from lead_notifications where lead_id = ?").run(normalized);
    database.prepare("delete from deals where lead_id = ?").run(normalized);
    for (const contactId of contactIds) {
      const otherDeals = database.prepare("select 1 from deals where contact_id = ? limit 1").get(contactId);
      if (!otherDeals) database.prepare("delete from contacts where id = ? and source_lead_id = ?").run(contactId, normalized);
    }
    const result = database.prepare("delete from leads where id = ?").run(normalized);
    database.exec("commit");
    return { ok: result.changes > 0 };
  } catch (error) {
    database.exec("rollback");
    throw error;
  }
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

export function ensureEnvWebAdmin() {
  const username = String(process.env.CRM_ADMIN_USER || process.env.SEO_DASHBOARD_USER || "").trim();
  const password = String(process.env.CRM_ADMIN_PASS || process.env.SEO_DASHBOARD_PASS || "").trim();
  if (!username || !password) return null;
  const existing = getWebUserByUsername(username, { includeInactive: true });
  if (existing) return existing;
  return upsertWebUser({ username, password, role: "owner", status: "active", createdBy: "env" });
}

export function upsertWebUser({ username, password = "", role = "admin", status = "active", createdBy = "" }) {
  const normalized = normalizeUsername(username);
  if (!normalized) throw new Error("username required");
  const database = initCrmDb();
  const existing = database.prepare("select * from web_users where username = ? limit 1").get(normalized);
  const safeRole = ["owner", "admin", "designer", "builder", "partner"].includes(role) ? role : "admin";
  const safeStatus = ["active", "inactive"].includes(status) ? status : "active";
  const passwordHash = password ? hashPassword(password) : existing?.password_hash || "";
  if (!passwordHash) throw new Error("password required");
  if (existing) {
    database.prepare(`
      update web_users set updated_at = datetime('now'), role = ?, status = ?, password_hash = ? where id = ?
    `).run(safeRole, safeStatus, passwordHash, existing.id);
    return getWebUserById(existing.id);
  }
  const id = cryptoId();
  database.prepare(`
    insert into web_users (id, username, password_hash, role, status, created_by)
    values (?, ?, ?, ?, ?, ?)
  `).run(id, normalized, passwordHash, safeRole, safeStatus, createdBy);
  return getWebUserById(id);
}

export function authenticateWebUser(username, password) {
  const user = getWebUserByUsername(username);
  if (!user || !verifyPassword(password, user.password_hash)) return null;
  initCrmDb().prepare("update web_users set last_login_at = datetime('now'), updated_at = datetime('now') where id = ?").run(user.id);
  return publicWebUser(user);
}

export function createWebSession(userId, ttlDays = 30) {
  const database = initCrmDb();
  const user = getWebUserById(userId);
  if (!user || user.status !== "active") return null;
  const token = randomToken(32);
  const expiresAt = new Date(Date.now() + Number(ttlDays || 30) * 24 * 60 * 60 * 1000).toISOString();
  database.prepare(`
    insert into web_sessions (token_hash, user_id, created_at, expires_at, status)
    values (?, ?, datetime('now'), ?, 'active')
  `).run(hashToken(token), user.id, expiresAt);
  return { token, expiresAt, user: publicWebUser(user) };
}

export function getWebSession(token) {
  const normalized = String(token || "").trim();
  if (!normalized) return null;
  const row = initCrmDb().prepare(`
    select s.token_hash, s.user_id, s.created_at, s.expires_at, s.status as session_status,
      u.id, u.username, u.password_hash, u.role, u.status, u.created_at as user_created_at,
      u.updated_at, u.last_login_at, u.created_by
    from web_sessions s
    join web_users u on u.id = s.user_id
    where s.token_hash = ? and s.status = 'active' and u.status = 'active'
    limit 1
  `).get(hashToken(normalized));
  if (!row) return null;
  if (new Date(row.expires_at).getTime() < Date.now()) {
    initCrmDb().prepare("update web_sessions set status = 'expired' where token_hash = ?").run(row.token_hash);
    return null;
  }
  return { user: publicWebUser(row), expiresAt: row.expires_at };
}

export function revokeWebSession(token) {
  const normalized = String(token || "").trim();
  if (!normalized) return;
  initCrmDb().prepare("update web_sessions set status = 'revoked' where token_hash = ?").run(hashToken(normalized));
}

export function listWebUsers() {
  ensureEnvWebAdmin();
  return initCrmDb().prepare(`
    select id, username, role, status, created_at, updated_at, last_login_at, created_by
    from web_users
    order by created_at desc
  `).all().map(publicWebUser);
}

function getWebUserByUsername(username, { includeInactive = false } = {}) {
  ensureWebUserSchema(initCrmDb());
  const normalized = normalizeUsername(username);
  if (!normalized) return null;
  const row = initCrmDb().prepare(`select * from web_users where username = ? ${includeInactive ? "" : "and status = 'active'"} limit 1`).get(normalized);
  return row || null;
}

function getWebUserById(id) {
  const row = initCrmDb().prepare("select * from web_users where id = ? limit 1").get(String(id || ""));
  return row || null;
}

function publicWebUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    username: user.username,
    role: user.role || "admin",
    status: user.status || "active",
    created_at: user.user_created_at || user.created_at || "",
    updated_at: user.updated_at || "",
    last_login_at: user.last_login_at || "",
    created_by: user.created_by || "",
  };
}

function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(String(password), salt, 210000, 32, "sha256").toString("hex");
  return `pbkdf2$210000$${salt}$${hash}`;
}

function verifyPassword(password, stored) {
  const [kind, iterations, salt, hash] = String(stored || "").split("$");
  if (kind !== "pbkdf2" || !iterations || !salt || !hash) return false;
  const actual = pbkdf2Sync(String(password || ""), salt, Number(iterations), 32, "sha256");
  const expected = Buffer.from(hash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
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
    email_hash: hashEmail(lead.email),
    phone_hash: hashPhone(lead.phone),
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

function decryptPartnerRow(row) {
  const payload = decryptJson(row.encrypted_payload);
  return {
    ...row,
    ...payload,
    displayName: payload.company || payload.name || row.company_hint || row.name_hint || "Unnamed partner",
  };
}

function summarizePlannerProject(row, { includeSnapshot = false, includeToken = "" } = {}) {
  const payload = decryptJson(row.encrypted_payload);
  const latest = initCrmDb().prepare("select max(version_no) as version from planner_project_versions where project_id = ?").get(row.id);
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    leadId: row.lead_id || "",
    contactId: row.contact_id || "",
    dealId: row.deal_id || "",
    status: row.status,
    title: row.title || payload.title || "Technical planner project",
    projectType: row.project_type || payload.projectType || "",
    estimate: payload.estimate || "",
    version: latest?.version || 1,
    accessToken: includeToken || "",
    snapshot: includeSnapshot ? payload.snapshot || {} : undefined,
  };
}

function normalizePlannerSnapshot(snapshot) {
  const value = snapshot && typeof snapshot === "object" ? snapshot : {};
  return {
    projectName: String(value.projectName || "").slice(0, 160),
    projectType: String(value.projectType || "").slice(0, 160),
    region: String(value.region || "").slice(0, 80),
    complexity: String(value.complexity || "").slice(0, 80),
    surface: value.surface && typeof value.surface === "object" ? value.surface : {},
    modules: Array.isArray(value.modules) ? value.modules.slice(0, 300) : [],
    estimate: value.estimate && typeof value.estimate === "object" ? value.estimate : {},
  };
}

function parseJsonObject(value) {
  try {
    const parsed = JSON.parse(String(value || "{}"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function findPartnerMatch(emailHash, phoneHash, companyHint, nameHint) {
  const database = initCrmDb();
  if (emailHash) {
    const row = database.prepare("select * from partners where email_hash = ? limit 1").get(emailHash);
    if (row) return row;
  }
  if (phoneHash) {
    const row = database.prepare("select * from partners where phone_hash = ? limit 1").get(phoneHash);
    if (row) return row;
  }
  const company = String(companyHint || "").trim().toLowerCase();
  const name = String(nameHint || "").trim().toLowerCase();
  if (company) {
    const row = database.prepare("select * from partners where lower(company_hint) = ? limit 1").get(company);
    if (row) return row;
  }
  if (name) {
    return database.prepare("select * from partners where lower(name_hint) = ? limit 1").get(name) || null;
  }
  return null;
}

function normalizePartnerTier(value) {
  const normalized = String(value || "").trim().toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");
  if (partnerProgramTiers[normalized]) return normalized;
  if (["annual", "channel", "elite", "30"].includes(normalized)) return "annual_channel_partner";
  if (["portfolio", "growth", "20", "5+"].includes(normalized)) return "portfolio_partner";
  return "project_partner";
}

function normalizePartnerDiscount(value, tier) {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed >= 0) return Math.min(Math.round(parsed), 30);
  return partnerProgramTiers[tier]?.discount || 10;
}

function randomToken() {
  return randomBytes(24).toString("base64url");
}

function hashToken(value) {
  return createHash("sha256").update(String(value || "")).digest("hex");
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

    create table if not exists contact_identity_keys (
      contact_id text not null,
      kind text not null,
      identity_hash text not null,
      created_at text not null default (datetime('now')),
      primary key (kind, identity_hash)
    );
    create index if not exists contact_identity_keys_contact_idx on contact_identity_keys(contact_id);

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
      partner_id text,
      source_url text,
      next_follow_up_at text,
      encrypted_payload text not null
    );
    create index if not exists deals_status_idx on deals(status);
    create index if not exists deals_lead_id_idx on deals(lead_id);
    create index if not exists deals_next_follow_up_idx on deals(next_follow_up_at);

    create table if not exists partners (
      id text primary key,
      created_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now')),
      status text not null default 'prospect',
      program_tier text not null default 'project_partner',
      discount_percent integer not null default 10,
      monthly_target integer not null default 1,
      annual_target integer not null default 1,
      company_hint text,
      name_hint text,
      email_hash text,
      phone_hash text,
      portal_token_hash text,
      encrypted_payload text not null
    );
    create index if not exists partners_status_idx on partners(status, program_tier);
    create index if not exists partners_company_idx on partners(company_hint);
    create index if not exists partners_email_hash_idx on partners(email_hash);
    create index if not exists partners_phone_hash_idx on partners(phone_hash);

    create table if not exists partner_project_links (
      partner_id text not null,
      deal_id text not null,
      lead_id text,
      relationship text not null default 'referral',
      status text not null default 'active',
      created_at text not null default (datetime('now')),
      notes_enc text,
      primary key (partner_id, deal_id)
    );
    create index if not exists partner_project_links_partner_idx on partner_project_links(partner_id, status);
    create index if not exists partner_project_links_deal_idx on partner_project_links(deal_id);
    create index if not exists partner_project_links_lead_idx on partner_project_links(lead_id);

    create table if not exists planner_projects (
      id text primary key,
      created_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now')),
      lead_id text,
      contact_id text,
      deal_id text,
      status text not null default 'draft',
      title text,
      project_type text,
      email_hash text,
      phone_hash text,
      access_token_hash text not null,
      encrypted_payload text not null
    );
    create index if not exists planner_projects_lead_idx on planner_projects(lead_id);
    create index if not exists planner_projects_deal_idx on planner_projects(deal_id);
    create index if not exists planner_projects_status_idx on planner_projects(status, updated_at);

    create table if not exists planner_project_versions (
      id text primary key,
      project_id text not null,
      version_no integer not null,
      created_at text not null default (datetime('now')),
      lead_id text,
      deal_id text,
      notes_enc text,
      encrypted_snapshot text not null
    );
    create index if not exists planner_project_versions_project_idx on planner_project_versions(project_id, version_no);

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

    create table if not exists web_users (
      id text primary key,
      username text not null unique,
      password_hash text not null,
      role text not null default 'admin',
      status text not null default 'active',
      created_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now')),
      last_login_at text,
      created_by text
    );
    create index if not exists web_users_status_idx on web_users(status, role);

    create table if not exists web_sessions (
      token_hash text primary key,
      user_id text not null,
      created_at text not null default (datetime('now')),
      expires_at text not null,
      status text not null default 'active'
    );
    create index if not exists web_sessions_user_idx on web_sessions(user_id, status, expires_at);
  `;
}

function ensureWebUserSchema(database) {
  database.exec(`
    create table if not exists web_users (
      id text primary key,
      username text not null unique,
      password_hash text not null,
      role text not null default 'admin',
      status text not null default 'active',
      created_at text not null default (datetime('now')),
      updated_at text not null default (datetime('now')),
      last_login_at text,
      created_by text
    );
    create index if not exists web_users_status_idx on web_users(status, role);
    create table if not exists web_sessions (
      token_hash text primary key,
      user_id text not null,
      created_at text not null default (datetime('now')),
      expires_at text not null,
      status text not null default 'active'
    );
    create index if not exists web_sessions_user_idx on web_sessions(user_id, status, expires_at);
  `);
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

function hashEmail(value) {
  return hashValue(normalizeEmail(value));
}

function hashPhone(value) {
  return hashValue(normalizePhone(value));
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizePhone(value) {
  const raw = String(value || "").trim();
  const digits = raw.replace(/\D/g, "");
  return digits || raw.toLowerCase();
}

function uniqueList(values) {
  const seen = new Set();
  const result = [];
  for (const value of values) {
    const text = String(value || "").trim();
    if (!text) continue;
    const key = text.includes("@") ? normalizeEmail(text) : normalizePhone(text);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(text);
  }
  return result;
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
