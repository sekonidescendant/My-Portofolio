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
