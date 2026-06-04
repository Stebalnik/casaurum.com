import { Buffer } from "node:buffer";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import OpenAI from "openai";
import sharp from "sharp";

const ROOT = path.resolve(new URL("..", import.meta.url).pathname);
const SERVER_FILE = path.join(ROOT, "server.mjs");
const PUBLIC_DIR = path.join(ROOT, "public");
const MIN_BYTES = 10 * 1024;
const DEFAULT_MODEL = "gpt-image-1";
const DEFAULT_SIZE = "1536x1024";

loadEnvFile(path.join(ROOT, ".env.production"));
loadEnvFile(path.join(ROOT, ".env"));

const { imageSpecs, negativePrompt } = readCollectionImageSpecs();
const entries = Object.entries(imageSpecs);

if (!process.env.OPENAI_API_KEY) {
  console.error("OPENAI_API_KEY is required to generate collection images. Add it to the environment or .env.production and rerun this script.");
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const model = process.env.IMAGE_MODEL || DEFAULT_MODEL;
const size = process.env.IMAGE_SIZE || DEFAULT_SIZE;

let generated = 0;
let skipped = 0;
let failed = 0;

for (const [index, [imagePath, spec]] of entries.entries()) {
  const filename = path.basename(imagePath);
  const destination = path.join(PUBLIC_DIR, imagePath.replace(/^\//, ""));
  const label = filename.replace(/\.webp$/, "");

  if (existsSync(destination)) {
    const sizeBytes = readFileSync(destination).byteLength;
    if (sizeBytes > MIN_BYTES) {
      skipped += 1;
      console.log(`[${index + 1}/${entries.length}] skipping ${label} (${Math.round(sizeBytes / 1024)} KB)`);
      continue;
    }
  }

  console.log(`[${index + 1}/${entries.length}] generating ${label}...`);
  try {
    const prompt = `${spec.prompt}\n\nNegative instruction: ${negativePrompt}`;
    const response = await client.images.generate({
      model,
      prompt,
      size,
      quality: process.env.IMAGE_QUALITY || "high",
      output_format: "webp",
      n: 1,
    });

    const image = response.data?.[0];
    if (!image?.b64_json) throw new Error("Image API response did not include b64_json.");

    await mkdir(path.dirname(destination), { recursive: true });
    const buffer = Buffer.from(image.b64_json, "base64");
    const webp = await sharp(buffer).webp({ quality: 88 }).toBuffer();
    await writeFile(destination, webp);

    const writtenBytes = readFileSync(destination).byteLength;
    if (writtenBytes <= MIN_BYTES) throw new Error(`Generated file is too small (${writtenBytes} bytes).`);

    generated += 1;
    console.log(`[${index + 1}/${entries.length}] saved ${imagePath} (${Math.round(writtenBytes / 1024)} KB)`);
  } catch (error) {
    failed += 1;
    console.error(`[${index + 1}/${entries.length}] failed ${label}: ${error.message}`);
  }
}

console.log(`summary:`);
console.log(`generated: ${generated}`);
console.log(`skipped: ${skipped}`);
console.log(`failed: ${failed}`);

if (failed > 0) process.exitCode = 1;

function readCollectionImageSpecs() {
  const source = readFileSync(SERVER_FILE, "utf8");
  const negative = source.match(/const COLLECTION_IMAGE_NEGATIVE_PROMPT = "([\s\S]*?)";/)?.[1];
  const start = source.indexOf("const collectionImageSpecs = {");
  if (start === -1) throw new Error("collectionImageSpecs was not found in server.mjs.");

  let cursor = source.indexOf("{", start);
  let depth = 0;
  let inString = false;
  let escaped = false;
  let end = -1;
  for (; cursor < source.length; cursor += 1) {
    const char = source[cursor];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === "\"") inString = false;
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) {
      end = cursor + 1;
      break;
    }
  }
  if (end === -1) throw new Error("Could not parse collectionImageSpecs object.");

  const objectLiteral = source.slice(source.indexOf("{", start), end);
  const imageSpecs = vm.runInNewContext(`(${objectLiteral})`);
  return { imageSpecs, negativePrompt: negative || "" };
}

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;
    if (process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}
