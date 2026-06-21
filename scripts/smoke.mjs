import http from "node:http";
import { spawn } from "node:child_process";
import { getLead } from "../crm-db.mjs";

const port = 4899;
const server = spawn("node", ["server.mjs"], {
  env: { ...process.env, PORT: String(port), SITE_HOST: `localhost:${port}` },
  stdio: ["ignore", "pipe", "pipe"],
});

await waitForServer();

const paths = [
  "/",
  "/design-concept",
  "/media-walls",
  "/custom-kitchens",
  "/custom-closets",
  "/built-ins",
  "/fireplace-walls",
  "/home-offices",
  "/wall-panels",
  "/mudrooms",
  "/custom-furniture",
  "/architectural-millwork",
  "/solutions",
  "/for-designers-builders",
  "/partners",
  "/es/programa-partners",
  "/fr/programme-partenaires",
  "/ru",
  "/ru/dizayn-koncept",
  "/ru/quick-project-estimate",
  "/ua",
  "/ua/dizayn-kontsept",
  "/ar",
  "/ar/quick-project-estimate",
  "/zh",
  "/zh/quick-project-estimate",
  "/technical-millwork-planner",
  "/quick-project-estimate",
  "/request-consultation",
  "/request-measurement",
  "/usa",
  "/ideas/aurum",
  "/ideas/forma",
  "/ideas/noir",
  "/ideas/madera",
  "/ideas/signature",
  "/kitchens",
  "/georgia/luxury-custom-kitchens",
  "/georgia/premium-design-concepts",
  "/georgia/atlanta/luxury-custom-kitchens",
  "/georgia/atlanta/premium-design-concepts",
  "/georgia/atlanta/custom-kitchen-cabinets",
  "/miami/luxury-custom-kitchens",
  "/chicago/luxury-custom-furniture",
  "/canada/toronto/luxury-custom-kitchens",
  "/es/georgia/atlanta/custom-kitchen-cabinets",
  "/es/paneles-de-pared-a-medida",
  "/fr/panneaux-muraux-sur-mesure",
  "/en/design-concepts/georgia",
  "/en/design-concepts/atlanta",
  "/sitemap.xml",
  "/robots.txt",
];

for (const path of paths) {
  const result = await request(path);
  if (result.status !== 200) {
    server.kill();
    throw new Error(`${path} returned ${result.status}`);
  }
  console.log(`${path} ok`);
}

for (const path of ["/es/concepto-de-diseno", "/fr/concept-design-interieur", "/ru/dizayn-koncept"]) {
  const result = await request(path);
  if (result.status !== 200) {
    server.kill();
    throw new Error(`${path} should render localized design concept flow, returned ${result.status}`);
  }
  console.log(`${path} localized ok`);
}

for (const [path, location] of [
  ["/luxury-wall-panels", "/wall-panels"],
  ["/custom-media-walls", "/media-walls"],
  ["/luxury-custom-closets", "/custom-closets"],
  ["/custom-built-ins", "/built-ins"],
  ["/tv-walls", "/media-walls"],
  ["/custom-wall-panels", "/wall-panels"],
  ["/built-in-furniture", "/built-ins"],
  ["/custom-cabinetry", "/custom-kitchens"],
  ["/cabinet-refinishing", "/custom-kitchens"],
  ["/hospitality-interiors", "/for-designers-builders"],
  ["/restaurant-interiors", "/for-designers-builders"],
  ["/office-interiors", "/for-designers-builders"],
  ["/georgia/atlanta/kitchen-cabinet-refacing", "/georgia/atlanta/custom-kitchen-cabinets"],
  ["/millwork-planner", "/technical-millwork-planner"],
  ["/projects", "/gallery"],
  ["/collections/aurum", "/ideas/aurum"],
  ["/uk", "/ua"],
  ["/uk/quick-project-estimate", "/ua/quick-project-estimate"],
  ["/ru/partnerskaya-programma", "/ru"],
]) {
  const result = await request(path);
  if (result.status !== 301 || result.headers.location !== location) {
    server.kill();
    throw new Error(`${path} should redirect to ${location}, returned ${result.status} ${result.headers.location || ""}`);
  }
  console.log(`${path} legacy redirect ok`);
}

