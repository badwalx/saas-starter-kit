import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, expect, it } from "vitest";

const db = new PGlite();
const userId = "11111111-1111-4111-8111-111111111111";
beforeAll(async () => {
  await db.exec(`
    CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;
    CREATE SCHEMA auth;
    CREATE TABLE auth.users (id uuid PRIMARY KEY, raw_user_meta_data jsonb DEFAULT '{}');
    CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS
      $$ SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
    CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS
      $$ SELECT current_user::text $$;
    GRANT USAGE ON SCHEMA public, auth TO anon, authenticated, service_role;
    -- Simulate Supabase's default table grants, including table-level UPDATE.
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
    CREATE FUNCTION public.uuid_generate_v4() RETURNS uuid LANGUAGE sql AS $$ SELECT gen_random_uuid() $$;
  `);
  for (const file of ["20240101000000_initial_schema.sql", "20261019062505_account_features.sql", "20261019070000_profile_permissions.sql"]) {
    // PGlite has native UUID generation; only the extension install is replaced above.
    const sql = readFileSync(new URL(`../supabase/migrations/${file}`, import.meta.url), "utf8").replace('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";', "");
    await db.exec(sql);
  }
  await db.exec(`INSERT INTO auth.users(id, raw_user_meta_data) VALUES ('${userId}', '{"full_name":"Test User"}');`);
}, 20000);
afterAll(async () => { await db.close(); });

it("creates profiles via the hardened signup trigger", async () => {
  const { rows } = await db.query("SELECT full_name FROM public.profiles WHERE id = $1", [userId]);
  expect(rows).toEqual([{ full_name: "Test User" }]);
});
it("allows profile edits but prevents identity and timestamp edits", async () => {
  const { rows } = await db.query(`SELECT
    has_column_privilege('authenticated', 'public.profiles', 'full_name', 'UPDATE') AS name,
    has_column_privilege('authenticated', 'public.profiles', 'id', 'UPDATE') AS identity,
    has_column_privilege('authenticated', 'public.profiles', 'created_at', 'UPDATE') AS created`);
  expect(rows).toEqual([{ name: true, identity: false, created: false }]);
});
it("exposes key metadata while denying hashes and direct key mutations", async () => {
  const { rows } = await db.query(`SELECT
    has_column_privilege('authenticated', 'public.api_keys', 'key_prefix', 'SELECT') AS prefix,
    has_column_privilege('authenticated', 'public.api_keys', 'key_hash', 'SELECT') AS hash,
    has_table_privilege('authenticated', 'public.api_keys', 'INSERT') AS insert,
    has_table_privilege('authenticated', 'public.api_keys', 'UPDATE') AS update`);
  expect(rows).toEqual([{ prefix: true, hash: false, insert: false, update: false }]);
});
it("limits key metadata reads to the authenticated owner", async () => {
  await db.exec(`INSERT INTO public.api_keys (user_id, name, key_prefix, key_hash)
    VALUES ('${userId}', 'Test', 'sk_live_test', repeat('a', 64));
    SET ROLE authenticated;
    SELECT set_config('request.jwt.claim.sub', '22222222-2222-4222-8222-222222222222', false);`);
  try {
    expect((await db.query("SELECT id FROM public.api_keys")).rows).toEqual([]);
    await db.query("SELECT set_config('request.jwt.claim.sub', $1, false)", [userId]);
    expect((await db.query("SELECT id FROM public.api_keys")).rows).toHaveLength(1);
  } finally { await db.exec("RESET ROLE"); }
});
