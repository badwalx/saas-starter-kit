import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Supabase admin client with service role key.
 * ONLY use this in API routes / webhooks — NEVER expose to the browser.
 * Bypasses Row Level Security.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