for (const [acceptLanguage, location] of [
  ["es", "/es"],
  ["fr", "/fr"],
  ["ru", "/ru"],
  ["uk", "/ua"],
  ["uk-UA", "/ua"],
  ["ar", "/ar"],
  ["zh", "/zh"],
  ["zh-CN", "/zh"],
]) {
  const result = await request("/", { "Accept-Language": acceptLanguage });
  if (result.status !== 302 || result.headers.location !== location) {
    server.kill();
    throw new Error(`Accept-Language ${acceptLanguage} should redirect to ${location}, returned ${result.status} ${result.headers.location || ""}`);
  }
  console.log(`Accept-Language ${acceptLanguage} ok`);
}
const defaultLocale = await request("/");
if (defaultLocale.status !== 200) {
  server.kill();
  throw new Error(`default/no Accept-Language should render English /, returned ${defaultLocale.status}`);
}
const botLocale = await request("/", { "Accept-Language": "es", "User-Agent": "Googlebot" });
if (botLocale.status !== 200) {
  server.kill();
  throw new Error(`bot Accept-Language should not redirect, returned ${botLocale.status}`);
}
const robotsLocale = await request("/robots.txt", { "Accept-Language": "es" });
if (robotsLocale.status !== 200) {
  server.kill();
  throw new Error(`robots.txt should not locale redirect, returned ${robotsLocale.status}`);
}
console.log("Accept-Language detection ok");

const seoIndex = await request("/seo-index");
if (seoIndex.status !== 401) {
  server.kill();
  throw new Error(`/seo-index should require auth, returned ${seoIndex.status}`);
}
console.log("/seo-index auth ok");

const partnersPage = await read("/partners");
if (!partnersPage.body.includes("data-partner-form") || !partnersPage.body.includes("Partnership")) {
  server.kill();
  throw new Error("/partners should render partner application form and footer partnership links");
}
console.log("/partners form ok");

const homePage = await read("/");
if (!homePage.body.includes("For Designers &amp; Builders") || !homePage.body.includes("Start Your Design Concept")) {
  server.kill();
  throw new Error("homepage should expose new navigation and Start Project CTA");
}
if (homePage.body.includes('class="lang"') || homePage.body.includes('data-event="language_changed"') || homePage.body.includes(">FR<")) {
  server.kill();
  throw new Error("homepage should not render a visible language switcher");
}
for (const hreflang of ['hreflang="en"', 'hreflang="es"', 'hreflang="fr"', 'hreflang="ru"', 'hreflang="uk-UA"', 'hreflang="ar"', 'hreflang="zh-Hans"', 'hreflang="x-default"']) {
  if (!homePage.body.includes(hreflang)) {
    server.kill();
    throw new Error(`homepage missing ${hreflang}`);
  }
}
if (homePage.body.includes("/uk")) {
  server.kill();
  throw new Error("homepage should not expose legacy /uk URLs");
}
const crmApp = await request("/crm-app");
if (crmApp.status !== 200) {
  server.kill();
  throw new Error(`/crm-app should remain available, returned ${crmApp.status}`);
}
console.log("homepage navigation and CRM app ok");

