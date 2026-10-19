import Stripe from "stripe";

let stripeClient: Stripe | undefined;
export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured");
  return stripeClient ??= new Stripe(process.env.STRIPE_SECRET_KEY, {
    typescript: true,
  });
}

// ============================================
// Plan Configuration
// ============================================
export const PLANS = {
  standard: {
    name: "Standard",
    priceId: process.env.STRIPE_STANDARD_PRICE_ID!,
    price: 99,
    mode: "payment" as const,
    features: [
      "Full source code (Next.js 14 + Supabase + Stripe)",
      "Coolify/Hetzner deployment configs",
      "Auth pages (email, OAuth, magic links)",
      "Dashboard with billing & API keys",
      "Stripe checkout + webhooks",
      "Legal pages (privacy, terms)",
      "Lifetime updates",
    ],
  },
  premium: {
    name: "Premium",
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID!,
    price: 149,
    mode: "payment" as const,
    features: [
      "Everything in Standard",
      "Priority email support (48h response)",
      "1-hour deployment assistance call",
      "Custom Supabase schema review",
      "Early access to new templates",
      "Lifetime updates",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

// ============================================
// Stripe Helper Functions
// ============================================

/** Create a Stripe Checkout Session for a subscription */
export async function createCheckoutSession({
  priceId,
  customerId,
  userId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  customerId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    customer: customerId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
  });
}

/** Create a Stripe Customer Portal session */
export async function createPortalSession({
  customerId,
  returnUrl,
}: {
  customerId: string;
  returnUrl: string;
}) {
  return getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

/** Create a Stripe customer for a new user */
export async function createCustomer({
  email,
  userId,
}: {
  email: string;
  userId: string;
}) {
  return getStripe().customers.create({
    email,
    metadata: { userId },
  });
}

/** Get the plan key from a Stripe price ID */
export function getPlanFromPriceId(priceId: string | null): PlanKey {
  if (!priceId) return "free";
  for (const [key, plan] of Object.entries(PLANS)) {
    if (plan.priceId === priceId) return key as PlanKey;
  }
  return "free";
}

/** Format cents to dollars */
export function formatAmount(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
