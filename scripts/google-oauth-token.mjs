import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { google } from "googleapis";

const clientPath = process.env.GOOGLE_OAUTH_CLIENT_PATH || "/var/www/casaurum.com/credentials/google-oauth-client.json";
const tokenPath = process.env.GOOGLE_OAUTH_TOKEN_PATH || "/var/www/casaurum.com/credentials/google-oauth-token.json";
const credentials = JSON.parse(readFileSync(clientPath, "utf8"));
const config = credentials.installed || credentials.web;

const oauth2Client = new google.auth.OAuth2(
  config.client_id,
  config.client_secret,
  (config.redirect_uris || ["http://localhost"])[0]
);

const scopes = [
  "https://www.googleapis.com/auth/webmasters.readonly",
  "https://www.googleapis.com/auth/analytics.readonly",
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: scopes,
});

console.log("\nOpen this URL in your browser:\n");
console.log(authUrl);
console.log("\nAfter approval, paste the code parameter here.\n");

const rl = createInterface({ input, output });
const code = (await rl.question("Google OAuth code: ")).trim();
rl.close();

const { tokens } = await oauth2Client.getToken(code);
mkdirSync(path.dirname(tokenPath), { recursive: true });
writeFileSync(tokenPath, JSON.stringify(tokens, null, 2), { mode: 0o600 });
console.log(`Saved token to ${tokenPath}`);
