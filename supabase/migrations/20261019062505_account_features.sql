-- One billing account per user; fail explicitly if legacy duplicate rows need reconciliation.
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
ALTER TABLE public.subscriptions ADD COLUMN cancel_at_period_end boolean NOT NULL DEFAULT false;

CREATE TABLE public.api_keys (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 80),
  key_prefix text NOT NULL,
  key_hash text NOT NULL UNIQUE CHECK (key_hash ~ '^[a-f0-9]{64}$'),
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
CREATE INDEX api_keys_user_id_idx ON public.api_keys(user_id);
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own key metadata" ON public.api_keys FOR SELECT
  TO authenticated USING ((select auth.uid()) = user_id);
-- Only server routes may create/revoke keys. Do not expose hashes via the Data API.
REVOKE ALL ON public.api_keys FROM anon, authenticated;
GRANT SELECT (id, user_id, name, key_prefix, created_at, revoked_at) ON public.api_keys TO authenticated;
GRANT ALL ON public.api_keys TO service_role;

DROP POLICY "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);
GRANT SELECT ON public.profiles, public.subscriptions, public.usage_events TO authenticated;
GRANT UPDATE (full_name, avatar_url, company_name, updated_at) ON public.profiles TO authenticated;
GRANT ALL ON public.profiles, public.subscriptions TO service_role;

-- Harden the existing signup trigger's execution context.
ALTER FUNCTION public.handle_new_user() SET search_path = '';
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
