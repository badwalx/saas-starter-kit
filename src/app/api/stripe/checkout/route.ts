import { NextResponse } from "next/server";
import { POST as checkout } from "@/app/api/checkout/route";
import { PLANS } from "@/lib/stripe";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const plan = Object.entries(PLANS).find(([, value]) => value.priceId && value.priceId === body.priceId)?.[0];
    const response = await checkout(new Request(request.url, { method: "POST", headers: request.headers, body: JSON.stringify({ plan }) }));
    const url = response.headers.get("location");
    return url ? NextResponse.json({ url }) : response;
  } catch { return NextResponse.json({ error: "Invalid request body" }, { status: 400 }); }
}
