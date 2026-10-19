# Stripe Setup Guide — SaaS Starter Kit

## Step 1: Create Stripe Account
Go to https://dashboard.stripe.com/register — free to create, no charges until live mode.

## Step 2: Create Products & Prices (Test Mode)

### SaaS Starter Kit — Standard ($99 one-time)
```bash
curl https://api.stripe.com/v1/products \
  -u "sk_test_YOUR_KEY:" \
  -d "name=SaaS Starter Kit - Standard" \
  -d "description=Next.js 14 + Supabase + Stripe + Coolify boilerplate" \
  -d "default_price_data[unit_amount]=9900" \
  -d "default_price_data[currency]=usd" \
  -d "expand[]=default_price"
```

### SaaS Starter Kit — Premium ($149 one-time)
```bash
curl https://api.stripe.com/v1/products \
  -u "sk_test_YOUR_KEY:" \
  -d "name=SaaS Starter Kit - Premium" \
  -d "description=Standard + priority support + custom deployment assistance" \
  -d "default_price_data[unit_amount]=14900" \
  -d "default_price_data[currency]=usd" \
  -d "expand[]=default_price"
```

Or use the Dashboard: https://dashboard.stripe.com/test/products → Add product

## Step 3: Get Your Keys
- **Publishable key**: Dashboard → Developers → API keys → `pk_test_...`
- **Secret key**: Dashboard → Developers → API keys → `sk_test_...`
- **Webhook secret**: Dashboard → Developers → Webhooks → Add endpoint → `whsec_...`

## Step 4: Set Webhook Endpoint
URL: `https://your-domain.com/api/webhooks/stripe`
Events to listen for:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

## Step 5: Environment Variables
```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Product Price IDs (from Step 2)
STRIPE_STANDARD_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

# Stripe Customer Portal (configure in Dashboard)
# https://dashboard.stripe.com/test/settings/billing/portal
```

## Step 6: Enable Customer Portal
Dashboard → Settings → Billing → Customer portal → Activate
- Allow cancellation: Yes
- Allowed return URL: `https://your-domain.com/dashboard/billing`

## Step 7: Go Live
When ready to accept real payments:
1. Complete Stripe account activation (business details, bank account)
2. Switch API keys from `sk_test_` → `sk_live_`
3. Recreate products in live mode (test products don't copy automatically)
4. Update webhook endpoint for live mode
5. Set `STRIPE_SECRET_KEY=sk_live_...`

## Revenue Tracking
- Test mode: Dashboard → Payments (test data)
- Live mode: Dashboard → Analytics → Revenue
- First goal: 20 sales × $99 avg = $1,980 MRR equivalent
