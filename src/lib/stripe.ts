import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// ============================================
// Plan Configuration
// ============================================
export const PLANS = {
  free: {
    name: "Free",
    priceId: null,
    price: 0,
    features: [
      "Up to 100 API calls/month",
      "Basic dashboard",
      "Community support",
    ],
    limits: { apiCalls: 100 },
  },
  starter: {
    name: "Starter",
    priceId: process.env.STRIPE_PRICE_ID_STARTER!,
    price: 29,
    features: [
      "Up to 5,000 API calls/month",
      "Full dashboard",
      "Email support",
      "Custom webhooks",
    ],
    limits: { apiCalls: 5000 },
  },
  pro: {
    name: "Pro",
    priceId: process.env.STRIPE_PRICE_ID_PRO!,
    price: 79,
    features: [
      "Up to 50,000 API calls/month",
      "Full dashboard + analytics",
      "Priority support",
      "Custom webhooks",
      "Team members (up to 5)",
    ],
    limits: { apiCalls: 50000 },
  },
  business: {
    name: "Business",
    priceId: process.env.STRIPE_PRICE_ID_BUSINESS!,
    price: 199,
    features: [
      "Unlimited API calls",
      "Full dashboard + analytics",
      "Dedicated support",
      "Custom webhooks",
      "Unlimited team members",
      "SLA guarantee",
    ],
    limits: { apiCalls: Infinity },
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
  return stripe.checkout.sessions.create({
    mode: "subscription",
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
  return stripe.billingPortal.sessions.create({
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
  return stripe.customers.create({
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
