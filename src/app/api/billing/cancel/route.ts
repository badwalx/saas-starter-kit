import { NextResponse } from "next/server";
import { authenticate, apiError, ApiError } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
export async function POST(request: Request) {
  try {
    const { supabase, user } = await authenticate(request);
    const { data, error } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (!data?.stripe_subscription_id) throw new ApiError("No subscription to cancel", 404);
    const subscription = await getStripe().subscriptions.update(data.stripe_subscription_id, { cancel_at_period_end: true });
    const { error: saveError } = await createAdminClient().from("subscriptions").update({ cancel_at_period_end: subscription.cancel_at_period_end }).eq("user_id", user.id);
    if (saveError) throw saveError;
    return NextResponse.json({ message: "Your subscription will end at the end of the billing period." });
  } catch (error) { return apiError(error); }
}
