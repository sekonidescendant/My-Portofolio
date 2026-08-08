/*
# Seed Article Categories

## Overview
Populates the categories table with the categories already referenced by the
static article content (lib/articles.ts), so the Articles admin UI has real
options in its category dropdown instead of starting empty.

Safe to re-run: uses ON CONFLICT DO NOTHING against the unique `name` column.
*/

INSERT INTO categories (name, slug, description) VALUES
  ('Operations', 'operations', 'Process, coordination, and getting things done.'),
  ('AI', 'ai', 'Artificial intelligence tools, trends, and applications.'),
  ('Startups', 'startups', 'Building and working with early-stage companies.'),
  ('Community', 'community', 'Community building, events, and partnerships.'),
  ('Blockchain', 'blockchain', 'Web3, crypto, and blockchain ecosystem writing.'),
  ('Productivity', 'productivity', 'Tools and systems for working effectively.'),
  ('WordPress', 'wordpress', 'WordPress development and content work.')
ON CONFLICT (name) DO NOTHING;
