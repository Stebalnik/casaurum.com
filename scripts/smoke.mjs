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
  "/luxury-wall-panels",
  "/custom-furniture",
  "/architectural-millwork",
  "/interior-design-solutions",
  "/for-designers-builders",
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
