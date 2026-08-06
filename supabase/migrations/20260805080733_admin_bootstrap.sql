/*
# Admin Bootstrap & Registration Lockdown

## Overview
Sets up the "first admin" bootstrap flow. The first user to call claim_first_admin()
becomes the admin. After that, no one else can claim admin.

## Changes

1. **profiles.is_admin** — Boolean column, defaults false.
2. **handle_new_user trigger** — Auto-inserts a profile row when a user signs up.
3. **claim_first_admin()** — SECURITY DEFINER function: if no admin exists, makes the
   caller an admin and returns true. If an admin already exists, returns false.
4. **has_admin()** — SECURITY DEFINER function: returns whether any admin exists.
   Used by the frontend to show/hide the registration form.

## Security
- claim_first_admin is SECURITY DEFINER so it can write is_admin bypassing RLS.
  It only grants admin if zero admins exist — safe by construction.
- has_admin is SECURITY DEFINER so anon can check without reading profiles directly.
*/

-- ============================================================
-- Add is_admin column to profiles
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean NOT NULL DEFAULT false;

-- ============================================================
-- Auto-create profile on signup
-- ============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (user_id, name, is_admin)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), false)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- claim_first_admin: first user becomes admin, then locked
-- ============================================================

CREATE OR REPLACE FUNCTION claim_first_admin()
RETURNS boolean AS $$
DECLARE
  admin_exists boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM profiles WHERE is_admin = true) INTO admin_exists;

  IF admin_exists THEN
    RETURN false;
  END IF;

  UPDATE profiles SET is_admin = true WHERE user_id = auth.uid();
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- has_admin: check if any admin exists (for frontend gating)
-- ============================================================

CREATE OR REPLACE FUNCTION has_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM profiles WHERE is_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION claim_first_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION has_admin() TO anon, authenticated;
