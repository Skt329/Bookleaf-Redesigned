# BookLeaf Publishing — Setup Guide

## Prerequisites

- **Node.js** 18.17+ (LTS recommended)
- **pnpm** (`npm install -g pnpm`)
- **PostgreSQL** via [Supabase](https://supabase.com) (free tier)
- **Stripe** account (test mode) — [dashboard.stripe.com](https://dashboard.stripe.com)
- **Azure OpenAI** access with GPT-4.1 Mini deployment

---

## 1. Clone & Install

```bash
git clone <repo-url>
cd bookleaf
pnpm install
```

## 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`. See sections below for how to get each.

## 3. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy from **Settings → Database**:
   - `DATABASE_URL` — Connection string (use "Connection pooling" URI for production)
   - `DIRECT_URL` — Direct connection string (for Prisma migrations)
3. Copy from **Settings → API**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Enable **Realtime** on the following tables (via Table Editor → Replication):
   - `SupportTicket`
   - `TicketMessage`
   - `SalesRecord`

## 4. Database Migration & Seed

```bash
# Generate Prisma client
pnpm prisma generate

# Run migrations (creates all tables)
pnpm prisma db push

# Seed the database with sample data
pnpm prisma db seed
```

## 5. Stripe Setup

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Use **test mode** (toggle in top-right)
3. Copy from **Developers → API Keys**:
   - `STRIPE_SECRET_KEY` (starts with `sk_test_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_`)
4. Set up webhook:
   - Go to **Developers → Webhooks → Add endpoint**
   - URL: `https://your-domain.com/api/webhooks/stripe` (or use Stripe CLI for local testing)
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `checkout.session.completed`
   - Copy the webhook signing secret → `STRIPE_WEBHOOK_SECRET`

### Local Stripe Testing

```bash
# Install Stripe CLI
# Then forward webhooks to your local server:
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## 6. Azure OpenAI Setup

1. Go to [Azure Portal](https://portal.azure.com) → Azure OpenAI
2. Create a deployment for GPT-4.1 Mini
3. Copy:
   - `AZURE_OPENAI_ENDPOINT` — Your resource endpoint URL
   - `AZURE_OPENAI_API_KEY` — API key from Keys and Endpoint
   - `AZURE_OPENAI_DEPLOYMENT_NAME` — Your deployment name
   - `AZURE_OPENAI_API_VERSION` — Use `2024-12-01-preview` or latest

## 7. NextAuth Secret

```bash
# Generate a random secret
openssl rand -base64 32
```

Copy the output to `NEXTAUTH_SECRET`.

## 8. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default Accounts (from seed data)

| Email | Password | Role |
|---|---|---|
| admin@bookleaf.com | Admin@123 | ADMIN |
| priya.sharma@email.com | Author@123 | AUTHOR |
| rohit.kapoor@email.com | Author@123 | AUTHOR |
| *(all 10 seeded authors)* | Author@123 | AUTHOR |

## 9. Useful Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm prisma studio  # Open Prisma database browser
pnpm prisma db push  # Push schema changes to database
```

## 10. Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local`
4. Deploy — Vercel auto-detects Next.js

---

## Architecture Overview

```
src/
├── app/           → Next.js App Router pages
│   ├── (public)/  → Public marketing pages (SSR for SEO)
│   ├── (auth)/    → Login, signup, password reset
│   ├── (author)/  → Author portal (protected)
│   ├── (admin)/   → Admin portal (protected)
│   └── api/       → API route handlers
├── components/    → React components by domain
├── lib/           → Core libraries (auth, AI, email, Prisma)
├── hooks/         → Custom React hooks
├── types/         → TypeScript type definitions
├── constants/     → App-wide constants
└── emails/        → React Email templates
```
