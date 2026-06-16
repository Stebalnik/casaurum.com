import http from "node:http";
import { spawn } from "node:child_process";

const port = 4899;
const server = spawn("node", ["server.mjs"], {
  env: { ...process.env, PORT: String(port), SITE_HOST: `localhost:${port}` },
  stdio: ["ignore", "pipe", "pipe"],
});

await waitForServer();

const paths = [
  "/",
  "/design-concept",
  "/luxury-wall-panels",
  "/custom-furniture",
  "/architectural-millwork",
  "/interior-design-solutions",
  "/for-designers-builders",
  "/partners",
  "/es/programa-partners",
  "/es/concepto-de-diseno",
  "/fr/programme-partenaires",
  "/fr/concept-design-interieur",
  "/ru/partnerskaya-programma",
  "/ru/dizayn-koncept",
  "/technical-millwork-planner",
  "/request-consultation",
  "/request-measurement",
  "/usa",
  "/collections/aurum",
  "/collections/forma",
  "/collections/noir",
  "/collections/madera",
  "/collections/signature",
  "/kitchens",
  "/georgia/luxury-custom-kitchens",
  "/georgia/atlanta/luxury-custom-kitchens",
  "/georgia/atlanta/custom-kitchen-cabinets",
  "/georgia/atlanta/kitchen-cabinet-refacing",
  "/miami/luxury-custom-kitchens",
  "/chicago/luxury-custom-furniture",
  "/canada/toronto/luxury-custom-kitchens",
  "/es/georgia/atlanta/custom-kitchen-cabinets",
  "/es/paneles-de-pared-de-lujo",
  "/fr/panneaux-muraux-de-luxe",
  "/ru/premium-stenovye-paneli",
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
if (!homePage.body.includes('<a href="/crm-app">Partner Login</a>')) {
  server.kill();
  throw new Error("header should expose Partner Login");
}
const ruHomePage = await read("/ru/premium-stenovye-paneli");
if (!ruHomePage.body.includes('<a href="/crm-app">Вход партнера</a>')) {
  server.kill();
  throw new Error("Russian header should expose localized partner login");
}
console.log("partner login header ok");

const designConceptPage = await read("/design-concept");
for (const requiredText of [
  "Get a Premium Interior Design Concept Before You Commit to Fabrication",
  "Transparent Starting Prices",
  "Submit Project for Review",
  "Online checkout for fixed-price concept packages can be added in the next step.",
  "data-design-concept-form",
  "FAQPage",
]) {
  if (!designConceptPage.body.includes(requiredText)) {
    server.kill();
    throw new Error(`/design-concept missing required text: ${requiredText}`);
  }
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
  sourceUrl: "/request-consultation",
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
  language: "en",
  client_name: "Smoke Concept",
  email: "smoke-concept@example.com",
  project_location: "Atlanta, GA",
  project_description: "Smoke test design concept.",
  desired_style: "quiet_luxury",
  timeline: "planning_only",
  budget_range: "not_sure",
  consent: "on",
}, [{ field: "project_photos", filename: "room.jpg", type: "image/jpeg", content: "fake image bytes" }]);
if (designConceptLead.status !== 200) {
  server.kill();
  throw new Error(`/api/design-concept-lead returned ${designConceptLead.status}`);
}
const designConceptLeadJson = JSON.parse(designConceptLead.body || "{}");
const uploadedConceptFile = await request(`/uploads/design-concepts/${designConceptLeadJson.id}/01-room.jpg`);
if (uploadedConceptFile.status !== 200) {
  server.kill();
  throw new Error(`/uploads/design-concepts/${designConceptLeadJson.id}/01-room.jpg returned ${uploadedConceptFile.status}`);
}
console.log("/api/design-concept-lead ok");

const invalidTechnicalConceptLead = await postMultipart("/api/design-concept-lead", {
  leadType: "design_concept_flow",
  formType: "design_concept_flow",
  package_type: "design_technical",
  project_type: "media_wall",
  language: "en",
  client_name: "Smoke Technical Concept",
  email: "smoke-technical@example.com",
  project_location: "Atlanta, GA",
  project_description: "Smoke test technical package without dimensions.",
  desired_style: "quiet_luxury",
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
  language: "en",
  client_name: "Smoke Concept",
  email: "smoke-concept@example.com",
  project_location: "Atlanta, GA",
  project_description: "Smoke test design concept without photos.",
  desired_style: "quiet_luxury",
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
if (!sitemap.body.includes("/sitemaps/casaurum-combinations-1.xml")) {
  server.kill();
  throw new Error("casaurum combination sitemap missing from sitemap index");
}
const coreSitemap = await read("/sitemaps/core.xml");
if (!coreSitemap.body.includes("/design-concept")) {
  server.kill();
  throw new Error("design concept page missing from core sitemap");
}

const legacyProgrammaticSitemap = await read("/sitemaps/legacy-programmatic.xml");
if (!legacyProgrammaticSitemap.body.includes("/georgia/atlanta/custom-kitchen-cabinets")) {
  server.kill();
  throw new Error("approved generated page missing from sitemap");
}
const collectionsSitemap = await read("/sitemaps/collections.xml");
if (!collectionsSitemap.body.includes("/collections/aurum")) {
  server.kill();
  throw new Error("collection detail page missing from sitemap");
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

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: "127.0.0.1", port, path }, (res) => {
      res.resume();
      res.on("end", () => resolve({ status: res.statusCode }));
    });
    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.destroy(new Error("timeout"));
    });
  });
}

function read(path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ hostname: "127.0.0.1", port, path }, (res) => {
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
        res.resume();
        res.on("end", () => resolve({ status: res.statusCode }));
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
