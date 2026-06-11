import { readFileSync } from "node:fs";
import {
  acknowledgeNotification,
  bumpNotificationReminder,
  closeActivity,
  consumeTelegramAccessPin,
  createTelegramAccessPin,
  ensureCrmForLead,
  getCrmSummary,
  getDueActivities,
  getLead,
  getLeadActivities,
  getNewLeads,
  getOldUncontactedLeads,
  initCrmDb,
  insertActivity,
  isTelegramUserAuthorized,
  listPartners,
  markLeadContacted,
  markLeadNotFit,
  setLeadFollowUpAt,
  updatePartnerStatus,
  updateLeadStatus,
  upsertNotification,
} from "./crm-db.mjs";

loadEnvFile("/var/www/casaurum.com/.env.production");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const CRM_APP_URL = (process.env.TELEGRAM_CRM_APP_URL || `${process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://casaurum.com"}/crm-app`).replace(/\/$/, "");
const BOT_POLL_INTERVAL_MS = Number(process.env.BOT_POLL_INTERVAL_MS || 15_000);
const BOT_REMINDER_AFTER_MINUTES = Number(process.env.BOT_REMINDER_AFTER_MINUTES || 60);
const BOT_ESCALATE_AFTER_HOURS = Number(process.env.BOT_ESCALATE_AFTER_HOURS || 24);

let updateOffset = 0;
let running = true;

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

assertConfig();
initCrmDb();
console.log("CAS AURUM local CRM Telegram bot started");

while (running) {
  try {
    await Promise.all([pollTelegramUpdates(), scanNewLeads(), scanPartnerApplications(), sendFollowUpReminders()]);
  } catch (error) {
    console.error("Bot loop error:", error.message);
  }
  await wait(BOT_POLL_INTERVAL_MS);
}

function shutdown() {
  running = false;
  console.log("CAS AURUM lead bot stopping");
}

function assertConfig() {
  const missing = [];
  if (!TELEGRAM_BOT_TOKEN) missing.push("TELEGRAM_BOT_TOKEN");
  if (!TELEGRAM_CHAT_ID) missing.push("TELEGRAM_CHAT_ID");
  if (!process.env.LEADS_ENCRYPTION_KEY) missing.push("LEADS_ENCRYPTION_KEY");
  if (missing.length) throw new Error(`Missing bot env: ${missing.join(", ")}`);
}

async function scanNewLeads() {
  for (const lead of getNewLeads(10)) {
    await notifyLead(lead);
  }
}

async function notifyLead(lead) {
  const sent = await telegram("sendMessage", {
    chat_id: TELEGRAM_CHAT_ID,
    text: leadMessage(lead),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [webAppButton("🧩 CRM App")],
        [contactButton(lead), button("⏰ Напомнить", `remind:${lead.id}`)],
        [button("📇 Карточка", `card:${lead.id}`), button("📌 Запрос", `original:${lead.id}`)],
        [button("👤 CRM", `crm:${lead.id}`), button("📝 Заметка", `note:${lead.id}`), button("🗒 История", `history:${lead.id}`)],
        [button("❌ Не подходит", `notfit:${lead.id}`)],
      ],
    },
  });
  upsertNotification({ leadId: lead.id, chatId: TELEGRAM_CHAT_ID, messageId: sent.message_id, payload: sent });
  updateLeadStatus(lead.id, "notified");
}

async function scanPartnerApplications() {
  const partners = listPartners({ status: "prospect", limit: 20 }).filter((partner) => partner.agreementStatus === "application_received");
  for (const partner of partners) {
    await notifyPartnerApplication(partner);
  }
}

async function notifyPartnerApplication(partner) {
  await telegram("sendMessage", {
    chat_id: TELEGRAM_CHAT_ID,
    text: partnerApplicationMessage(partner),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [webAppButton("🧩 CRM App")],
        [button("✅ Approve partner", `papprove:${partner.id}`), button("❌ Reject", `preject:${partner.id}`)],
        [button("📇 Partner card", `pcard:${partner.id}`)],
      ],
    },
  });
  updatePartnerStatus(partner.id, "prospect", "notified");
}

