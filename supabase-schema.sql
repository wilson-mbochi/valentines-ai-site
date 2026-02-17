-- Run this in your Supabase SQL Editor to create the user_api_keys table

CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google')),
  encrypted_key TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Enable RLS (Row Level Security) - we use service role for server-side access
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: no direct client access (all access via service role)
CREATE POLICY "Service role only" ON user_api_keys
  FOR ALL
  USING (false)
  WITH CHECK (false);
