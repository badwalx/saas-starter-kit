# Hetzner + Coolify Deployment Setup

This guide walks you through deploying your SaaS to a Hetzner server with Coolify.

## Prerequisites

- Hetzner Cloud account (cx11 server ~€3.49/mo is sufficient)
- Domain name pointing to Cloudflare DNS
- GitHub repository with your SaaS code

## Step 1: Create Hetzner Server

1. Go to [Hetzner Cloud Console](https://console.hetzner.cloud)
2. Create a new project (e.g., "my-saas")
3. Create a server:
   - **Location**: Falkenstein (fsn1) or Nuremberg (nbg1)
   - **Image**: Ubuntu 22.04
   - **Type**: CX11 (2 vCPU, 2GB RAM) — sufficient for most SaaS apps
   - **Networking**: Enable Public IPv4
4. Note the **Public IPv4** address

## Step 2: Install Coolify

SSH into your new server:

```bash
ssh root@<your-server-ip>
```

Run the Coolify installer:

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

After installation, Coolify will be available at `http://<server-ip>:8000`.

## Step 3: Configure Coolify

1. Open `http://<server-ip>:8000` in your browser
2. Register your admin account
3. Add your server:
   - Go to **Settings → Connections & Destinations**
   - Add your local server as a destination
4. Add your GitHub/GitLab repository:
   - Go to **Settings → Source**
   - Connect your Git provider

## Step 4: Create Application

1. Go to **Projects** → Create new project
2. Add a new resource → **Docker Compose** (recommended) or **Next.js**
3. If using Docker Compose:
   - Select your repository
   - Coolify auto-detects `docker-compose.yml`
4. If using Next.js type:
   - Select your repository
   - Set build command: `npm run build`
   - Set start command: `npm run start`

## Step 5: Set Environment Variables

In Coolify, go to your application → **Environment Variables**:

```
NEXT_PUBLIC_SITE_URL=https://your-saas.b7co.in
NEXT_PUBLIC_APP_NAME=YourSaaS
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_STARTER_PRICE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_BUSINESS_PRICE_ID=price_...
```

Mark sensitive keys as **secret** in Coolify.

## Step 6: Configure Domain

1. In Coolify, go to your app → **Configuration → Domains**
2. Set your domain: `your-saas.b7co.in`
3. Enable **HTTPS** (Coolify auto-generates Let's Encrypt certs)
4. If using Cloudflare proxy (orange cloud), set SSL mode to **Full (Strict)**

## Step 7: Deploy

1. Click **Deploy** in Coolify
2. Monitor the build logs
3. Your app will be live at `https://your-saas.b7co.in`

## Step 8: Configure Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-saas.b7co.in/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Signing secret** and add as `STRIPE_WEBHOOK_SECRET` in Coolify

## Coolify-Specific Tips

- **Auto-deploy**: Enable "Auto Deploy" in Coolify to deploy on every git push
- **Rollbacks**: Coolify keeps previous images — rollback from the UI in one click
- **Scaling**: Increase resource limits in `docker-compose.yml` as you grow
- **Multi-app**: Deploy multiple SaaS products on the same Coolify instance
- **Databases**: Coolify can also host PostgreSQL/Redis if you self-host Supabase
- **Backups**: Set up Hetzner snapshots (daily/weekly) in the Hetzner Cloud Console

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check build logs in Coolify; ensure all env vars are set |
| 502 Bad Gateway | App not started; check container logs |
| SSL errors | Cloudflare SSL must be "Full (Strict)" if Coolify has HTTPS |
| Webhook fails | Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard |
| High memory | Increase Docker resource limits in `docker-compose.yml` |