const designConceptPage = await read("/design-concept");
for (const requiredText of [
  "Start With Photos and a Clear Design Concept",
  "Design Concept",
  "Order Design Concept",
  "I need CAS AURUM to help arrange measurement for this project.",
  "Paid concept work starts only after a conversation and written confirmation.",
  "data-design-concept-form",
  "FAQPage",
]) {
  if (!designConceptPage.body.includes(requiredText)) {
    server.kill();
    throw new Error(`/design-concept missing required text: ${requiredText}`);
  }
}
if (designConceptPage.body.includes("13%")) {
  server.kill();
  throw new Error("/design-concept should not show the internal measurement surcharge percentage");
}
const startConceptRedirect = await request("/start-design-concept");
if (startConceptRedirect.status !== 302) {
  server.kill();
  throw new Error(`/start-design-concept should redirect to /design-concept, returned ${startConceptRedirect.status}`);
}
const kitchenPage = await read("/kitchens");
if (!kitchenPage.body.includes("/design-concept") || !kitchenPage.body.includes("Start with a Design Concept")) {
  server.kill();
  throw new Error("/kitchens should link into the Design Concept flow");
}
console.log("/design-concept sales flow ok");

const ukrainianPage = await read("/ua");
if (!ukrainianPage.body.includes("CAS AURUM українською") || !ukrainianPage.body.includes("/ua/dizayn-kontsept") || ukrainianPage.body.includes("Продовжити англійською") || ukrainianPage.body.includes('href="/uk')) {
  server.kill();
  throw new Error("/ua should render a compact Ukrainian landing page without visible English language switching or /uk URLs");
}
console.log("/ua compact landing ok");

const frenchPage = await read("/fr/solutions");
if (frenchPage.body.includes("noindex,follow") || frenchPage.body.includes(">FR<") || !frenchPage.body.includes('hreflang="fr"')) {
  server.kill();
  throw new Error("French core pages should be accessible, indexable and represented in hreflang without a visible switcher");
}
console.log("French localized hreflang ok");

const plannerPage = await read("/technical-millwork-planner");
for (const requiredText of ["Quick Project Estimate", "Technical Millwork Planner", "data-lead-form=\"quick_project_estimate\"", "data-lead-form=\"technical_millwork_planner\""]) {
  if (!plannerPage.body.includes(requiredText)) {
    server.kill();
    throw new Error(`/technical-millwork-planner missing required planner text: ${requiredText}`);
  }
}
if (plannerPage.body.includes(">FR<") || plannerPage.body.includes('class="lang"')) {
  server.kill();
  throw new Error("/technical-millwork-planner should not render a visible language switcher");
}
console.log("/technical-millwork-planner and quick estimate ok");

const quickEstimatePage = await read("/quick-project-estimate");
for (const requiredText of ["Quick Project Estimate", "Send My Quick Estimate", "data-lead-form=\"quick_project_estimate\""]) {
  if (!quickEstimatePage.body.includes(requiredText)) {
    server.kill();
    throw new Error(`/quick-project-estimate missing required quick estimate text: ${requiredText}`);
  }
}
console.log("/quick-project-estimate flow ok");

const consultationPage = await read("/request-consultation");
for (const requiredText of [
  'href="/request-consultation#consultation-form"',
  'id="consultation-form"',
  'name="fullName"',
  'name="phone"',
  'name="email"',
  'name="message"',
]) {
  if (!consultationPage.body.includes(requiredText)) {
    server.kill();
    throw new Error(`/request-consultation missing required text: ${requiredText}`);
  }
}
if (consultationPage.body.includes('<select name="budget"') || consultationPage.body.includes('<select name="timeline"') || consultationPage.body.includes('<select name="projectType"') || consultationPage.body.includes('<select name="serviceNeeded"')) {
  server.kill();
  throw new Error("/request-consultation should render the simplified consultation form without budget, timeline, project type or service selects");
}
const shortConsultationValidation = await post("/api/lead", {
  formType: "consultation",
  leadType: "consultation",
  language: "en",
  fullName: "Smoke Short Consultation",
  phone: "+1 555 0100",
  consent: "on",
  sourceUrl: "/request-consultation#consultation-form",
});
const shortConsultationValidationJson = JSON.parse(shortConsultationValidation.body || "{}");
if (shortConsultationValidation.status !== 400 || shortConsultationValidationJson.missing?.length !== 1 || shortConsultationValidationJson.missing[0] !== "message") {
  server.kill();
  throw new Error(`/api/lead simplified consultation validation returned ${shortConsultationValidation.status}: ${shortConsultationValidation.body}`);
}
console.log("/request-consultation simplified form ok");

