import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getStripe, getPlanFromPriceId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  let event: Stripe.Event;
  try { event = getStripe().webhooks.constructEvent(await request.text(), signature, secret); }
  catch { return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 }); }
  try {
    const stripe = getStripe();
    if (event.type === "invoice.payment_succeeded" || event.type === "invoice.payment_failed") {
      const invoice = await stripe.invoices.retrieve(event.data.object.id);
      const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
      const admin = createAdminClient();
      const { data: owner, error: lookupError } = await admin.from("subscriptions").select("user_id").eq("stripe_customer_id", customerId ?? "").maybeSingle();
      if (lookupError) throw lookupError;
      if (!owner) throw new Error("No account mapped to invoice");
      const { error } = await admin.from("invoices").upsert({
        user_id: owner.user_id, stripe_invoice_id: invoice.id,
        amount_paid_cents: invoice.amount_paid, currency: invoice.currency,
        status: invoice.status ?? "open", pdf_url: invoice.invoice_pdf,
        period_start: new Date(invoice.period_start * 1000).toISOString(),
        period_end: new Date(invoice.period_end * 1000).toISOString(),
      }, { onConflict: "stripe_invoice_id" });
      if (error) throw error;
      return NextResponse.json({ received: true });
    }
    let subscriptionId: string | undefined;
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      if (session.mode !== "subscription") return NextResponse.json({ received: true });
      subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
    } else if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      subscriptionId = event.data.object.id;
    } else return NextResponse.json({ received: true });
    if (!subscriptionId) throw new Error("Missing subscription ID");
    // Fetch current Stripe state so delayed/retried events cannot restore stale status.
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    const admin = createAdminClient();
    const { data: existing, error: lookupError } = await admin.from("subscriptions").select("user_id, stripe_subscription_id").eq("stripe_customer_id", customerId).maybeSingle();
    if (lookupError) throw lookupError;
    const userId = existing?.user_id;
    if (!userId) throw new Error("No account mapped to Stripe customer");
    if (existing.stripe_subscription_id && existing.stripe_subscription_id !== subscription.id) {
      const current = await stripe.subscriptions.retrieve(existing.stripe_subscription_id);
      if (current.created > subscription.created) return NextResponse.json({ received: true });
    }
    const priceId = subscription.items.data[0]?.price.id ?? null;
    const entitled = ["active", "trialing"].includes(subscription.status);
    const { error } = await admin.from("subscriptions").upsert({
      user_id: userId, stripe_customer_id: customerId, stripe_subscription_id: subscription.id,
      stripe_price_id: priceId, stripe_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      status: subscription.status, plan_name: entitled ? getPlanFromPriceId(priceId) : "free",
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id" });
    if (error) throw error;
    const { error: profileError } = await admin.from("profiles").update({ updated_at: new Date().toISOString() }).eq("id", userId);
    if (profileError) throw profileError;
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
