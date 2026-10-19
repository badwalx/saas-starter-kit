import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export class ApiError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) throw new Error("NEXT_PUBLIC_SITE_URL is not configured");
  return new URL(value).origin;
}
export async function authenticate(request: Request) {
  // Cookie-authenticated mutations must originate from this application.
  if (request.method !== "GET" && request.headers.get("origin") !== siteUrl()) {
    throw new ApiError("Invalid request origin", 403);
  }
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new ApiError("Please sign in to continue", 401);
  return { supabase, user };
}
export async function readBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = request.headers.get("content-type")?.includes("application/json")
      ? await request.json() : Object.fromEntries(await request.formData());
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch { throw new ApiError("Invalid request body"); }
}
export function apiError(error: unknown) {
  if (error instanceof ApiError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error("API operation failed:", error);
  return NextResponse.json({ error: "Unable to complete this request. Please try again." }, { status: 500 });
}
