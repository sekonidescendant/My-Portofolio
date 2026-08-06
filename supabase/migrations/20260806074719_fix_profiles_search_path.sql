/*
# Fix "relation profiles does not exist" on signup

## Root Cause
All SECURITY DEFINER functions (handle_new_user, claim_first_admin, has_admin,
is_current_user_admin) reference the `profiles` table without schema qualification
and without a `search_path` configuration. When the `on_auth_user_created` trigger
fires during auth signup, the calling role's search_path does not include `public`,
so `profiles` cannot be resolved — causing HTTP 500 "Database error saving new user".

## Fix
1. Recreate all four functions with `SET search_path = public` and `public.profiles`
   schema-qualified references.
2. Recreate the `on_auth_user_created` trigger to use the fixed function.
3. Re-grant execute privileges.

## Tables Modified
- None (no schema changes, only function definitions).

## Security
- All functions remain SECURITY DEFINER.
- search_path is locked to `public` to prevent search_path injection.
- No changes to RLS policies or table structure.
*/

-- ============================================================
-- Fix handle_new_user: schema-qualify + set search_path
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, is_admin)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), false)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- Fix claim_first_admin: schema-qualify + set search_path
-- ============================================================

CREATE OR REPLACE FUNCTION claim_first_admin()
RETURNS boolean AS $$
DECLARE
  admin_exists boolean;
  updated_count int;
BEGIN
  SELECT EXISTS(SELECT 1 FROM public.profiles WHERE is_admin = true) INTO admin_exists;

  IF admin_exists THEN
    RETURN false;
  END IF;

  UPDATE public.profiles SET is_admin = true WHERE user_id = auth.uid();
  GET DIAGNOSTICS updated_count = ROW_COUNT;

  IF updated_count = 0 THEN
    INSERT INTO public.profiles (user_id, name, is_admin)
    VALUES (auth.uid(), '', true)
    ON CONFLICT (user_id) DO UPDATE SET is_admin = true;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- Fix has_admin: schema-qualify + set search_path
-- ============================================================

CREATE OR REPLACE FUNCTION has_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM public.profiles WHERE is_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- Fix is_current_user_admin: schema-qualify + set search_path
-- ============================================================

CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ============================================================
-- Recreate trigger with fixed function
-- ============================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Re-grant execute privileges
-- ============================================================

GRANT EXECUTE ON FUNCTION claim_first_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION has_admin() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_current_user_admin() TO authenticated;
