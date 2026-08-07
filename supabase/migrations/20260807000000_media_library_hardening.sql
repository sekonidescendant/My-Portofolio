/*
# Media Library: folder support + storage write hardening

## Overview
1. Adds a `folder` column to `media` so the library can group files into
   virtual folders (flat, tag-style — not nested filesystem paths).
2. Closes a gap left by the previous admin-hardening migration: table-level
   writes (INSERT/UPDATE/DELETE on `media`, `resume_files`, `documents`, etc.)
   were locked to `is_current_user_admin()`, but the underlying
   `storage.objects` policies for the `images`, `videos`, `documents`, and
   `resume` buckets were still only gated on `TO authenticated` — meaning
   any signed-in (non-admin) user could upload/overwrite/delete files
   directly in storage, even though they couldn't touch the metadata
   tables. This migration re-creates those policies to also require
   `is_current_user_admin()`.

## Notes
- Safe to re-run: uses IF NOT EXISTS / DROP POLICY IF EXISTS throughout.
- If you want to remove public self-signup entirely (recommended for a
  single-admin site), also turn off "Allow new users to sign up" under
  Supabase Dashboard -> Authentication -> Providers -> Email. This
  migration is defense-in-depth on top of that, not a replacement for it.
*/

-- ============================================================
-- 1. media.folder
-- ============================================================

ALTER TABLE media ADD COLUMN IF NOT EXISTS folder text DEFAULT '';
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);

-- ============================================================
-- 2. Lock storage.objects writes to admins only
-- ============================================================

-- images: public read, admin-only write
DROP POLICY IF EXISTS "admin_write_images" ON storage.objects;
CREATE POLICY "admin_write_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'images' AND is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_images" ON storage.objects;
CREATE POLICY "admin_update_images" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'images' AND is_current_user_admin())
  WITH CHECK (bucket_id = 'images' AND is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_images" ON storage.objects;
CREATE POLICY "admin_delete_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'images' AND is_current_user_admin());

-- videos: public read, admin-only write
DROP POLICY IF EXISTS "admin_write_videos" ON storage.objects;
CREATE POLICY "admin_write_videos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'videos' AND is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_videos" ON storage.objects;
CREATE POLICY "admin_update_videos" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'videos' AND is_current_user_admin())
  WITH CHECK (bucket_id = 'videos' AND is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_videos" ON storage.objects;
CREATE POLICY "admin_delete_videos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'videos' AND is_current_user_admin());

-- documents: admin-only read + write
DROP POLICY IF EXISTS "admin_read_documents_bucket" ON storage.objects;
CREATE POLICY "admin_read_documents_bucket" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'documents' AND is_current_user_admin());

DROP POLICY IF EXISTS "admin_write_documents_bucket" ON storage.objects;
CREATE POLICY "admin_write_documents_bucket" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'documents' AND is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_documents_bucket" ON storage.objects;
CREATE POLICY "admin_update_documents_bucket" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'documents' AND is_current_user_admin())
  WITH CHECK (bucket_id = 'documents' AND is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_documents_bucket" ON storage.objects;
CREATE POLICY "admin_delete_documents_bucket" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'documents' AND is_current_user_admin());

-- resume: admin-only read + write
DROP POLICY IF EXISTS "admin_read_resume_bucket" ON storage.objects;
CREATE POLICY "admin_read_resume_bucket" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'resume' AND is_current_user_admin());

DROP POLICY IF EXISTS "admin_write_resume_bucket" ON storage.objects;
CREATE POLICY "admin_write_resume_bucket" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'resume' AND is_current_user_admin());

DROP POLICY IF EXISTS "admin_update_resume_bucket" ON storage.objects;
CREATE POLICY "admin_update_resume_bucket" ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'resume' AND is_current_user_admin())
  WITH CHECK (bucket_id = 'resume' AND is_current_user_admin());

DROP POLICY IF EXISTS "admin_delete_resume_bucket" ON storage.objects;
CREATE POLICY "admin_delete_resume_bucket" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'resume' AND is_current_user_admin());
