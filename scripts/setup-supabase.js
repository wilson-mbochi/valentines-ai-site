/**
 * Run this script to create the user_api_keys table in Supabase.
 *
 * 1. Get your database URL from Supabase:
 *    Dashboard → Project Settings → Database → Connection string (URI)
 *    Copy the "URI" format (starts with postgresql://)
 *
 * 2. Add to .env.local:
 *    SUPABASE_DATABASE_URL=postgresql://postgres.[ref]:[password]@...
 *
 * 3. Run: node scripts/setup-supabase.js
 */

require("dotenv").config({ path: ".env.local" });

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google')),
  encrypted_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role only" ON user_api_keys;
CREATE POLICY "Service role only" ON user_api_keys
  FOR ALL
  USING (false)
  WITH CHECK (false);
`;

async function main() {
  const url = process.env.SUPABASE_DATABASE_URL;
  if (!url) {
    console.error(`
Missing SUPABASE_DATABASE_URL in .env.local

To get it:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Project Settings → Database
4. Under "Connection string", copy the "URI" (Transaction pooler recommended)
5. Add to .env.local:
   SUPABASE_DATABASE_URL=postgresql://postgres.qlumzzagtgiylmtzihuv:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres

Replace [YOUR-PASSWORD] with your database password (set when you created the project).
`);
    process.exit(1);
  }

  const client = new Client({ connectionString: url });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("✓ user_api_keys table created successfully.");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
