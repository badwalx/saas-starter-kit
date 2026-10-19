import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { authenticate, apiError, ApiError, readBody } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";
export const runtime = "nodejs";
const columns = "id, name, key_prefix, created_at, revoked_at";
export async function GET(request: Request) {
  try {
    const { supabase, user } = await authenticate(request);
    const { data, error } = await supabase.from("api_keys").select(columns).eq("user_id", user.id).order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ keys: data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    const { user } = await authenticate(request);
    const { name } = await readBody(request);
    if (typeof name !== "string" || !name.trim() || name.trim().length > 80) throw new ApiError("Enter a key name between 1 and 80 characters");
    const key = `sk_live_${randomBytes(32).toString("hex")}`;
    const { data, error } = await createAdminClient().from("api_keys").insert({ user_id: user.id, name: name.trim(), key_prefix: key.slice(0, 16), key_hash: createHash("sha256").update(key).digest("hex") }).select(columns).single();
    if (error) throw error;
    return NextResponse.json({ key, record: data }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: Request) {
  try {
    const { user } = await authenticate(request);
    const { id } = await readBody(request);
    if (typeof id !== "string" || !/^[0-9a-f-]{36}$/i.test(id)) throw new ApiError("Invalid key ID");
    const { data, error } = await createAdminClient().from("api_keys").update({ revoked_at: new Date().toISOString() }).eq("id", id).eq("user_id", user.id).is("revoked_at", null).select("id").maybeSingle();
    if (error) throw error;
    if (!data) throw new ApiError("Active key not found", 404);
    return NextResponse.json({ revoked: true });
  } catch (error) { return apiError(error); }
}