const privacyPage = await read("/privacy-policy");
if (!privacyPage.body.includes('<a class="stealth-admin-link" href="/admin">contact CAS AURUM</a>')) {
  server.kill();
  throw new Error("/privacy-policy should expose admin entry through the Contact text");
}
if (privacyPage.body.includes('aria-label="CAS AURUM admin"') || privacyPage.body.includes(">Admin</a>")) {
  server.kill();
  throw new Error("/privacy-policy should not expose a visible admin entry");
}
console.log("/privacy-policy stealth admin entry ok");

const lead = await post("/api/lead", {
  website: "smoke-test-honeypot",
  formType: "consultation",
  language: "en",
  fullName: "Smoke Test",
  email: "smoke@example.com",
  phone: "+1 555 0100",
  zipCode: "33101",
  message: "Short form smoke test.",
  sourceUrl: "/request-consultation#consultation-form",
});
if (lead.status !== 200) {
  server.kill();
  throw new Error(`/api/lead returned ${lead.status}`);
}
console.log("/api/lead ok");

const designConceptLead = await postMultipart("/api/design-concept-lead", {
  leadType: "design_concept_flow",
  formType: "design_concept_flow",
  package_type: "design_concept",
  project_type: "media_wall",
  project_stage: "photos",
  lead_type_classification: "homeowner",
  language: "en",
  client_name: "Smoke Concept",
  email: "smoke-concept@example.com",
  phone: "+1 555 0102",
  project_location: "Atlanta, GA",
  project_description: "Smoke test design concept.",
  desired_style: "warm_natural",
  timeline: "planning_only",
  budget_range: "not_sure",
  needs_measurement: "yes",
  consent: "on",
}, [{ field: "project_photos", filename: "room.jpg", type: "image/jpeg", content: "fake image bytes" }]);
if (designConceptLead.status !== 200) {
  server.kill();
  throw new Error(`/api/design-concept-lead returned ${designConceptLead.status}`);
}
const designConceptLeadJson = JSON.parse(designConceptLead.body || "{}");
const savedDesignConceptLead = getLead(designConceptLeadJson.id);
if (
  !savedDesignConceptLead?.measurement_requested ||
  savedDesignConceptLead.exact_price !== "$554" ||
  savedDesignConceptLead.base_price !== "from $490" ||
  savedDesignConceptLead.estimated_price_label !== "from $490" ||
  savedDesignConceptLead.estimated_timeline_label !== "3-5 business days" ||
  savedDesignConceptLead.estimate_basis !== "package_type + project_type" ||
  savedDesignConceptLead.measurement_surcharge_rate !== "13%" ||
  savedDesignConceptLead.measurement_surcharge_amount !== "$64"
) {
  server.kill();
  throw new Error(`/api/design-concept-lead should save internal 13% measurement surcharge, saved ${JSON.stringify(savedDesignConceptLead || {})}`);
}
const uploadedConceptFile = await request(`/uploads/design-concepts/${designConceptLeadJson.id}/01-room.jpg`);
if (uploadedConceptFile.status !== 200) {
  server.kill();
  throw new Error(`/uploads/design-concepts/${designConceptLeadJson.id}/01-room.jpg returned ${uploadedConceptFile.status}`);
}
console.log("/api/design-concept-lead ok");

