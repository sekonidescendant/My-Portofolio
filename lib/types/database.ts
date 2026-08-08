export type ContentStatus = 'draft' | 'published' | 'archived';

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
  bio: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  file_name: string;
  url: string;
  bucket: string;
  file_type: string;
  size_bytes: number;
  alt_text: string;
  caption: string;
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string | null;
  featured_image_id: string | null;
  category_id: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: ContentStatus;
  reading_time: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  tags?: Tag[];
}

export interface CaseStudyProcessStep {
  title: string;
  description: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  role: string;
  category: string;
  summary: string;
  client: string;
  live_url: string;
  github_url: string;
  featured: boolean;
  highlights: string[];
  overview: string;
  challenge: string;
  objectives: string;
  responsibilities: string;
  tools: string;
  process: CaseStudyProcessStep[];
  results: string;
  lessons: string;
  gallery: string[];
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResumeFile {
  id: string;
  label: string;
  description: string;
  url: string;
  file_type: string;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  summary: string;
  category: string;
  preview_url: string | null;
  file_url: string | null;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string | null;
  message: string;
  job_opportunity: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  name: string;
  email: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  portfolio_url: string;
  resume_url: string;
  google_analytics_id: string;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithTag extends Article {
  category?: Category | null;
  tags?: Tag[];
}
