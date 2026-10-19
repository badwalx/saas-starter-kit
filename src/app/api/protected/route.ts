import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Example protected API route.
 * The middleware ensures the user is authenticated before reaching this handler.
 * Use this pattern for all your API routes that require auth.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's subscription for plan-gated features
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan_name, status")
    .eq("user_id", user.id)
    .single();

  // Example: Check plan limits
  const planName = subscription?.plan_name || "free";
  if (planName === "free") {
    // Check usage limit for free plan
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("usage_events")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth.toISOString());

    if ((count || 0) >= 100) {
      return NextResponse.json(
        {
          error: "Usage limit exceeded",
          message:
            "Free plan is limited to 100 API calls/month. Upgrade to increase your limit.",
          currentUsage: count,
          limit: 100,
        },
        { status: 429 }
      );
    }
  }

  // Track usage
  await supabase.from("usage_events").insert({
    user_id: user.id,
    event_type: "api_call",
    metadata: { path: request.nextUrl.pathname, method: "GET" },
  });

  // Your actual API logic here
  return NextResponse.json({
    message: "This is a protected API response",
    user: {
      id: user.id,
      email: user.email,
      plan: planName,
    },
    data: {
      // Your data here
    },
  });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Track usage
  await supabase.from("usage_events").insert({
    user_id: user.id,
    event_type: "api_call",
    metadata: { path: request.nextUrl.pathname, method: "POST", body },
  });

  return NextResponse.json({
    message: "Resource created",
    data: body,
  });
}