const invalidTechnicalConceptLead = await postMultipart("/api/design-concept-lead", {
  leadType: "design_concept_flow",
  formType: "design_concept_flow",
  package_type: "design_build_package",
  project_type: "media_wall",
  project_stage: "measurements",
  lead_type_classification: "homeowner",
  language: "en",
  client_name: "Smoke Technical Concept",
  email: "smoke-technical@example.com",
  phone: "+1 555 0103",
  project_location: "Atlanta, GA",
  project_description: "Smoke test technical package without dimensions.",
  desired_style: "warm_natural",
  timeline: "planning_only",
  budget_range: "not_sure",
  consent: "on",
}, [{ field: "project_photos", filename: "room.jpg", type: "image/jpeg", content: "fake image bytes" }]);
if (invalidTechnicalConceptLead.status !== 400 || !invalidTechnicalConceptLead.body.includes("dimension_length")) {
  server.kill();
  throw new Error(`/api/design-concept-lead technical package without dimensions should return 400 with dimension fields, returned ${invalidTechnicalConceptLead.status}`);
}
console.log("/api/design-concept-lead technical validation ok");

const invalidDesignConceptLead = await post("/api/design-concept-lead", {
  leadType: "design_concept_flow",
  formType: "design_concept_flow",
  package_type: "design_concept",
  project_type: "media_wall",
  project_stage: "photos",
  lead_type_classification: "homeowner",
  language: "en",
  client_name: "Smoke Concept",
  email: "smoke-concept@example.com",
  phone: "+1 555 0104",
  project_location: "Atlanta, GA",
  project_description: "Smoke test design concept without photos.",
  desired_style: "warm_natural",
  timeline: "planning_only",
  budget_range: "not_sure",
  consent: "on",
});
if (invalidDesignConceptLead.status !== 400) {
  server.kill();
  throw new Error(`/api/design-concept-lead without photos should return 400, returned ${invalidDesignConceptLead.status}`);
}
console.log("/api/design-concept-lead validation ok");

const sitemap = await read("/sitemap.xml");
if (!sitemap.body.includes("<sitemapindex")) {
  server.kill();
  throw new Error("sitemap index missing");
}
if (!sitemap.body.includes("/sitemaps/core.xml")) {
  server.kill();
  throw new Error("core sitemap missing from sitemap index");
}
if (!sitemap.body.includes("/sitemaps/legacy-programmatic.xml")) {
  server.kill();
  throw new Error("legacy programmatic sitemap missing from sitemap index");
}
if (sitemap.body.includes("/sitemaps/casaurum-combinations-1.xml")) {
  server.kill();
  throw new Error("casaurum combination sitemap should not be published");
}
if (!sitemap.body.includes("/sitemaps/casaurum-entities.xml")) {
  server.kill();
  throw new Error("indexable Casaurum design concept entity sitemap missing");
}
if (sitemap.body.includes("/sitemaps/collections.xml")) {
  server.kill();
  throw new Error("collections sitemap should not be published");
}
if (!sitemap.body.includes("/sitemaps/images.xml")) {
  server.kill();
  throw new Error("image sitemap missing from sitemap index");
}
const coreSitemap = await read("/sitemaps/core.xml");
if (!coreSitemap.body.includes("/design-concept")) {
  server.kill();
  throw new Error("design concept page missing from core sitemap");
}
if (coreSitemap.body.includes("casaurum.com/uk")) {
  server.kill();
  throw new Error("core sitemap should not include legacy /uk URLs");
}
for (const expected of ["/es", "/fr", "/ru", "/ua", "/ar", "/zh"]) {
  if (!coreSitemap.body.includes(expected)) {
    server.kill();
    throw new Error(`core sitemap missing localized route ${expected}`);
  }
}
if (!coreSitemap.body.includes('hreflang="uk-UA"') || !coreSitemap.body.includes('hreflang="zh-Hans"')) {
  server.kill();
  throw new Error("core sitemap missing uk-UA or zh-Hans alternates");
}

