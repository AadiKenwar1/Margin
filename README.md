# Margin

**Know what to relist it for.**

Margin is an AI-powered fashion resale pricing intelligence app for clothing and sneakers. Upload photos, get cross-platform resale pricing estimates across Grailed, StockX, eBay, Depop, Mercari, and Facebook Marketplace — and know exactly what to relist it for.

---

## Tech Stack

- **Next.js 16** (App Router, TypeScript, no Supabase Storage — images sent as base64 directly to OpenAI)
- **Tailwind CSS**
- **Supabase** (Auth, Postgres)
- **OpenAI Vision** (`gpt-4o-mini`, server-side only)
- **Stripe Checkout**

---

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

Required values:
- `OPENAI_API_KEY` — OpenAI API key
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase project settings (public anon key)
- `SUPABASE_SERVICE_ROLE_KEY` — from Supabase project settings (service role key, keep secret)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `STRIPE_SECRET_KEY` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — from Stripe webhook dashboard
- `NEXT_PUBLIC_APP_URL` — your app URL (e.g. `https://yourdomain.com`)

### 2. Supabase Setup

Run the SQL schema in your Supabase project:

1. Go to **SQL Editor** in Supabase dashboard
2. Paste the contents of `supabase-schema.sql`
3. Run it

This creates:
- `profiles` table (with auto-creation trigger on signup)
- `scans` table
- `payments` table
- Row Level Security policies
- Stored procedures for credit management

### 3. Stripe Webhook — Local Development

Install the Stripe CLI (Windows via Scoop):

```powershell
scoop bucket add stripe https://github.com/stripe/scoop-stripe-cli.git
scoop install stripe
```

Authenticate once:

```powershell
stripe login
```

Then **every dev session**, run this in a separate terminal and keep it open:

```powershell
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

When it starts, it prints your webhook signing secret:
```
> Ready! Your webhook signing secret is 'whsec_...' (^C to quit)
```

Copy that `whsec_...` value into your `.env` as `STRIPE_WEBHOOK_SECRET`, then restart the dev server.

> **Important:** Use **test keys** (`sk_test_...`, `pk_test_...`) locally. The CLI listener only works with the sandbox account it's authenticated to. Live keys are for production only.

> **Important:** Keep the `stripe listen` terminal open the entire time you're testing payments. Closing it stops webhook forwarding and credits will stop being applied.

For production, register your domain as a webhook endpoint in the Stripe dashboard:
```
https://yourdomain.com/api/stripe/webhook
```
Select event: `checkout.session.completed`. Copy the signing secret from the dashboard into your production environment as `STRIPE_WEBHOOK_SECRET`.

### 4. New User Profile Fix

If a user account was created before the database trigger was set up (or the trigger didn't fire), run this in the Supabase SQL Editor to backfill missing profile rows:

```sql
INSERT INTO profiles (id, email, relist_checks, total_relist_checks_used)
SELECT id, email, 3, 0
FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

### 4. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Core User Flow

1. **Landing page** → Sign up (get 3 free Relist Checks)
2. **Choose category** → Clothing or Shoes
3. **Upload photo** → 1 image (auto-compressed, sent as base64 to OpenAI — no storage needed)
4. **Loading screen** → Animated relist check sequence
5. **Results** → Cross-platform marketplace pricing cards + recommended relist price
6. **Profile** → Purchase more Relist Checks via Stripe

---

## Relist Check Packages

| Package | Price | Per Check |
|---------|-------|-----------|
| 20 Checks | $4.99 | ~$0.25 |
| 120 Checks ⭐ Best Value | $14.99 | ~$0.125 |
| 1,000 Checks | $44.99 | ~$0.045 |

---

## Security Notes

- OpenAI API key is **never exposed** to the browser
- Relist Check deduction happens **server-side only** (via Supabase stored procedure)
- RLS policies prevent users from manipulating their own credit balance
- Stripe credits are only added **after webhook confirmation** (idempotent)
- Rate limits: 1 check/minute, 10 checks/day

---

## Project Structure

```
app/
  (auth)/          — login, signup
  (dashboard)/     — check, profile, results
  api/             — relist-check, upload, stripe, user
  page.tsx         — landing page
components/
  check/           — category select, image upload, loader, results, marketplace cards
  navigation/      — bottom nav
  profile/         — profile view
  ui/              — Button, Card, Badge, Input
lib/
  supabase/        — browser, server, admin, middleware clients
  openai/          — vision analysis
  stripe/          — checkout + packages
  db/              — database helpers
  rate-limit/      — per-minute + per-day limiting
  utils/           — cn, formatCurrency, constants
types/             — TypeScript types
proxy.ts           — auth route protection (Next.js 16)
supabase-schema.sql — full database schema
```
