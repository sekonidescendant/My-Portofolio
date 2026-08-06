/*
# Create CMS Schema — Full Backend Foundation

## Overview
This migration creates the complete database schema for a production-ready portfolio CMS.
It includes tables for articles, case studies, media, categories, tags, resume files,
documents, contact messages, settings, and profiles. All tables use UUID primary keys,
standard timestamp columns, and a status enum for content lifecycle management.

## Tables Created

1. **profiles** — Stores admin user profile data (name, avatar, bio).
2. **categories** — Content categories (Operations, AI, Startups, etc.).
3. **tags** — Content tags for flexible labeling.
4. **media** — Media library: every uploaded asset stores file name, URL, bucket, file type, size, alt text, caption.
5. **articles** — Full article model with SEO fields, featured image, status.
6. **case_studies** — Full case study model with overview, challenge, process, results, gallery.
7. **resume_files** — Resume document references (ATS, one-page, portfolio PDF).
8. **documents** — Selected work documents (proposals, guides, strategies).
9. **contact_messages** — Submissions from the contact form.
10. **settings** — Site-wide settings: name, email, phone, social links, resume URL, portfolio URL, analytics IDs, SEO defaults.

## Standard Columns
- `id` — UUID primary key (gen_random_uuid)
- `created_at` — timestamptz, default now()
- `updated_at` — timestamptz, default now(), auto-updated via trigger
- `published_at` — timestamptz, nullable, set when content is published
- `status` — content_status enum: 'draft', 'published', 'archived'

## Security
- RLS enabled on every table.
- Public (anon) can READ published content only.
- Authenticated admin can CREATE, READ, UPDATE, DELETE everything.
- Contact messages: anon can INSERT (anyone can submit the form), only admin can READ.
- Settings: only authenticated admin can read/write (contains sensitive data).
- Profiles: only authenticated admin can read/write.

## Storage Buckets
- images (public read, admin write)
- videos (public read, admin write)
- documents (admin only)
- resume (admin only)
- avatars (public read, admin write)
*/

-- ============================================================
-- ENUMS
-- ============================================================

DO $$ BEGIN
  CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- UTILITY: updated_at trigger function
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- PROFILES
-- ============================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  avatar_url text,
  bio text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_profiles" ON profiles;
CREATE POLICY "admin_read_profiles" ON profiles FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_profiles" ON profiles;
CREATE POLICY "admin_insert_profiles" ON profiles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_profiles" ON profiles;
CREATE POLICY "admin_update_profiles" ON profiles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_profiles" ON profiles;
CREATE POLICY "admin_delete_profiles" ON profiles FOR DELETE
  TO authenticated USING (true);

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- CATEGORIES
-- ============================================================

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_categories" ON categories;
CREATE POLICY "admin_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categories" ON categories;
CREATE POLICY "admin_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categories" ON categories;
CREATE POLICY "admin_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- TAGS
-- ============================================================

CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_tags" ON tags;
CREATE POLICY "public_read_tags" ON tags FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_tags" ON tags;
CREATE POLICY "admin_insert_tags" ON tags FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_tags" ON tags;
CREATE POLICY "admin_update_tags" ON tags FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_tags" ON tags;
CREATE POLICY "admin_delete_tags" ON tags FOR DELETE
  TO authenticated USING (true);

CREATE TRIGGER tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- MEDIA
-- ============================================================

CREATE TABLE IF NOT EXISTS media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  url text NOT NULL,
  bucket text NOT NULL,
  file_type text NOT NULL,
  size_bytes bigint DEFAULT 0,
  alt_text text DEFAULT '',
  caption text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_media" ON media;
CREATE POLICY "public_read_media" ON media FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_media" ON media;
CREATE POLICY "admin_insert_media" ON media FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_media" ON media;
CREATE POLICY "admin_update_media" ON media FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_media" ON media;
CREATE POLICY "admin_delete_media" ON media FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_media_bucket ON media(bucket);

CREATE TRIGGER media_updated_at BEFORE UPDATE ON media
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ARTICLES
-- ============================================================

CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  featured_image_url text,
  featured_image_id uuid REFERENCES media(id) ON DELETE SET NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  seo_title text,
  seo_description text,
  status content_status NOT NULL DEFAULT 'draft',
  reading_time text DEFAULT '',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_articles" ON articles;
CREATE POLICY "public_read_articles" ON articles FOR SELECT
  TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "admin_insert_articles" ON articles;
CREATE POLICY "admin_insert_articles" ON articles FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_articles" ON articles;
CREATE POLICY "admin_update_articles" ON articles FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_articles" ON articles;
CREATE POLICY "admin_delete_articles" ON articles FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category_id);

CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ARTICLE-TAG JOIN
-- ============================================================

CREATE TABLE IF NOT EXISTS article_tags (
  article_id uuid NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_article_tags" ON article_tags;
CREATE POLICY "public_read_article_tags" ON article_tags FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_article_tags" ON article_tags;
CREATE POLICY "admin_insert_article_tags" ON article_tags FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_article_tags" ON article_tags;
CREATE POLICY "admin_delete_article_tags" ON article_tags FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- CASE STUDIES
-- ============================================================

CREATE TABLE IF NOT EXISTS case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  overview text DEFAULT '',
  challenge text DEFAULT '',
  objectives text DEFAULT '',
  responsibilities text DEFAULT '',
  tools text DEFAULT '',
  process text DEFAULT '',
  results text DEFAULT '',
  lessons text DEFAULT '',
  gallery jsonb DEFAULT '[]'::jsonb,
  status content_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_case_studies" ON case_studies;
CREATE POLICY "public_read_case_studies" ON case_studies FOR SELECT
  TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "admin_insert_case_studies" ON case_studies;
CREATE POLICY "admin_insert_case_studies" ON case_studies FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_case_studies" ON case_studies;
CREATE POLICY "admin_update_case_studies" ON case_studies FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_case_studies" ON case_studies;
CREATE POLICY "admin_delete_case_studies" ON case_studies FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON case_studies(slug);
CREATE INDEX IF NOT EXISTS idx_case_studies_status ON case_studies(status);

CREATE TRIGGER case_studies_updated_at BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- RESUME FILES
-- ============================================================

CREATE TABLE IF NOT EXISTS resume_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  description text DEFAULT '',
  url text NOT NULL,
  file_type text DEFAULT 'pdf',
  status content_status NOT NULL DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resume_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_resume_files" ON resume_files;
CREATE POLICY "public_read_resume_files" ON resume_files FOR SELECT
  TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "admin_insert_resume_files" ON resume_files;
CREATE POLICY "admin_insert_resume_files" ON resume_files FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_resume_files" ON resume_files;
CREATE POLICY "admin_update_resume_files" ON resume_files FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_resume_files" ON resume_files;
CREATE POLICY "admin_delete_resume_files" ON resume_files FOR DELETE
  TO authenticated USING (true);

CREATE TRIGGER resume_files_updated_at BEFORE UPDATE ON resume_files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- DOCUMENTS (Selected Work)
-- ============================================================

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text DEFAULT '',
  category text DEFAULT '',
  preview_url text,
  file_url text,
  status content_status NOT NULL DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_documents" ON documents;
CREATE POLICY "public_read_documents" ON documents FOR SELECT
  TO anon, authenticated USING (status = 'published');

DROP POLICY IF EXISTS "admin_insert_documents" ON documents;
CREATE POLICY "admin_insert_documents" ON documents FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_documents" ON documents;
CREATE POLICY "admin_update_documents" ON documents FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_documents" ON documents;
CREATE POLICY "admin_delete_documents" ON documents FOR DELETE
  TO authenticated USING (true);

CREATE TRIGGER documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  role text,
  message text NOT NULL,
  job_opportunity boolean DEFAULT false,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_read_contact_messages" ON contact_messages;
CREATE POLICY "admin_read_contact_messages" ON contact_messages FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_contact_messages" ON contact_messages;
CREATE POLICY "admin_update_contact_messages" ON contact_messages FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_contact_messages" ON contact_messages;
CREATE POLICY "admin_delete_contact_messages" ON contact_messages FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created ON contact_messages(created_at DESC);

CREATE TRIGGER contact_messages_updated_at BEFORE UPDATE ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Pelumi Sekoni',
  email text NOT NULL DEFAULT 'hello@pelumisekoni.com',
  phone text DEFAULT '',
  linkedin_url text DEFAULT '',
  github_url text DEFAULT '',
  twitter_url text DEFAULT '',
  portfolio_url text DEFAULT '',
  resume_url text DEFAULT '',
  google_analytics_id text DEFAULT '',
  seo_title text DEFAULT '',
  seo_description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_settings" ON settings;
CREATE POLICY "admin_read_settings" ON settings FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_settings" ON settings;
CREATE POLICY "admin_insert_settings" ON settings FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_settings" ON settings;
CREATE POLICY "admin_update_settings" ON settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_settings" ON settings;
CREATE POLICY "admin_delete_settings" ON settings FOR DELETE
  TO authenticated USING (true);

CREATE TRIGGER settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('images', 'images', true),
  ('videos', 'videos', true),
  ('documents', 'documents', false),
  ('resume', 'resume', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- images: public read, admin write
DROP POLICY IF EXISTS "public_read_images" ON storage.objects;
CREATE POLICY "public_read_images" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'images');

DROP POLICY IF EXISTS "admin_write_images" ON storage.objects;
CREATE POLICY "admin_write_images" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "admin_update_images" ON storage.objects;
CREATE POLICY "admin_update_images" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "admin_delete_images" ON storage.objects;
CREATE POLICY "admin_delete_images" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'images');

