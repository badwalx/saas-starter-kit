-- Supabase projects may grant table-level UPDATE by default. Revoke that
-- privilege before granting editable columns so billing/identity fields stay protected.
REVOKE UPDATE ON public.profiles FROM anon, authenticated;
GRANT UPDATE (full_name, avatar_url, company_name, updated_at) ON public.profiles TO authenticated;