async function pollTelegramUpdates() {
  const result = await telegram("getUpdates", {
    offset: updateOffset || undefined,
    timeout: 1,
    allowed_updates: ["callback_query", "message"],
  });
  for (const update of result) {
    updateOffset = update.update_id + 1;
    if (update.callback_query) {
      if (!(await ensureTelegramAccess(update.callback_query.from, update.callback_query.message?.chat?.id, update.callback_query.id))) continue;
      await handleCallback(update.callback_query);
    }
    if (update.message?.text) {
      if (!isTelegramUserAuthorized(update.message.from?.id)) {
        await handleUnauthorizedMessage(update.message);
        continue;
      }
      if (update.message.reply_to_message) await handleReplyNote(update.message);
      else if (/^\/start/i.test(update.message.text)) await sendAuthorizedWelcome(update.message.chat.id);
    }
  }
}

async function ensureTelegramAccess(user, chatId, callbackQueryId = "") {
  const userId = String(user?.id || "");
  if (isTelegramUserAuthorized(userId)) return true;
  if (callbackQueryId) await answerCallback(callbackQueryId, "Нет доступа. Напиши PIN в чат с ботом.");
  return false;
}

async function handleUnauthorizedMessage(message) {
  const user = message.from || {};
  const text = String(message.text || "").trim();
  if (/^\d{6}$/.test(text)) {
    const result = consumeTelegramAccessPin({
      pin: text,
      userId: user.id,
      username: user.username || "",
      firstName: user.first_name || "",
      lastName: user.last_name || "",
    });
    if (result.ok) {
      await telegram("sendMessage", {
        chat_id: message.chat.id,
        text: "✅ Доступ подключен. Теперь можно открыть CRM App через меню бота.",
        reply_markup: { inline_keyboard: [[webAppButton("🧩 CRM App")]] },
      });
      await telegram("sendMessage", {
        chat_id: TELEGRAM_CHAT_ID,
        text: `✅ Новый пользователь подключен к CRM: ${escapeTg(userLabel(user))} · ID ${escapeTg(user.id)}`,
        parse_mode: "HTML",
      });
      return true;
    }
    await telegram("sendMessage", { chat_id: message.chat.id, text: `❌ ${result.message}` });
    return false;
  }
  const pin = createTelegramAccessPin({
    requestedBy: user.id,
    username: user.username || "",
    firstName: user.first_name || "",
    ttlMinutes: 15,
  });
  await telegram("sendMessage", {
    chat_id: TELEGRAM_CHAT_ID,
    text: [
      "🔐 <b>Запрос доступа к CAS AURUM CRM</b>",
      `<b>Пользователь:</b> ${escapeTg(userLabel(user))}`,
      `<b>Telegram ID:</b> <code>${escapeTg(user.id)}</code>`,
      "",
      `<b>PIN:</b> <code>${escapeTg(pin.pin)}</code>`,
      `Действует до: ${escapeTg(formatDate(pin.expiresAt))}`,
      "",
      "Передай PIN только если хочешь дать доступ к CRM.",
    ].join("\n"),
    parse_mode: "HTML",
  });
  await telegram("sendMessage", {
    chat_id: message.chat.id,
    text: "🔐 Для доступа к CAS AURUM CRM нужен одноразовый PIN. Я отправил новый PIN владельцу. Введите 6 цифр сюда, когда получите код.",
  });
  return false;
}

async function sendAuthorizedWelcome(chatId) {
  return telegram("sendMessage", {
    chat_id: chatId,
    text: "CAS AURUM CRM доступна. Открой приложение через кнопку ниже.",
    reply_markup: { inline_keyboard: [[webAppButton("🧩 CRM App")]] },
  });
}

