<div align="center">

# 🚀 SaaS Starter Kit

### The only Next.js boilerplate with **Coolify self-hosting** on Hetzner

Ship faster. Self-host cheaper. Own your infrastructure.

[![Next.js 14](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Billing-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)
[![Coolify](https://img.shields.io/badge/Coolify-Self--Host-0EA5E9?logo=docker&logoColor=white)](https://coolify.io/)
[![Hetzner](https://img.shields.io/badge/Hetzner-Cloud-D50C2D?logo=hetzner&logoColor=white)](https://hetzner.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[**Get Standard — $99**](https://github.com/badwalx/saas-starter-kit) · [**Get Premium — $149**](https://github.com/badwalx/saas-starter-kit) · [**Live Demo**](#) · [**Docs**](#)

</div>

---

## Why This Kit?

Every other SaaS boilerplate locks you into **Vercel**. Their "one-click deploy" comes with one-click pricing that scales with your success — and not in your favor.

**SaaS Starter Kit** is the only boilerplate that ships with first-class **Coolify + Hetzner** self-hosting. That means:

- **Flat infra costs** — a €4/mo Hetzner server beats Vercel Pro at scale
- **Full control** — your DB, your auth, your deployment pipeline, your rules
- **No vendor lock-in** — deploy anywhere Docker runs
- **Vercel still works** — if you want it, it's there; but it's not your only option

---

## ✨ Features

### 🔐 Authentication
- Supabase Auth with email, OAuth (Google, GitHub, Twitter), and magic links
- Protected routes, middleware guards, and session management
- Role-based access control (RBAC) ready

### 💳 Billing & Subscriptions
- Stripe Checkout, Customer Portal, and Webhooks
- Free, Pro, and Enterprise tier templates
- Usage-based billing support
- Subscription state sync with Supabase

### 🗄️ Database & API
- Supabase Postgres with Row Level Security (RLS)
- Auto-generated TypeScript types from your schema
- Server Actions and API route templates
- Real-time subscriptions ready

### 🚢 Deployment
- **Coolify** — one-click self-hosting on any server (Hetzner, DigitalOcean, bare metal)
- **Hetzner Cloud** — Terraform/Pulumi scripts to provision infra in minutes
- **Vercel** — fallback deploy for those who want it
- Docker Compose for local full-stack development
- CI/CD with GitHub Actions

### 🎨 UI & DX
- Tailwind CSS + shadcn/ui components
- Dark mode out of the box
- Responsive, accessible (WCAG 2.1 AA)
- ESLint, Prettier, and strict TypeScript
- Hot reload with full-stack Supabase local dev

### 📧 Engagement
- Transactional email templates (Resend / React Email)
- Landing page, pricing page, and dashboard scaffolds
- SEO metadata and Open Graph images
- Analytics hooks (PostHog, Umami, or Plausible)

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) | React SSR/SSG, Server Actions |
| Auth | [Supabase Auth](https://supabase.com/docs/guides/auth) | Email, OAuth, magic links |
| Database | [Supabase Postgres](https://supabase.com/docs/guides/database) | RLS, real-time, typed queries |
| Billing | [Stripe](https://stripe.com/) | Subs, one-time, usage-based |
| UI | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) | Styling + component library |
| Email | [React Email](https://react.email/) + [Resend](https://resend.com/) | Transactional emails |
| Self-Host | [Coolify](https://coolify.io/) + [Hetzner](https://hetzner.com/) | Flat-cost deployment |
| IaC | Terraform | Hetzner Cloud provisioning |
| CI/CD | GitHub Actions | Test, lint, deploy |
| Runtime | Docker | Containerized deploys |

---

## ⚡ Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/badwalx/saas-starter-kit.git
cd saas-starter-kit

# 2. Install dependencies
npm ci

# 3. Copy and fill environment variables
cp .env.example .env.local
# → Edit .env.local with your Supabase, Stripe, and Resend keys

# 4. Start Supabase local development
npx supabase init
npx supabase start

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live. 🎉

> **First time with Supabase local?** Run `npm run db:migrate` to apply the starter schema.

---

## 📁 Project Structure

```
saas-starter-kit/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── infra/
│   ├── coolify/            # Coolify deploy config & Dockerfile
│   ├── hetzner/            # Terraform modules for Hetzner Cloud
│   └── docker/             # Docker Compose for local dev
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (auth)/         # Auth pages (login, signup, callback)
│   │   ├── (dashboard)/    # Protected dashboard routes
│   │   ├── (marketing)/    # Landing, pricing, blog
│   │   └── api/            # API routes (Stripe webhooks, etc.)
│   ├── components/         # Shared UI components
│   │   └── ui/             # shadcn/ui primitives
│   ├── lib/                # Business logic & utilities
│   │   ├── supabase/       # Client, server, middleware clients
│   │   ├── stripe/         # Checkout, portal, webhook handlers
│   │   └── email/          # React Email templates
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles & Tailwind config
├── supabase/
│   ├── migrations/         # Database migrations
│   └── config.toml         # Supabase local config
├── public/                 # Static assets
├── .env.example            # Environment variable template
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
└── package.json
```

---

## 🔑 Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous key | `eyJhbG...` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-only) | `eyJhbG...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key | `pk_live_...` |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret | `whsec_...` |
| `STRIPE_STARTER_PRICE_ID` | ⬜ | Stripe Price ID for Starter plan | `price_...` |
| `STRIPE_PRO_PRICE_ID` | ⬜ | Stripe Price ID for Pro plan | `price_...` |
| `STRIPE_BUSINESS_PRICE_ID` | ⬜ | Stripe Price ID for Business plan | `price_...` |
| `NEXT_PUBLIC_SITE_URL` | ✅ | Production site origin | `https://yourapp.com` |
| `RESEND_API_KEY` | ⬜ | Resend API key for transactional email | `re_...` |
| `NEXT_PUBLIC_POSTHOG_KEY` | ⬜ | PostHog analytics key | `phc_...` |
| `COOLIFY_TOKEN` | ⬜ | Coolify API token for CI/CD deploys | `1|xxx...` |

---

## 🚀 Deployment Guide

### Coolify on Hetzner (Recommended — Our Differentiator)

This is where SaaS Starter Kit stands apart. Every other boilerplate sends you to Vercel and calls it a day. We give you **complete self-hosting** with Coolify — the open-source PaaS that makes deploying to your own server as easy as Vercel, at a fraction of the cost.

#### Step 1: Provision a Hetzner Server

```bash
# Option A: Use our Terraform module
cd infra/hetzner
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your Hetzner API token
terraform init && terraform apply

# Option B: Manual — create a CX22 (€4.15/mo) in Hetzner Cloud
# Ubuntu 22.04, 2 vCPU, 4 GB RAM, 40 GB disk — plenty for a SaaS
```

#### Step 2: Install Coolify

```bash
# SSH into your new server
ssh root@<your-server-ip>

# One-command Coolify install
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Open `http://<your-server-ip>:8000` and complete the Coolify setup wizard.

#### Step 3: Connect Your Repository

1. In Coolify, go to **Projects → Add Project**
2. Add a **Public Repository** source: `badwalx/saas-starter-kit`
3. Or connect your **GitHub account** for private repos

#### Step 4: Configure the Application

1. Set the **Build Pack** to `Next.js` (or `Docker` using our Dockerfile)
2. Add all environment variables from the [Environment Variables](#-environment-variables) table
3. Set the **Domain**: `yourapp.com`
4. Enable **Automatic Deployments** on push to `main`

#### Step 5: Deploy

Push to `main` — Coolify builds and deploys automatically. Your SaaS is live on your own infrastructure.

**Total infra cost: ~€4–7/mo** (Hetzner server) vs **$20–100+/mo** (Vercel Pro at scale).

> 💡 **Bonus**: Coolify gives you a dashboard to manage databases, backups, SSL, and multiple apps — all on the same server. Add a Postgres backup schedule, spin up a staging env, or host your blog alongside your SaaS.

### Vercel (Alternative)

If you prefer Vercel, it works out of the box:

```bash
npx vercel
# Set environment variables in Vercel dashboard
# Stripe webhook: point to your Vercel URL
```

### Docker (Any Host)

```bash
docker build -t saas-app .
docker run -p 3000:3000 --env-file .env.local saas-app
```

---

## 💰 Pricing

| Tier | Price | Includes |
|------|-------|----------|
| **Standard** | $99 | Full codebase, Supabase + Stripe + Coolify setup, lifetime updates, community Discord |
| **Premium** | $149 | Everything in Standard + **priority email support**, **1-on-1 setup call**, **custom domain DNS help**, early access to new modules |

> Both tiers include **unlimited projects** — build as many SaaS products as you want. No per-seat or per-launch fees. One purchase, lifetime license.

---

## ⚖️ Comparison

| Feature | **SaaS Starter Kit** | ShipFast | Makerkit | Supastack |
|---------|---------------------|----------|----------|-----------|
| **Framework** | Next.js 14 (App Router) | Next.js 14 | Next.js 13/14 | Next.js 14 |
| **Auth** | Supabase | NextAuth | Supabase | Supabase |
| **Billing** | Stripe | Stripe | Stripe | Stripe |
| **Self-Host (Coolify)** | ✅ **First-class** | ❌ | ❌ | ❌ |
| **Hetzner IaC** | ✅ **Terraform** | ❌ | ❌ | ❌ |
| **Docker Compose** | ✅ | ❌ | ❌ | Partial |
| **Vercel Deploy** | ✅ | ✅ | ✅ | ✅ |
| **Any-Docker-Host** | ✅ | ❌ | ❌ | ❌ |
| **Infra Cost (est.)** | **~€4/mo** | ~$20/mo | ~$20/mo | ~$20/mo |
| **Row Level Security** | ✅ | Partial | ✅ | ✅ |
| **shadcn/ui** | ✅ | ✅ | Partial | ✅ |
| **Dark Mode** | ✅ | ✅ | ✅ | ✅ |
| **Transactional Email** | ✅ | ✅ | ❌ | ❌ |
| **Usage-Based Billing** | ✅ | ❌ | ❌ | ❌ |
| **RBAC** | ✅ | ❌ | Partial | ❌ |
| **Price** | $99 / $149 | $199 | $199 | $149 |

### The Bottom Line

**ShipFast, Makerkit, and Supastack** are solid kits — but they all assume you'll deploy to Vercel. That's fine until your bandwidth bills hit $50/mo for a site that could run on a €4 Hetzner box.

**SaaS Starter Kit** is the only boilerplate that treats self-hosting as a first-class citizen. Coolify gives you the Vercel-like deploy experience on your own hardware. Hetzner gives you the servers. Terraform gives you reprovisioning in one command. You keep the savings.

---

## 🛠️ Local Development

```bash
# Start Supabase locally (Postgres, Auth, Realtime, Storage)
npx supabase start

# Run Next.js dev server with hot reload
npm run dev

# Run database migrations
npm run db:migrate

# Generate TypeScript types from your schema
npx supabase gen types typescript --linked > src/types/supabase.ts

# Run Stripe webhook listener (for local billing testing)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Lint and type-check
npm run typecheck && npm run build
```

---

## 🧪 Testing

```bash
# Unit tests
npm test

# Type checking
npm run typecheck

# Production build check
npm run build
```

Tests mock external services; verify OAuth, email delivery, checkout, webhook delivery, and portal flows using your configured Supabase project and Stripe test account before launch.

---

## 📦 What's Included

- ✅ Production-ready Next.js 14 App Router architecture
- ✅ Supabase Auth with multiple providers and middleware
- ✅ Stripe subscriptions with webhook handling
- ✅ Coolify deployment config with Dockerfile
- ✅ Hetzner Cloud Terraform modules
- ✅ GitHub Actions CI/CD workflows
- ✅ Landing page, pricing page, and auth pages
- ✅ Dashboard with subscription management
- ✅ Admin layout scaffold
- ✅ Transactional email templates
- ✅ Row Level Security policies
- ✅ Dark mode with system preference detection
- ✅ SEO defaults and OG image generation
- ✅ TypeScript strict mode throughout
- ✅ ESLint + Prettier config
- ✅ Docker Compose for local full-stack dev

---

## 🤝 Contributors

Thanks to everyone who ships with this kit!

<a href="https://github.com/badwalx/saas-starter-kit/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=badwalx/saas-starter-kit" />
</a>

Want to contribute? Check out [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](LICENSE) for details.

Purchasing the kit grants you a **lifetime license** for unlimited personal and commercial projects. Redistribution of the source code itself is not permitted.

---

<div align="center">

**Stop paying Vercel tax. Self-host with Coolify. Ship your SaaS.**

[**Get Started — $99**](https://github.com/badwalx/saas-starter-kit)

</div>
