/*
# Extend Case Studies + Seed Existing Content

## Overview
The case_studies table (from the original CMS schema) only had narrative
fields (overview, challenge, objectives, responsibilities, tools, process,
results, lessons, gallery). This adds the fields from the original CMS
wishlist that didn't exist yet: role, category, summary, client, live_url,
github_url, featured, and highlights (the short result badges shown in the
hero, e.g. "30 → 190 iOS downloads").

`process` is upgraded from a plain text column to jsonb, since it's
naturally a list of {title, description} steps — the table has no admin UI
yet, so no real data exists in this column to migrate.

Then seeds the 4 case studies that already exist on the public site
(previously hardcoded in lib/case-studies.ts) as real rows, so switching the
public page to read from the database doesn't lose anything.

Safe to re-run: uses IF NOT EXISTS for columns and ON CONFLICT for the seed.
*/

ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS role text DEFAULT '';
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS category text DEFAULT '';
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS summary text DEFAULT '';
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS client text DEFAULT '';
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS live_url text DEFAULT '';
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS github_url text DEFAULT '';
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS featured boolean NOT NULL DEFAULT false;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS highlights jsonb DEFAULT '[]'::jsonb;

ALTER TABLE case_studies DROP COLUMN IF EXISTS process;
ALTER TABLE case_studies ADD COLUMN process jsonb DEFAULT '[]'::jsonb;

-- ============================================================
-- SEED: existing 4 case studies (previously hardcoded)
-- ============================================================

