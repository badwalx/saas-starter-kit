# SaaS Starter Kit

Next.js App Router, Supabase Auth/Postgres, Stripe subscriptions, and shadcn-style UI.

## Local setup

1. Run `npm ci` and copy `.env.example` to `.env.local`.
2. Set the Supabase URL, anon key, and server-only service role key. Set `NEXT_PUBLIC_SITE_URL` to the application's origin.
3. Link your Supabase project and run `npm run db:migrate` to apply all migrations, including API key storage and permissions.
4. Enable GitHub and Google in Supabase Authentication → Providers. Configure each provider's OAuth callback using the Supabase dashboard URL. Allow `http://localhost:3000/auth/callback` in Supabase Auth redirect URLs, plus your production callback URL. Enable email authentication; signup supports both immediate sessions and email confirmation.
5. Create recurring monthly Stripe prices and fill in `STRIPE_STARTER_PRICE_ID`, `STRIPE_PRO_PRICE_ID`, and `STRIPE_BUSINESS_PRICE_ID`. Set the Stripe secret and publishable keys from the same test/live account.
6. Enable the Stripe Customer Portal and configure its allowed plan changes and cancellation options.
7. Run `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and copy its signing secret into `STRIPE_WEBHOOK_SECRET`. In production, register the HTTPS webhook endpoint with `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`. Also enable `invoice.payment_succeeded` and `invoice.payment_failed` for invoice history.
8. Run `npm run dev`.

## Included flows

- `/login` supports password, GitHub, Google, and email magic links; `/signup` collects name, email, and password.
- `/dashboard` and its settings, billing, and API key pages require a verified Supabase session.
- `POST /api/checkout` accepts a `plan` (`starter`, `pro`, or `business`) or an allowlisted `price_id`, then redirects to Stripe. Webhooks synchronize subscription state with Supabase.
- Billing provides Customer Portal access. Settings supports profile updates and account deletion, including cancellation of Stripe subscriptions.
- `/api/keys` generates, lists, and revokes keys. Only SHA-256 hashes are stored; the full secret is returned once. The example `/api/protected` endpoints use session authentication; connect key authentication to your product API as needed.
- `/privacy` and `/terms` contain placeholders to customize before launch.

Cookie-authenticated mutation requests require an `Origin` matching `NEXT_PUBLIC_SITE_URL`. Service role and Stripe secret keys must remain server-only.

## Validation

Run `npm test`, `npm run typecheck`, and `npm run build`. Tests mock external services; verify OAuth, email delivery, checkout, webhook delivery, and portal flows using your configured Supabase project and Stripe test account before launch.
