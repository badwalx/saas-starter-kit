import { NextResponse } from "next/server";
import { authenticate, apiError, ApiError, readBody, siteUrl } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, PLANS } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { supabase, user } = await authenticate(request);
    const body = await readBody(request);
    // Accept a plan name or a configured price ID; never trust arbitrary prices.
    const requestedPrice = body.price_id ?? body.priceId;
    const plan = body.plan ?? Object.entries(PLANS).find(([, value]) => value.priceId && value.priceId === requestedPrice)?.[0];
    if (plan !== "starter" && plan !== "pro" && plan !== "business") throw new ApiError("Choose a valid plan");
    const price = PLANS[plan].priceId;
    if (!price) throw new ApiError("This plan is not configured yet", 503);
    if (requestedPrice !== undefined && requestedPrice !== price) throw new ApiError("Price does not match the selected plan");
    const stripe = getStripe();
    const { data: existing, error } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (existing?.stripe_subscription_id && !["canceled", "incomplete_expired"].includes(existing.status)) {
      throw new ApiError("Manage your existing subscription in the billing portal", 409);
    }
    let customerId = existing?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } }, { idempotencyKey: `customer-${user.id}` });
      customerId = customer.id;
      const { error: saveError } = await createAdminClient().from("subscriptions").upsert({ user_id: user.id, stripe_customer_id: customerId }, { onConflict: "user_id" });
      if (saveError) throw saveError;
    }
    // A stable key makes retries reuse an open session instead of creating duplicate subscriptions.
    const session = await stripe.checkout.sessions.create({
      mode: "subscription", customer: customerId, client_reference_id: user.id,
      line_items: [{ price, quantity: 1 }], metadata: { userId: user.id },
      subscription_data: { metadata: { userId: user.id } },
      success_url: `${siteUrl()}/dashboard/billing?checkout=success`,
      cancel_url: `${siteUrl()}/dashboard/billing?checkout=canceled`,
    }, { idempotencyKey: `checkout-${user.id}-${plan}-${Math.floor(Date.now() / 1800000)}` });
    if (!session.url) throw new Error("Checkout session has no URL");
    return NextResponse.redirect(session.url, 303);
  } catch (error) { return apiError(error); }
}
