# Eiish – Setup Guide

This app uses **authentication** and **bring-your-own API keys** so users can use their own AI models (free or paid).

## 1. Clerk (Authentication)

1. Go to [clerk.com](https://clerk.com) and create an account.
2. Create a new application.
3. In the Clerk Dashboard, go to **API Keys** and copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. Add them to `.env.local`:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```

## 2. Supabase (API Key Storage)

1. Go to [supabase.com](https://supabase.com) and create a project.  D3OQBgpxfAMhhdig
2. In **Project Settings → API**, copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** key (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`
3. Create the `user_api_keys` table (choose one):

   **Option A – SQL Editor (recommended):**
   - In the left sidebar, click **SQL Editor**
   - Click **New query**
   - Copy the contents of `supabase-schema.sql` and paste into the editor
   - Click **Run** (or press Ctrl+Enter)

   **Option B – Setup script:**
   - In **Project Settings → Database**, copy the **Connection string (URI)** under Transaction pooler
   - Add to `.env.local`: `SUPABASE_DATABASE_URL=postgresql://...` (replace `[YOUR-PASSWORD]` with your DB password)
   - Run: `npm run db:setup`
4. Add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 3. Encryption Secret

Generate a 32+ character secret for encrypting stored API keys:

```bash
openssl rand -base64 32
```

Add to `.env.local`:

```
ENCRYPTION_SECRET=your-generated-secret
```

## 4. Deploy (Vercel, etc.)

**Option A – Push from local (Windows-compatible):**

1. Get a Vercel token: [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Link your project (if needed): `vercel link`
3. Set the token and push:
   ```bash
   set VERCEL_TOKEN=your_token_here
   npm run env:push
   ```
   (PowerShell: `$env:VERCEL_TOKEN="your_token_here"`; then `npm run env:push`)

**Option B – Add manually in Vercel Dashboard:**

Go to **Settings** → **Environment Variables** and add:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ENCRYPTION_SECRET`

**The build will fail** if `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is missing. Add all vars before deploying.

## 5. Run the App

```bash
npm run dev
```

## Summary of `.env.local`

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY

# Supabase
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# Encryption (min 32 chars, run: openssl rand -base64 32)
ENCRYPTION_SECRET=YOUR_ENCRYPTION_SECRET
```

## User Flow

1. User signs up / signs in (Clerk).
2. User goes to **Settings** and adds their OpenAI API key (or Anthropic, Google).
3. User goes to **Try the Magic** and generates content.
4. If they have an API key: real AI generation (they pay their provider).
5. If they don’t: template content is shown.
