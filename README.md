<div align="center">

# SaaS Starter Kit

### The only Next.js boilerplate with Coolify self-hosting on Hetzner

Ship faster. Self-host cheaper. Own your infra.

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![Coolify](https://img.shields.io/badge/Coolify-Self--Host-0EA5E9?logo=docker&logoColor=white)](https://coolify.io/)
[![Hetzner](https://img.shields.io/badge/Hetzner-Cloud-D50C2D?logo=hetzner&logoColor=white)](https://hetzner.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](License)

[**Buy Standard — $99**](https://saas-kit.b7co.cloud) · [**Buy Premium — $149**](https://saas-kit.b7co.cloud) · [**Source on GitHub**](https://github.com/badwalx/saas-starter-kit)

</div>

---

## Why this one

Every SaaS boilerplate assumes you'll deploy on Vercel. That's fine until your traffic grows and the bill follows. A side project making $500/mo can easily spend $100+ of that on Vercel Pro because serverless functions aren't cheap at volume.

This kit ships with Coolify + Hetzner as a first-class deployment target. A CX22 Hetzner box costs €4/mo and handles more traffic than most indie SaaS apps will ever see. You get your own server, your own Docker containers, your own Postgres. No surprises on the invoice.

If you still want Vercel, that works too. The kit doesn't lock you in — it just doesn't force you out.

---

## What's inside

### Auth
Supabase Auth handles email/password, OAuth (Google, GitHub), and magic links. Protected routes with middleware. Session management that works across server and client components. RLS policies on every table so users can only touch their own data.

### Billing
Stripe Checkout for one-time or recurring payments. Customer Portal so users can manage cards and cancel without emailing you. Webhook handler that syncs subscription state to Supabase. Supports metered billing if you need it.

### Dashboard
Protected layout with sidebar. Overview with usage stats. Billing page with plan details and portal link. API key management (create, list, revoke). Settings with profile edit and account deletion.

### Database
Supabase Postgres with RLS on every table. Auto-generated TypeScript types from your schema. Server Actions and API route patterns. Real-time subscriptions if you need them.

### Deployment
Coolify deployment with Docker Compose, health checks, and zero-downtime config. Hetzner Terraform scripts to provision a server in ~10 minutes. Vercel as a fallback. GitHub Actions CI. Full-stack local dev with Supabase CLI.

### UI
Tailwind CSS + shadcn/ui components. Dark mode. Responsive. Strict TypeScript.

---

## Tech stack

| Layer | Technology | What it does |
|-------|-----------|--------------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) | SSR, Server Actions, middleware |
| Auth | [Supabase Auth](https://supabase.com/docs/guides/auth) | Email, OAuth, magic links, RLS |
| Database | [Supabase Postgres](https://supabase.com/docs/guides/database) | Typed queries, real-time, RLS |
| Billing | [Stripe](https://stripe.com/) | Checkout, Portal, Webhooks |
| UI | [Tailwind](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Components, dark mode |
| Deploy | [Coolify](https://coolify.io/) + [Hetzner](https://hetzner.com/) | Self-host Docker, €4/mo |
| CI | [GitHub Actions](https://github.com/features/actions) | Test, build, deploy |
| Email | [Resend](https://resend.com/) + [React Email](https://react.email/) | Transactional templates |

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/badwalx/saas-starter-kit.git my-saas
cd my-saas

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Fill in your Supabase and Stripe keys

# 4. Set up Supabase
supabase init
supabase start
supabase db push

# 5. Run
npm run dev
```

Open http://localhost:3000. You should see the landing page with working Stripe checkout.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-only) |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (sk_live_ or sk_test_) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable key (pk_live_ or pk_test_) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret |
| `STRIPE_STANDARD_PRICE_ID` | Yes | Price ID for Standard plan |
| `STRIPE_PREMIUM_PRICE_ID` | Yes | Price ID for Premium plan |
| `NEXT_PUBLIC_SITE_URL` | No | Production URL (defaults to localhost:3000) |
| `NEXT_PUBLIC_APP_NAME` | No | App name for metadata and emails |

---

## Deploy to Coolify + Hetzner

This is the part other boilerplates skip.

1. **Provision a server** — Hetzner CX22 (€4/mo) or use the included Terraform script
2. **Install Coolify** — one command: `curl -fsSL https://cdn.coolify.io/install.sh | sh`
3. **Connect your repo** — Coolify pulls from GitHub+ Docker builds it
4. **Set environment variables** — paste your keys in the Coolify dashboard
5. **Deploy** — Coolify handles builds, health checks, SSL, and zero-downtime updates

Your SaaS is live on your own server. No per-request billing. No cold starts. No vendor lock-in.

### Cost comparison

| Platform | Monthly cost | Cold starts | Vendor lock-in |
|----------|-------------|-------------|----------------|
| Hetzner CX22 + Coolify | €4 | No | No |
| Vercel Pro | $20+ | Yes | Moderate |
| Railway | $5+ | Sometimes | Some |
| Render | $7+ | Yes | Some |

€4/mo buys a dedicated vCPU, 4GB RAM, and 40GB disk. That is hard to beat.

---

## Pricing

| | Standard — $99 | Premium — $149 |
|--|----------------|----------------|
| Full source code | Yes | Yes |
| Auth + billing + dashboard | Yes | Yes |
| Coolify/Hetzner deploy configs | Yes | Yes |
| Stripe checkout + webhooks | Yes | Yes |
| Legal pages (privacy, terms) | Yes | Yes |
| Lifetime updates | Yes | Yes |
| Priority email support | — | Yes (48h response) |
| Deployment assistance call | — | 1 hour |
| Supabase schema review | — | Yes |
| Early access to new templates | — | Yes |

---

## How this compares

| Feature | This kit | ShipFast | Makerkit | Supastack |
|---------|----------|----------|----------|-----------|
| Coolify self-hosting | Yes | No | No | No |
| Hetzner deploy scripts | Yes | No | No | No |
| Stripe billing | Yes | Yes | Yes | Yes |
| Supabase auth | Yes | No | Yes | Yes |
| Docker + Compose | Yes | No | No | No |
| API key management | Yes | No | No | No |
| Price | $99 | $199 | $149 | $299 |
| Monthly infra cost | €4 | $20+ | $20+ | $20+ |

If you are going to self-host anyway, this is the kit built for it.

---

## Local development

```bash
# Start Supabase locally
supabase start

# Run the app
npm run dev

# Run tests
npm run test

# Type check
npx tsc --noEmit
```

---

## Project structure

```
src/
  app/
    page.tsx              # Landing page
    login/page.tsx        # Login form
    signup/page.tsx       # Signup form
    dashboard/
      page.tsx            # Overview
      billing/page.tsx    # Billing management
      api-keys/page.tsx   # API key CRUD
      settings/page.tsx   # Profile settings
    api/
      checkout/route.ts   # Stripe Checkout
      webhooks/stripe/    # Stripe Webhooks
  lib/
    supabase/             # Client, server, admin, middleware
    stripe.ts             # Stripe helpers + plan config
  components/
    ui/                   # shadcn/ui components
    dashboard-nav.tsx     # Sidebar navigation
supabase/
  migrations/             # Schema + RLS policies
deploy/
  hetzner-coolify-setup.md
  cloudflare-setup.sh
```

---

## License

MIT. Buy once, use on any project. No seat limits, no recurring fees.

---

Built by [B7 & CO.](https://b7co.in) in West Kelowna, BC.
