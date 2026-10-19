import { NextResponse } from "next/server";
import { POST as portal } from "@/app/api/billing/portal/route";
export async function POST(request: Request) {
  const response = await portal(request);
  const url = response.headers.get("location");
  return url ? NextResponse.json({ url }) : response;
}
