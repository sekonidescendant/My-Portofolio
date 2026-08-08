/*
# Make Resume Bucket Public-Read

## Why
The original schema set the `resume` storage bucket to admin-only read
(same policy as the private `documents` bucket). That works for internal
documents, but a resume is meant to be downloadable by any site visitor —
with admin-only read, no public download link could ever work, since
generating a signed URL still requires the caller to already have SELECT
rights, which a public visitor doesn't have.

This flips `resume` to public-read (matching `images` and `videos`), while
keeping write/update/delete admin-only. Uploading still requires being
signed in as admin; downloading does not.
*/

UPDATE storage.buckets SET public = true WHERE id = 'resume';

DROP POLICY IF EXISTS "admin_read_resume_bucket" ON storage.objects;
DROP POLICY IF EXISTS "public_read_resume_bucket" ON storage.objects;
CREATE POLICY "public_read_resume_bucket" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'resume');
