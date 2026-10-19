import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Get usage statistics for the current user.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "month";

  // Calculate period start
  const startDate = new Date();
  if (period === "month") {
    startDate.setDate(1);
  } else if (period === "week") {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === "day") {
    startDate.setHours(0, 0, 0, 0);
  }
  startDate.setHours(0, 0, 0, 0);

  // Get usage counts by event type
  const { data: events } = await supabase
    .from("usage_events")
    .select("event_type, created_at")
    .eq("user_id", user.id)
    .gte("created_at", startDate.toISOString());

  // Aggregate by type
  const usageByType: Record<string, number> = {};
  events?.forEach((event) => {
    usageByType[event.event_type] = (usageByType[event.event_type] || 0) + 1;
  });

  return NextResponse.json({
    period,
    startDate: startDate.toISOString(),
    totalEvents: events?.length || 0,
    usageByType,
  });
}
