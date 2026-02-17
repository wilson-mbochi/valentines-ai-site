#!/usr/bin/env node
/**
 * Push .env.local to Vercel (Windows-compatible).
 * Requires: VERCEL_TOKEN env var (get from https://vercel.com/account/tokens)
 * Run: node scripts/push-env-to-vercel.js
 */

const fs = require("fs");
const path = require("path");

const ENV_FILE = path.join(process.cwd(), ".env.local");
const VERCEL_CONFIG = path.join(process.cwd(), ".vercel", "project.json");

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error("Error: .env.local not found");
    process.exit(1);
  }
  const content = fs.readFileSync(filePath, "utf8");
  const vars = {};
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1).replace(/\\(.)/g, "$1");
    }
    vars[key] = value;
  }
  return vars;
}

async function pushToVercel(vars, projectId, teamId, token) {
  const targets = ["production", "preview"];
  const sensitiveKeys = ["CLERK_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY", "ENCRYPTION_SECRET"];
  const isSensitive = (k) => sensitiveKeys.includes(k);

  for (const [key, value] of Object.entries(vars)) {
    if (!value) continue;
    const type = isSensitive(key) ? "sensitive" : "plain";
    const body = { key, value, type, target: targets };
    const url = `https://api.vercel.com/v10/projects/${projectId}/env?upsert=true${teamId ? `&teamId=${teamId}` : ""}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error(`Failed to add ${key}:`, err);
      process.exit(1);
    }
    console.log(`  ✓ ${key}`);
  }
}

async function main() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    console.error("Error: Set VERCEL_TOKEN environment variable.");
    console.error("Get a token at: https://vercel.com/account/tokens");
    process.exit(1);
  }

  if (!fs.existsSync(VERCEL_CONFIG)) {
    console.error("Error: Run 'vercel link' first to link this project.");
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(VERCEL_CONFIG, "utf8"));
  const vars = parseEnvFile(ENV_FILE);

  console.log(`Pushing ${Object.keys(vars).length} variables to Vercel...`);
  await pushToVercel(vars, config.projectId, config.orgId, token);
  console.log("Done. Redeploy for changes to take effect.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
