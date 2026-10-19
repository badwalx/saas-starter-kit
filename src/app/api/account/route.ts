import { NextResponse } from "next/server";
import { authenticate, apiError, ApiError, readBody } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
export async function PATCH(request: Request) {
  try {
    const { supabase, user } = await authenticate(request);
    const { name } = await readBody(request);
    if (typeof name !== "string" || !name.trim() || name.trim().length > 120) throw new ApiError("Enter a name between 1 and 120 characters");
    const { data, error } = await supabase.from("profiles").update({ full_name: name.trim(), updated_at: new Date().toISOString() }).eq("id", user.id).select("id").single();
    if (error || !data) throw error ?? new Error("Profile not found");
    return NextResponse.json({ message: "Profile saved." });
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request) {
  try {
    const { supabase, user } = await authenticate(request);
    const { confirmation } = await readBody(request);
    if (confirmation !== "DELETE") throw new ApiError("Type DELETE to confirm account deletion");
    const { data, error } = await supabase.from("subscriptions").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
    if (error) throw error;
    if (data?.stripe_customer_id) {
      const stripe = getStripe();
      const customer = await stripe.customers.retrieve(data.stripe_customer_id);
      if (!customer.deleted) {
        // Deleting the customer cancels all subscriptions, including checkout sessions not yet synced by a webhook.
        await stripe.customers.del(data.stripe_customer_id);
      }
    }
    const { error: signOutError } = await supabase.auth.signOut({ scope: "global" });
    if (signOutError) throw signOutError;
    const { error: deleteError } = await createAdminClient().auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;
    return NextResponse.json({ deleted: true });
  } catch (error) { return apiError(error); }
}
