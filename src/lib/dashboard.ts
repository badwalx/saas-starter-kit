import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLANS, type PlanKey } from "@/lib/stripe";
export async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");
  const monthStart = new Date();
  monthStart.setUTCDate(1); monthStart.setUTCHours(0, 0, 0, 0);
  const [profile, subscription, usage, activity, keys] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("usage_events").select("id", { count: "exact", head: true }).eq("user_id", user.id).eq("event_type", "api_call").gte("created_at", monthStart.toISOString()),
    supabase.from("usage_events").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(10),
    supabase.from("api_keys").select("id", { count: "exact", head: true }).eq("user_id", user.id).is("revoked_at", null),
  ]);
  for (const result of [profile, subscription, usage, activity, keys]) if (result.error) throw result.error;
  const planKey = subscription.data?.plan_name;
  const plan = PLANS[planKey && Object.hasOwn(PLANS, planKey) ? planKey as PlanKey : "free"];
  return { user, profile: profile.data, subscription: subscription.data, usage: usage.count ?? 0, activity: activity.data ?? [], keyCount: keys.count ?? 0, plan };
}
