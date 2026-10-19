import { NextResponse } from "next/server";
import { authenticate, apiError, ApiError, siteUrl } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
export async function POST(request: Request) {
  try {
    const { supabase, user } = await authenticate(request);
    const { data, error } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (!data) throw new ApiError("No billing account found", 404);
    const session = await getStripe().billingPortal.sessions.create({ customer: data.stripe_customer_id, return_url: `${siteUrl()}/dashboard/billing` });
    return NextResponse.redirect(session.url, 303);
  } catch (error) { return apiError(error); }
}
