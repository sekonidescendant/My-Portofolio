export type ArticleCategory =
  | 'Operations'
  | 'AI'
  | 'Startups'
  | 'Community'
  | 'Blockchain'
  | 'Productivity'
  | 'WordPress';

export const articleCategories: ArticleCategory[] = [
  'Operations',
  'AI',
  'Startups',
  'Community',
  'Blockchain',
  'Productivity',
  'WordPress',
];

export interface ArticleData {
  slug: string;
  title: string;
  category: ArticleCategory;
  readingTime: string;
  summary: string;
  publishedAt: string;
  featured?: boolean;
  content?: string;
  featuredImageUrl?: string | null;
}

export const articles: ArticleData[] = [
  {
    slug: 'building-communities-that-last',
    title: 'Building Communities That Last',
    category: 'Community',
    readingTime: '8 min',
    summary:
      'What I learned coordinating events and partnerships for a student blockchain community — and why consistency beats scale.',
    publishedAt: '2024-09-15',
    featured: true,
  },
  {
    slug: 'launchmynft',
    title: 'LaunchMyNFT',
    category: 'Blockchain',
    readingTime: '5 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-01-10',
  },
  {
    slug: 'cineflicks',
    title: 'Cineflicks',
    category: 'Startups',
    readingTime: '6 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-02-20',
  },
  {
    slug: 're-protocol',
    title: 'Re Protocol',
    category: 'Blockchain',
    readingTime: '7 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-03-05',
  },
  {
    slug: 'tensor-one',
    title: 'Tensor One',
    category: 'AI',
    readingTime: '5 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-03-18',
  },
  {
    slug: 'huddle01',
    title: 'Huddle01',
    category: 'Productivity',
    readingTime: '4 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-04-02',
  },
  {
    slug: 'boba-network',
    title: 'Boba Network',
    category: 'Blockchain',
    readingTime: '6 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-04-15',
  },
  {
    slug: 'aeropool',
    title: 'Aeropool',
    category: 'Startups',
    readingTime: '5 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-05-01',
  },
  {
    slug: 'vara-network',
    title: 'Vara Network',
    category: 'Blockchain',
    readingTime: '7 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-05-12',
  },
  {
    slug: 'preshent',
    title: 'Preshent',
    category: 'Productivity',
    readingTime: '4 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-06-01',
  },
  {
    slug: 'celestia',
    title: 'Celestia',
    category: 'Blockchain',
    readingTime: '8 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-06-20',
  },
  {
    slug: 'push-chain',
    title: 'Push Chain',
    category: 'Operations',
    readingTime: '5 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-07-05',
  },
  {
    slug: 'dovecoin',
    title: 'Dovecoin',
    category: 'AI',
    readingTime: '6 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-07-18',
  },
  {
    slug: 'gaia',
    title: 'Gaia',
    category: 'Community',
    readingTime: '5 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-08-01',
  },
  {
    slug: 'novastro',
    title: 'Novastro',
    category: 'AI',
    readingTime: '6 min',
    summary: 'Content coming soon.',
    publishedAt: '2025-08-15',
  },
];

export function getArticle(slug: string): ArticleData | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getRelatedArticles(
  slug: string,
  category: ArticleCategory,
  limit = 3,
): ArticleData[] {
  return articles
    .filter((a) => a.slug !== slug && a.category === category)
    .slice(0, limit);
}

export interface TimelineEntry {
  year: string;
  title: string;
}

export const writingTimeline: TimelineEntry[] = [
  { year: '2024', title: 'Community Education' },
  { year: '2025', title: 'Web3 Research' },
  { year: '2025', title: 'Startup Content' },
  { year: '2026', title: 'Operations & AI' },
];

export interface VideoEntry {
  title: string;
  category: 'Educational Videos' | 'Community Events' | 'Product Demos' | 'Founder Stories';
}

export const videoEntries: VideoEntry[] = [
  { title: 'Educational Videos', category: 'Educational Videos' },
  { title: 'Community Events', category: 'Community Events' },
  { title: 'Product Demos', category: 'Product Demos' },
  { title: 'Founder Stories', category: 'Founder Stories' },
];