INSERT INTO case_studies (
  title, slug, role, category, summary, highlights,
  overview, challenge, objectives, responsibilities, tools, process, results, lessons,
  status, published_at
) VALUES
(
  'Verrsa Product Launch', 'verrsa', 'Chief Operating Officer', 'Operations',
  'Leading operations and content systems for a startup launch from zero to measurable traction.',
  '["30 → 190 iOS downloads in one week"]'::jsonb,
  'As Chief Operating Officer at Verrsa, I was responsible for coordinating the product launch end-to-end — from launch strategy and team onboarding to content systems and social media operations. The goal was to turn an early-stage product into a launch with measurable traction within its first week.',
  'Verrsa needed to go from pre-launch to a live product with an active content engine and a coordinated launch — all with a small, distributed team and no existing operational documentation.',
  E'Ship a coordinated product launch with clear ownership across teams\nBuild a content operations system capable of scaling beyond launch\nDrive measurable iOS downloads within the first week',
  E'Launch strategy and execution coordination\nBuilt the Social Media Manager Guide for the team\nOnboarded and coordinated 20 writers\nOversaw content operations and publishing workflows',
  E'More details coming soon.',
  '[{"title":"Launch Strategy","description":"Defined the launch plan, ownership areas, and milestones to align the team around a single launch date."},{"title":"Content Systems","description":"Created the Social Media Manager Guide and onboarded 20 writers into a repeatable content workflow."},{"title":"Execution","description":"Coordinated the launch week, tracked downloads, and adjusted outreach in real time to sustain momentum."}]'::jsonb,
  E'30 → 190 iOS downloads in one week\n20 writers onboarded into a repeatable content system\nA documented social media playbook the team could reuse',
  E'A clear launch strategy with named owners removes ambiguity for small teams.\nContent systems built before launch compound once the product is live.\nMore details coming soon.',
  'published', now()
),
(
  'Blockchain FUOYE', 'blockchain-fuoye', 'Project Coordinator', 'Community Operations',
  'Coordinating events and partnerships that grew a student blockchain community past 200 members.',
  '["50 → 200+ Members","6 Events","2000+ Attendees"]'::jsonb,
  'As Project Coordinator for Blockchain FUOYE, I helped build and grow a student blockchain community at FUOYE — coordinating events, securing partnerships, and creating the structure that let the community scale from its earliest members to over 200.',
  'The community needed to grow from a small founding group into a recognized student community, with consistent events, partnerships, and engagement — all without dedicated full-time staff.',
  E'Grow the community from its founding members past 200\nRun consistent, high-attendance events\nEstablish partnerships that could sustain the community long-term',
  E'Coordinated 6 events end-to-end\nSecured and managed external partnerships\nDrove community growth and engagement',
  E'More details coming soon.',
  '[{"title":"Event Coordination","description":"Planned and ran 6 events, managing logistics, speakers, and promotion to reach 2,000+ attendees in total."},{"title":"Partnerships","description":"Identified and secured partnerships that brought resources, speakers, and credibility to the community."},{"title":"Community Growth","description":"Built the engagement rhythm that grew the community from 50 to 200+ members."}]'::jsonb,
  E'50 → 200+ members\n6 events organized\n2,000+ attendees reached\nPartnerships established',
  E'Consistency in events matters more than scale — showing up regularly builds trust.\nPartnerships multiply what a small team can do alone.\nMore details coming soon.',
  'published', now()
),
(
  'Workloob Global', 'workloob', 'Content Lead', 'Content Operations',
  'Building educational content and onboarding systems for a global learning platform.',
  '[]'::jsonb,
  'As Content Lead at Workloob Global, I was responsible for the educational content engine — producing threads, videos, and onboarding content that helped learners and creators get value from the platform.',
  'Workloob needed a consistent, high-quality content pipeline across multiple formats, plus onboarding content that could help new users and creators ramp up quickly.',
  E'Build a repeatable content pipeline across threads, videos, and onboarding\nProduce educational content that served a global learning audience\nCreate onboarding content that reduced ramp-up time',
  E'Led educational content production\nCreated threads and video content\nBuilt onboarding content for new users and creators',
  E'More details coming soon.',
  '[{"title":"Content Strategy","description":"Defined the content mix across educational threads, videos, and onboarding material to serve the platform''s global audience."},{"title":"Production","description":"Produced and shipped content across formats, maintaining consistency and quality."},{"title":"Onboarding","description":"Created onboarding content that helped new users and creators understand and adopt the platform."}]'::jsonb,
  E'Educational content shipped across multiple formats\nOnboarding content created for new users\nMore details coming soon.',
  E'A clear content mix prevents format sprawl and keeps quality consistent.\nOnboarding content is one of the highest-leverage things a content team can build.\nMore details coming soon.',
  'published', now()
),
(
  'Earn Remote Africa', 'earn-remote', 'WordPress Operations', 'Website Operations',
  'Managing, optimizing and documenting WordPress operations for a remote-work platform.',
  '[]'::jsonb,
  'As WordPress Operations at Earn Remote Africa, I managed the website end-to-end — handling optimization, documentation, and ongoing maintenance to keep the platform reliable for a remote-work audience.',
  'The website needed consistent maintenance, performance optimization, and operational documentation so the team could manage it without relying on a single person''s tacit knowledge.',
  E'Keep the WordPress site fast, reliable, and up to date\nCreate documentation that made the site maintainable by the team\nEstablish a maintenance rhythm that prevented issues before they reached users',
  E'Website optimization and performance tuning\nCreated operational documentation\nHandled ongoing site maintenance',
  E'WordPress\nMore details coming soon.',
  '[{"title":"Optimization","description":"Improved website performance and reliability for the remote-work platform''s audience."},{"title":"Documentation","description":"Created operational documentation so the team could manage the site without relying on one person."},{"title":"Maintenance","description":"Established a maintenance rhythm that kept the site healthy and prevented user-facing issues."}]'::jsonb,
  E'Website optimized for performance\nOperational documentation created\nOngoing maintenance established\nMore details coming soon.',
  E'Documentation is what makes a website maintainable — not the person who runs it.\nPreventive maintenance is cheaper than firefighting.\nMore details coming soon.',
  'published', now()
)
ON CONFLICT (slug) DO NOTHING;
