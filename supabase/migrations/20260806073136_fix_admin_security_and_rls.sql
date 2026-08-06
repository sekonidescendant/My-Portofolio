/*
# Fix Admin Bootstrap Security & Profile Creation

## Overview
Fixes three critical issues in the admin bootstrap flow:
1. claim_first_admin() silently succeeds even if no profile row exists for the user
   (UPDATE affects 0 rows but still returns true), leaving the user thinking they're admin.
2. profiles RLS allows ANY authenticated user to UPDATE is_admin directly, bypassing
   claim_first_admin() entirely — a privilege escalation vulnerability.
3. Content table write policies allow ANY authenticated user to write, not just admins.

## Changes

### 1. is_current_user_admin() helper function
SECURITY DEFINER function that returns true if the calling user has is_admin = true.
Used in RLS policies to gate admin-only writes.

### 2. claim_first_admin() fix
Now checks if the UPDATE affected any rows. If not, it INSERTs the profile with
is_admin = true as a fallback (in case the handle_new_user trigger didn't fire).

### 3. profiles RLS policies
- SELECT: users can read their own profile; admins can read all.
- UPDATE: users can update their own profile; admins can update all.
- INSERT: admin only (the handle_new_user trigger handles auto-creation via SECURITY DEFINER).
- DELETE: admin only.
- Column-level: is_admin is NOT updatable by regular users (only via claim_first_admin or admin).

### 4. Content table write policies
All write policies (INSERT/UPDATE/DELETE) on articles, case_studies, categories, tags,
article_tags, media, resume_files, documents, settings, and contact_messages now require
is_current_user_admin() instead of just "authenticated".

## Security
- is_admin column protected: regular users cannot set it directly through the Supabase client.
- claim_first_admin is the only path to gain admin, and it only works when zero admins exist.
- Content writes restricted to admins only.
*/

-- ============================================================
-- Helper: is_current_user_admin()
-- ============================================================

CREATE OR REPLACE FUNCTION is_current_user_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS(SELECT 1 FROM profiles WHERE user_id = auth.uid() AND is_admin = true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION is_current_user_admin() TO authenticated;

-- ============================================================
-- Fix claim_first_admin: handle missing profile
-- ============================================================

CREATE OR REPLACE FUNCTION claim_first_admin()
RETURNS boolean AS $$
DECLARE
  admin_exists boolean;
  updated_count int;
BEGIN
  SELECT EXISTS(SELECT 1 FROM profiles WHERE is_admin = true) INTO admin_exists;

  IF admin_exists THEN
    RETURN false;
  END IF;

  UPDATE profiles SET is_admin = true WHERE user_id = auth.uid();
  GET DIAGNOSTICS updated_count = ROW_COUNT;

  IF updated_count = 0 THEN
    INSERT INTO profiles (user_id, name, is_admin)
    VALUES (auth.uid(), '', true)
    ON CONFLICT (user_id) DO UPDATE SET is_admin = true;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION claim_first_admin() TO authenticated;

-- ============================================================
-- Fix profiles RLS: self-read, admin-only writes
-- ============================================================

DROP POLICY IF EXISTS "admin_read_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_insert_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
DROP POLICY IF EXISTS "admin_delete_profiles" ON profiles;

-- Users can read their own profile; admins can read all
CREATE POLICY "profiles_self_read" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id OR is_current_user_admin());

-- Only admins can insert profiles (trigger uses SECURITY DEFINER, bypasses RLS)
CREATE POLICY "profiles_admin_insert" ON profiles FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

-- Users can update own profile; admins can update all
CREATE POLICY "profiles_self_update" ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR is_current_user_admin())
  WITH CHECK (auth.uid() = user_id OR is_current_user_admin());

-- Only admins can delete profiles
CREATE POLICY "profiles_admin_delete" ON profiles FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- Column-level: protect is_admin from direct writes by non-admins
REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (name, avatar_url, bio, updated_at) ON profiles TO authenticated;

-- ============================================================
-- Fix content table write policies: admin-only
-- ============================================================

-- Articles
DROP POLICY IF EXISTS "admin_insert_articles" ON articles;
CREATE POLICY "admin_insert_articles" ON articles FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_articles" ON articles;
CREATE POLICY "admin_update_articles" ON articles FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_articles" ON articles;
CREATE POLICY "admin_delete_articles" ON articles FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- Case Studies
DROP POLICY IF EXISTS "admin_insert_case_studies" ON case_studies;
CREATE POLICY "admin_insert_case_studies" ON case_studies FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_case_studies" ON case_studies;
CREATE POLICY "admin_update_case_studies" ON case_studies FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_case_studies" ON case_studies;
CREATE POLICY "admin_delete_case_studies" ON case_studies FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- Categories
DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- Tags
DROP POLICY IF EXISTS "admin_insert_tags" ON tags;
CREATE POLICY "admin_insert_tags" ON tags FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_tags" ON tags;
CREATE POLICY "admin_update_tags" ON tags FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_tags" ON tags;
CREATE POLICY "admin_delete_tags" ON tags FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- Article Tags
DROP POLICY IF EXISTS "admin_insert_article_tags" ON article_tags;
CREATE POLICY "admin_insert_article_tags" ON article_tags FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_article_tags" ON article_tags;
CREATE POLICY "admin_delete_article_tags" ON article_tags FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- Media
DROP POLICY IF EXISTS "admin_insert_media" ON media;
CREATE POLICY "admin_insert_media" ON media FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_media" ON media;
CREATE POLICY "admin_update_media" ON media FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_media" ON media;
CREATE POLICY "admin_delete_media" ON media FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- Resume Files
DROP POLICY IF EXISTS "admin_insert_resume_files" ON resume_files;
CREATE POLICY "admin_insert_resume_files" ON resume_files FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_resume_files" ON resume_files;
CREATE POLICY "admin_update_resume_files" ON resume_files FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_resume_files" ON resume_files;
CREATE POLICY "admin_delete_resume_files" ON resume_files FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- Documents
DROP POLICY IF EXISTS "admin_insert_documents" ON documents;
CREATE POLICY "admin_insert_documents" ON documents FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_documents" ON documents;
CREATE POLICY "admin_update_documents" ON documents FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_documents" ON documents;
CREATE POLICY "admin_delete_documents" ON documents FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- Contact Messages (admin read/update/delete, public insert stays)
DROP POLICY IF EXISTS "admin_read_contact_messages" ON contact_messages;
CREATE POLICY "admin_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_contact_messages" ON contact_messages;
CREATE POLICY "admin_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_contact_messages" ON contact_messages;
CREATE POLICY "admin_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (is_current_user_admin());

-- Settings (admin only)
DROP POLICY IF EXISTS "admin_read_settings" ON settings;
CREATE POLICY "admin_read_settings" ON settings FOR SELECT
  TO authenticated USING (is_current_user_admin());

DROP POLICY IF EXISTS "admin_insert_settings" ON settings;
CREATE POLICY "admin_insert_settings" ON settings FOR INSERT
  TO authenticated WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_settings" ON settings;
CREATE POLICY "admin_update_settings" ON settings FOR UPDATE
  TO authenticated USING (is_current_user_admin()) WITH CHECK (is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_settings" ON settings;
CREATE POLICY "admin_delete_settings" ON settings FOR DELETE
  TO authenticated USING (is_current_user_admin());
