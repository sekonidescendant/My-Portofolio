export type NavItem = {
  title: string;
  href: string;
};

export type SocialLink = {
  title: string;
  href: string;
};

export type Stat = {
  label: string;
  value: string;
  hint?: string;
};

export type TimelineEntry = {
  id: string;
  period: string;
  title: string;
  organization: string;
  summary?: string;
  tags?: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime?: string;
};

export type Article = {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime?: string;
};

export type ResumeSection = {
  id: string;
  heading: string;
  entries: TimelineEntry[];
};

export type MediaBucket = 'images' | 'videos' | 'documents';

export type MediaItem = {
  id: string;
  file_name: string;
  url: string;
  bucket: MediaBucket;
  file_type: string;
  size_bytes: number;
  alt_text: string;
  caption: string;
  folder: string | null;
  created_at: string;
  updated_at: string;
};