async function handleCallback(query) {
  const [action, leadId] = String(query.data || "").split(":");
  if (!action || !leadId) return answerCallback(query.id, "Unknown action");
  if (action === "papprove" || action === "preject" || action === "pcard") return handlePartnerCallback(query, action, leadId);
  if (!getLead(leadId)) return answerCallback(query.id, "Лид не найден или уже удален из CRM");

  if (action === "contacted") {
    const wasContacted = getLead(leadId)?.status === "contacted";
    markLeadContacted(leadId);
    await answerCallback(query.id, wasContacted ? "Отмечено: связался повторно" : "Отмечено: связался");
    await updateMessageButtons(query.message, leadId, "contacted");
    return sendCrmCard(query.message.chat.id, leadId);
  }
  if (action === "remind") {
    await answerCallback(query.id, "Напиши когда напомнить");
    return telegram("sendMessage", {
      chat_id: query.message.chat.id,
      text: [
        `⏰ Напиши время и контекст напоминания для лида ${leadId}.`,
        "",
        "Примеры:",
        "через 2 часа — позвонить еще раз",
        "через 30 минут — отправить каталог",
        "завтра 10:00 — уточнить бюджет",
        "2026-06-05 15:30 — отправить follow-up",
      ].join("\n"),
      reply_to_message_id: query.message.message_id,
    });
  }
  if (action === "crm") {
    const crm = ensureCrmForLead(leadId);
    updateLeadStatus(leadId, "crm_created");
    await answerCallback(query.id, "CRM карточка создана/обновлена");
    return sendCrmCard(query.message.chat.id, leadId, crm);
  }
  if (action === "notfit") {
    markLeadNotFit(leadId);
    await answerCallback(query.id, "Отмечено: не подходит. Убираю заявку из чата.");
    return removeLeadMessage(query.message, leadId);
  }
  if (action === "card") {
    await answerCallback(query.id, "Открываю CRM карточку");
    return sendCrmCard(query.message.chat.id, leadId);
  }
  if (action === "original") {
    await answerCallback(query.id, "Показываю исходный запрос");
    return sendOriginalLead(query.message.chat.id, leadId);
  }
  if (action === "history") {
    await answerCallback(query.id, "Показываю историю");
    return sendLeadHistory(query.message.chat.id, leadId);
  }
  if (action === "note") {
    await answerCallback(query.id, "Ответь сообщением на карточку лида, и бот сохранит заметку.");
    await telegram("sendMessage", {
      chat_id: query.message.chat.id,
      text: `Напиши заметку ответом на это сообщение для лида ${leadId}.`,
      reply_to_message_id: query.message.message_id,
    });
  }
}

async function handlePartnerCallback(query, action, partnerId) {
  if (action === "papprove") {
    const partner = updatePartnerStatus(partnerId, "active", "approved");
    await answerCallback(query.id, partner ? "Partner approved" : "Partner not found");
    if (partner) return sendPartnerCard(query.message.chat.id, partner.id);
    return;
  }
  if (action === "preject") {
    const partner = updatePartnerStatus(partnerId, "rejected", "rejected");
    await answerCallback(query.id, partner ? "Partner rejected" : "Partner not found");
    if (partner) return sendPartnerCard(query.message.chat.id, partner.id);
    return;
  }
  await answerCallback(query.id, "Partner card");
  return sendPartnerCard(query.message.chat.id, partnerId);
}

async function sendPartnerCard(chatId, partnerId) {
  const partner = listPartners({ status: "all", limit: 200 }).find((item) => item.id === partnerId);
  if (!partner) return telegram("sendMessage", { chat_id: chatId, text: "Partner not found." });
  return telegram("sendMessage", {
    chat_id: chatId,
    text: partnerApplicationMessage(partner),
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [webAppButton("🧩 CRM App")],
        [button("✅ Approve partner", `papprove:${partner.id}`), button("❌ Reject", `preject:${partner.id}`)],
      ],
    },
  });
}

async function handleReplyNote(message) {
  const original = message.reply_to_message?.text || "";
  const leadId = extractLeadId(original);
  if (!leadId) return;
  if (/напоминани|напомнить|время и контекст/i.test(original)) return handleReplyReminder(message, leadId);
  const crm = ensureCrmForLead(leadId);
  insertActivity({
    leadId,
    contactId: crm.contact?.id,
    dealId: crm.deal?.id,
    type: "note",
    status: "completed",
    completedAt: new Date().toISOString(),
    notes: message.text,
    payload: { telegram_message_id: message.message_id },
  });
  await telegram("sendMessage", {
    chat_id: message.chat.id,
    text: `Заметка сохранена в CRM.\n\n${crmCardMessage(getCrmSummary(leadId))}`,
    parse_mode: "HTML",
    reply_to_message_id: message.message_id,
  });
}