const legacyProgrammaticSitemap = await read("/sitemaps/legacy-programmatic.xml");
if (!legacyProgrammaticSitemap.body.includes("/georgia/atlanta/custom-kitchen-cabinets")) {
  server.kill();
  throw new Error("approved generated page missing from sitemap");
}
if (legacyProgrammaticSitemap.body.includes("cabinet-refacing") || legacyProgrammaticSitemap.body.includes("hospitality-interiors") || legacyProgrammaticSitemap.body.includes("office-interiors")) {
  server.kill();
  throw new Error("non-core programmatic service page should not be in sitemap");
}
const collectionsSitemap = await read("/sitemaps/collections.xml");
if (collectionsSitemap.status !== 404) {
  server.kill();
  throw new Error("collections sitemap should return 404 after noindex cleanup");
}
for (const path of ["/ideas/aurum", "/en/styles/modern", "/en/rooms/living-room", "/en/journal/modern-interior-design-ideas"]) {
  const page = await read(path);
  if (!page.body.includes("noindex,follow")) {
    server.kill();
    throw new Error(`${path} should render noindex,follow`);
  }
}
const imageSitemap = await read("/sitemaps/images.xml");
if (!imageSitemap.body.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"')) {
  server.kill();
  throw new Error("image sitemap namespace missing");
}
if (!imageSitemap.body.includes("<image:image>") || !imageSitemap.body.includes("/images/projects/")) {
  server.kill();
  throw new Error("public project images missing from image sitemap");
}
if (imageSitemap.body.includes("casaurum.com/uk")) {
  server.kill();
  throw new Error("image sitemap should not include legacy /uk URLs");
}
if (!legacyProgrammaticSitemap.body.includes("/georgia/atlanta/luxury-custom-kitchens")) {
  server.kill();
  throw new Error("approved generated Atlanta kitchen page missing from sitemap");
}
if (legacyProgrammaticSitemap.body.includes("/georgia/atlanta/buckhead/custom-closets")) {
  server.kill();
  throw new Error("needs_review generated page should not be in sitemap");
}
if (legacyProgrammaticSitemap.body.includes("/chicago/luxury-custom-furniture")) {
  server.kill();
  throw new Error("Tier 3 review page should not be in sitemap before approval");
}
console.log("programmatic sitemap gate ok");

const reviewPage = await read("/chicago/luxury-custom-furniture");
if (!reviewPage.body.includes("noindex,follow")) {
  server.kill();
  throw new Error("review generated page should render noindex,follow");
}
console.log("programmatic review robots ok");

server.kill();

function request(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: "127.0.0.1", port, path, headers }, (res) => {
      res.resume();
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers }));
    });
    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.destroy(new Error("timeout"));
    });
  });
}

function read(path, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: "127.0.0.1", port, path, headers }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.on("error", reject);
    req.setTimeout(5000, () => req.destroy(new Error("timeout")));
  });
}

function post(path, body) {
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method: "POST",
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let responseBody = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (responseBody += chunk));
        res.on("end", () => resolve({ status: res.statusCode, body: responseBody }));
      },
    );
    req.on("error", reject);
    req.setTimeout(5000, () => req.destroy(new Error("timeout")));
    req.end(payload);
  });
}

function postMultipart(path, fields, files) {
  const boundary = `----cas-aurum-smoke-${Date.now()}`;
  const chunks = [];
  for (const [name, value] of Object.entries(fields)) {
    chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`));
  }
  for (const file of files) {
    chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${file.field}"; filename="${file.filename}"\r\nContent-Type: ${file.type}\r\n\r\n`));
    chunks.push(Buffer.from(file.content));
    chunks.push(Buffer.from("\r\n"));
  }
  chunks.push(Buffer.from(`--${boundary}--\r\n`));
  const payload = Buffer.concat(chunks);
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method: "POST",
        headers: {
          "content-type": `multipart/form-data; boundary=${boundary}`,
          "content-length": payload.length,
        },
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve({ status: res.statusCode, body }));
      },
    );
    req.on("error", reject);
    req.setTimeout(5000, () => req.destroy(new Error("timeout")));
    req.end(payload);
  });
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(timeoutMs = 15000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    try {
      const result = await request("/health");
      if (result.status === 200) return;
    } catch {}
    await wait(250);
  }
  server.kill();
  throw new Error(`server did not become ready on port ${port}`);
}
