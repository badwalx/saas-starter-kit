// ============================================
// SaaS Starter Kit — Shared Types
// ============================================

export type SubscriptionStatus =
  | "inactive"
  | "active"
  | "past_due"
  | "canceled"
  | "trialing";

export type PlanKey = "free" | "starter" | "pro" | "business";

export interface UserSubscription {
  id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  stripeCurrentPeriodEnd: string | null;
  status: SubscriptionStatus;
  planName: PlanKey;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  companyName: string | null;
  updatedAt: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  userId: string;
  stripeInvoiceId: string;
  amountPaidCents: number;
  currency: string;
  status: string;
  pdfUrl: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  createdAt: string;
}

export interface UsageEvent {
  id: string;
  userId: string;
  eventType: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