async function handleReplyReminder(message, leadId) {
  const parsed = parseReminderText(message.text);
  if (!parsed.dueAt) {
    return telegram("sendMessage", {
      chat_id: message.chat.id,
      text: "Не понял время. Напиши, например: через 2 часа — позвонить или завтра 10:00 — уточнить бюджет.",
      reply_to_message_id: message.message_id,
    });
  }
  const context = parsed.context || "Follow-up reminder";
  setLeadFollowUpAt(leadId, parsed.dueAt.toISOString(), context);
  return telegram("sendMessage", {
    chat_id: message.chat.id,
    text: `Напоминание поставлено на ${escapeTg(formatDate(parsed.dueAt.toISOString()))}.\nКонтекст: ${escapeTg(context)}`,
    parse_mode: "HTML",
    reply_to_message_id: message.message_id,
  });
}

async function sendCrmCard(chatId, leadId, crm = null) {
  const summary = crm ? { ...crm, activities: getLeadActivities(leadId, 12) } : getCrmSummary(leadId);
  return telegram("sendMessage", {
    chat_id: chatId,
    text: crmCardMessage(summary),
    parse_mode: "HTML",
    disable_web_page_preview: true,
      reply_markup: {
        inline_keyboard: [
          [webAppButton("🧩 CRM App")],
          [contactButton(summary.lead), button("⏰ Напомнить", `remind:${leadId}`)],
          [button("📌 Исходный запрос", `original:${leadId}`), button("🗒 История", `history:${leadId}`), button("📝 Заметка", `note:${leadId}`)],
        ],
    },
  });
}