-- videos: public read, admin write
DROP POLICY IF EXISTS "public_read_videos" ON storage.objects;
CREATE POLICY "public_read_videos" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'videos');

DROP POLICY IF EXISTS "admin_write_videos" ON storage.objects;
CREATE POLICY "admin_write_videos" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "admin_update_videos" ON storage.objects;
CREATE POLICY "admin_update_videos" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'videos') WITH CHECK (bucket_id = 'videos');

DROP POLICY IF EXISTS "admin_delete_videos" ON storage.objects;
CREATE POLICY "admin_delete_videos" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'videos');

-- documents: admin only
DROP POLICY IF EXISTS "admin_read_documents_bucket" ON storage.objects;
CREATE POLICY "admin_read_documents_bucket" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'documents');

DROP POLICY IF EXISTS "admin_write_documents_bucket" ON storage.objects;
CREATE POLICY "admin_write_documents_bucket" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "admin_update_documents_bucket" ON storage.objects;
CREATE POLICY "admin_update_documents_bucket" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');

DROP POLICY IF EXISTS "admin_delete_documents_bucket" ON storage.objects;
CREATE POLICY "admin_delete_documents_bucket" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'documents');

-- resume: admin only
DROP POLICY IF EXISTS "admin_read_resume_bucket" ON storage.objects;
CREATE POLICY "admin_read_resume_bucket" ON storage.objects FOR SELECT
  TO authenticated USING (bucket_id = 'resume');

DROP POLICY IF EXISTS "admin_write_resume_bucket" ON storage.objects;
CREATE POLICY "admin_write_resume_bucket" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'resume');

DROP POLICY IF EXISTS "admin_update_resume_bucket" ON storage.objects;
CREATE POLICY "admin_update_resume_bucket" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'resume') WITH CHECK (bucket_id = 'resume');

DROP POLICY IF EXISTS "admin_delete_resume_bucket" ON storage.objects;
CREATE POLICY "admin_delete_resume_bucket" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'resume');

-- avatars: public read, admin write
DROP POLICY IF EXISTS "public_read_avatars" ON storage.objects;
CREATE POLICY "public_read_avatars" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "admin_write_avatars" ON storage.objects;
CREATE POLICY "admin_write_avatars" ON storage.objects FOR INSERT
  TO authenticated WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "admin_update_avatars" ON storage.objects;
CREATE POLICY "admin_update_avatars" ON storage.objects FOR UPDATE
  TO authenticated USING (bucket_id = 'avatars') WITH CHECK (bucket_id = 'avatars');

DROP POLICY IF EXISTS "admin_delete_avatars" ON storage.objects;
CREATE POLICY "admin_delete_avatars" ON storage.objects FOR DELETE
  TO authenticated USING (bucket_id = 'avatars');