async function sendOriginalLead(chatId, leadId) {
  const lead = getLead(leadId);
  if (!lead) return telegram("sendMessage", { chat_id: chatId, text: "Лид не найден." });
  return telegram("sendMessage", {
    chat_id: chatId,
    text: originalLeadMessage(lead),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

async function sendLeadHistory(chatId, leadId) {
  const lead = getLead(leadId);
  const activities = getLeadActivities(leadId, 20);
  return telegram("sendMessage", {
    chat_id: chatId,
    text: historyMessage(lead, activities),
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

async function sendFollowUpReminders() {
  const dueActivities = getDueActivities(new Date().toISOString(), 10);
  for (const activity of dueActivities) {
    if (["not_fit", "won", "lost"].includes(activity.deal_status)) {
      closeActivity(activity.id);
      continue;
    }
    await telegram("sendMessage", {
      chat_id: TELEGRAM_CHAT_ID,
      text: reminderMessage(activity),
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [webAppButton("🧩 CRM App")],
          [button("✅ Связался", `contacted:${activity.lead_id}`), button("⏰ Еще напомнить", `remind:${activity.lead_id}`)],
          [button("📇 Карточка", `card:${activity.lead_id}`), button("🗒 История", `history:${activity.lead_id}`)],
          [button("❌ Не подходит", `notfit:${activity.lead_id}`)],
        ],
      },
    });
    closeActivity(activity.id, "reminded");
    bumpNotificationReminder(activity.lead_id);
  }
  await sendEscalations();
}

async function sendEscalations() {
  const cutoff = new Date(Date.now() - BOT_ESCALATE_AFTER_HOURS * 60 * 60_000).toISOString();
  for (const lead of getOldUncontactedLeads(cutoff, 10)) {
    await telegram("sendMessage", {
      chat_id: TELEGRAM_CHAT_ID,
      text: `⚠️ <b>Старая заявка без контакта</b>\n${leadShortLine(lead)}\nСоздана: ${formatDate(lead.created_at)}`,
      parse_mode: "HTML",
      reply_markup: { inline_keyboard: [[button("✅ Связался", `contacted:${lead.id}`), button("👤 CRM", `crm:${lead.id}`)]] },
    });
    updateLeadStatus(lead.id, "escalated");
  }
}

function leadMessage(lead) {
  return [
    "🟡 <b>Новая заявка CAS AURUM</b>",
    `<b>ID:</b> <code>${escapeTg(lead.id)}</code>`,
    "",
    `<b>Клиент:</b> ${escapeTg(fullName(lead) || "No name")}`,
    `<b>Тел:</b> ${escapeTg(lead.phone || "-")}`,
    `<b>Email:</b> ${escapeTg(lead.email || "-")}`,
    lead.whatsapp ? `<b>WhatsApp:</b> ${escapeTg(lead.whatsapp)}` : "",
    "",
    `<b>Услуга:</b> ${escapeTg(lead.vertical || lead.serviceNeeded || lead.service || "-")}`,
    `<b>Тип:</b> ${escapeTg(lead.leadType || lead.formType || "-")}`,
    `<b>Проект:</b> ${escapeTg(lead.projectType || "-")}`,
    `<b>Бюджет:</b> ${escapeTg(lead.budget || "-")}`,
    `<b>Срок:</b> ${escapeTg(lead.timeline || "-")}`,
    lead.uploadedFiles?.length ? `<b>Файлы:</b> ${escapeTg(lead.uploadedFiles.map((file) => file.name || file).join(", "))}` : "",
    "",
    `<b>Локация:</b> ${escapeTg(locationLine(lead))}`,
    `<b>Источник:</b> ${escapeTg(lead.sourceUrl || "-")}`,
    "",
    lead.message ? `<b>Сообщение:</b>\n${escapeTg(lead.message).slice(0, 1500)}` : "",
  ].filter(Boolean).join("\n");
}

function partnerApplicationMessage(partner) {
  const portalUrl = partner.portalToken ? `${CRM_APP_URL.replace(/\/crm-app$/, "")}/partner-portal?partner=${encodeURIComponent(partner.id)}&token=${encodeURIComponent(partner.portalToken)}` : "";
  return [
    "🤝 <b>Новая партнерская заявка CAS AURUM</b>",
    `<b>Partner ID:</b> <code>${escapeTg(partner.id)}</code>`,
    "",
    `<b>Имя:</b> ${escapeTg(partner.displayName || partner.name || "-")}`,
    `<b>Юрлицо / компания:</b> ${escapeTg(partner.company || "-")}`,
    `<b>Тип:</b> ${escapeTg(partner.role || "-")}`,
    `<b>Email:</b> ${escapeTg(partner.email || "-")}`,
    `<b>Тел:</b> ${escapeTg(partner.phone || "-")}`,
    `<b>Рынок:</b> ${escapeTg([partner.market, partner.city, partner.country].filter(Boolean).join(", ") || "-")}`,
    "",
    `<b>Status:</b> ${escapeTg(partner.status || "-")} · <b>Agreement:</b> ${escapeTg(partner.agreementStatus || "-")}`,
    `<b>Level:</b> ${escapeTg(partner.programLabel || "-")} · <b>Discount:</b> ${escapeTg(partner.discountPercent || 0)}%`,
    partner.notes ? `<b>Заметка:</b>\n${escapeTg(partner.notes).slice(0, 1200)}` : "",
    portalUrl ? `<b>Portal:</b> ${escapeTg(portalUrl)}` : "",
  ].filter(Boolean).join("\n");
}

function crmCardMessage(summary) {
  const { lead, contact, deal, activities = [] } = summary;
  const notes = activities.filter((activity) => activity.type === "note" && activity.notes).slice(0, 3);
  return [
    "📇 <b>CRM карточка CAS AURUM</b>",
    `<b>Lead ID:</b> <code>${escapeTg(lead.id)}</code>`,
    `<b>Статус лида:</b> ${escapeTg(lead.status || "-")}`,
    `<b>Сделка:</b> ${escapeTg(deal?.title || "-")}`,
    `<b>Статус сделки:</b> ${escapeTg(deal?.status || "-")} · <b>Приоритет:</b> ${escapeTg(deal?.priority || "-")}`,
    "",
    `<b>Контакт:</b> ${escapeTg([contact?.first_name, contact?.last_name].filter(Boolean).join(" ") || fullName(lead) || "-")}`,
    `<b>Тел:</b> ${escapeTg(contact?.phone || lead.phone || "-")}`,
    `<b>Email:</b> ${escapeTg(contact?.email || lead.email || "-")}`,
    contact?.phones?.length > 1 ? `<b>Другие телефоны:</b> ${escapeTg(contact.phones.filter((item) => item !== contact.phone).join(", ") || "-")}` : "",
    contact?.emails?.length > 1 ? `<b>Другие email:</b> ${escapeTg(contact.emails.filter((item) => item !== contact.email).join(", ") || "-")}` : "",
    `<b>ZIP:</b> ${escapeTg(contact?.zip_code || zipCode(lead) || "-")}`,
    "",
    `<b>Project type:</b> ${escapeTg(lead.projectType || deal?.project_type || "-")}`,
    `<b>Service:</b> ${escapeTg(lead.vertical || lead.serviceNeeded || deal?.service || "-")}`,
    `<b>Budget:</b> ${escapeTg(lead.budget || deal?.budget || "-")}`,
    `<b>Timeline:</b> ${escapeTg(lead.timeline || deal?.timeline || "-")}`,
    `<b>Source:</b> ${escapeTg(lead.sourceUrl || deal?.source_url || "-")}`,
    "",
    notes.length ? `<b>Последние заметки:</b>\n${notes.map((activity) => `• ${escapeTg(formatDate(activity.created_at))}: ${escapeTg(activity.notes).slice(0, 500)}`).join("\n")}` : "<b>Заметки:</b> пока нет",
  ].join("\n");
}

function originalLeadMessage(lead) {
  return [
    "📌 <b>Исходный запрос</b>",
    leadMessage(lead),
    "",
    `<b>Создан:</b> ${escapeTg(formatDate(lead.created_at || lead.timestamp))}`,
    `<b>UTM:</b> ${escapeTg([lead.utmSource, lead.utmMedium, lead.utmCampaign, lead.utmTerm, lead.utmContent].filter(Boolean).join(" / ") || "-")}`,
  ].join("\n");
}

function historyMessage(lead, activities) {
  const rows = [
    `• ${escapeTg(formatDate(lead?.created_at || lead?.timestamp))} · <b>Запрос</b>\n${escapeTg(leadSummaryText(lead)).slice(0, 1200)}`,
    ...activities.slice().reverse().map((activity) => historyActivityLine(activity)),
  ];
  return [
    "🗒 <b>История CRM</b>",
    `<b>Клиент:</b> ${escapeTg(fullName(lead) || lead?.email || "-")}`,
    "",
    rows.join("\n\n"),
  ].join("\n");
}

function historyActivityLine(activity) {
  const labels = {
    new_lead: "CRM карточка создана",
    note: "Заметка",
    contacted: "Связался",
    contacted_again: "Связался повторно",
    follow_up: activity.status === "open" ? "Запланировано напоминание" : "Напоминание",
    not_fit: "Не подходит",
  };
  const due = activity.due_at ? `\nКогда напомнить: ${escapeTg(formatDate(activity.due_at))}` : "";
  const note = activity.notes ? `\n${escapeTg(activity.notes).slice(0, 900)}` : "";
  return `• ${escapeTg(formatDate(activity.completed_at || activity.created_at))} · <b>${escapeTg(labels[activity.type] || activity.type)}</b>${due}${note}`;
}

function leadSummaryText(lead) {
  return [
    `Клиент: ${fullName(lead) || "-"}`,
    `Тел: ${lead.phone || "-"}`,
    `Email: ${lead.email || "-"}`,
    `Локация: ${locationLine(lead)}`,
    `Project type: ${lead.projectType || "-"}`,
    `Service: ${lead.vertical || lead.serviceNeeded || lead.service || "-"}`,
    `Budget: ${lead.budget || "-"}`,
    `Timeline: ${lead.timeline || "-"}`,
    `Message: ${lead.message || "-"}`,
  ].join("\n");
}

function reminderMessage(activity) {
  const contact = activity.contact || {};
  return [
    "⏰ <b>Напоминание: связаться с клиентом</b>",
    `<b>Сделка:</b> ${escapeTg(activity.deal_title || "-")}`,
    `<b>Клиент:</b> ${escapeTg([contact.first_name, contact.last_name].filter(Boolean).join(" ") || "-")}`,
    `<b>Тел:</b> ${escapeTg(contact.phone || "-")}`,
    `<b>Email:</b> ${escapeTg(contact.email || "-")}`,
    activity.notes ? `<b>Контекст:</b> ${escapeTg(activity.notes)}` : "",
  ].join("\n");
}

function leadShortLine(lead) {
  return `${escapeTg(fullName(lead) || "No name")} · ${escapeTg(lead.phone || lead.email || "-")} · ${escapeTg(lead.vertical || lead.serviceNeeded || "-")} · ${escapeTg(zipCode(lead) || "-")}`;
}

function locationLine(lead) {
  return [lead.city, lead.state || lead.stateProvince, lead.country, zipCode(lead) ? `ZIP ${zipCode(lead)}` : ""].filter(Boolean).join(", ") || "-";
}

function zipCode(lead) {
  return lead?.zipCode || lead?.zip_code || "";
}

function fullName(lead) {
  return [lead.firstName || lead.first_name, lead.lastName || lead.last_name].filter(Boolean).join(" ").trim();
}

function userLabel(user) {
  return [user?.first_name, user?.last_name].filter(Boolean).join(" ") || (user?.username ? `@${user.username}` : "Unknown user");
}

function extractLeadId(text) {
  const match = text.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  return match?.[0] || "";
}

function button(text, callback_data) {
  return { text, callback_data };
}

function webAppButton(text) {
  return { text, web_app: { url: CRM_APP_URL } };
}

function contactButton(lead) {
  return button(lead?.status === "contacted" ? "✅ Связался повторно" : "✅ Связался", `contacted:${lead.id}`);
}

async function updateMessageButtons(message, leadId, status) {
  if (!message?.chat?.id || !message?.message_id) return;
  try {
    await telegram("editMessageReplyMarkup", {
      chat_id: message.chat.id,
      message_id: message.message_id,
      reply_markup: {
        inline_keyboard: [
          [webAppButton("🧩 CRM App")],
          [button(status === "contacted" ? "✅ Связался повторно" : "✅ Связался", `contacted:${leadId}`), button("⏰ Напомнить", `remind:${leadId}`)],
          [button("📇 Карточка", `card:${leadId}`), button("📌 Запрос", `original:${leadId}`)],
          [button("👤 CRM", `crm:${leadId}`), button("📝 Заметка", `note:${leadId}`), button("🗒 История", `history:${leadId}`)],
          [button("❌ Не подходит", `notfit:${leadId}`)],
        ],
      },
    });
  } catch {}
}

async function removeLeadMessage(message, leadId) {
  if (!message?.chat?.id || !message?.message_id) return;
  try {
    await telegram("deleteMessage", {
      chat_id: message.chat.id,
      message_id: message.message_id,
    });
    return;
  } catch {}
  try {
    await telegram("editMessageText", {
      chat_id: message.chat.id,
      message_id: message.message_id,
      text: `❌ Заявка ${leadId} отмечена как “не подходит” и закрыта в CRM.`,
      reply_markup: { inline_keyboard: [] },
    });
  } catch {}
}

function parseReminderText(text) {
  const raw = String(text || "").trim();
  const [timePartRaw, ...contextParts] = raw.split(/\s+[—-]\s+|:\s+/);
  const timePart = (timePartRaw || raw).trim().toLowerCase();
  const context = contextParts.join(" — ").trim() || raw.replace(timePartRaw, "").replace(/^[\s—:-]+/, "").trim();
  const relative = timePart.match(/через\s+(\d+)\s*(мин|минут|минуты|час|часа|часов|день|дня|дней|сутки|суток)/i);
  if (relative) {
    const amount = Number(relative[1]);
    const unit = relative[2].toLowerCase();
    const multiplier = unit.startsWith("мин") ? 60_000 : unit.startsWith("час") ? 60 * 60_000 : 24 * 60 * 60_000;
    return { dueAt: new Date(Date.now() + amount * multiplier), context };
  }
  const tomorrow = timePart.match(/завтра(?:\s+в?)?\s*(\d{1,2})(?::(\d{2}))?/i);
  if (tomorrow) {
    const dueAt = new Date();
    dueAt.setDate(dueAt.getDate() + 1);
    dueAt.setHours(Number(tomorrow[1]), Number(tomorrow[2] || 0), 0, 0);
    return { dueAt, context };
  }
  const absolute = timePart.match(/(\d{4})-(\d{2})-(\d{2})(?:[ t](\d{1,2})(?::(\d{2}))?)?/i);
  if (absolute) {
    const dueAt = new Date(Number(absolute[1]), Number(absolute[2]) - 1, Number(absolute[3]), Number(absolute[4] || 9), Number(absolute[5] || 0), 0, 0);
    return { dueAt, context };
  }
  return { dueAt: null, context: raw };
}

async function answerCallback(callbackQueryId, text) {
  return telegram("answerCallbackQuery", { callback_query_id: callbackQueryId, text });
}

async function telegram(method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(`Telegram ${method} failed: ${JSON.stringify(result)}`);
  return result.result;
}

function escapeTg(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString("en-US", { timeZone: "America/New_York" }) : "-";
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
