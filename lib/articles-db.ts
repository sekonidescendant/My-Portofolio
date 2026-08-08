import type { Article as DbArticle } from '@/lib/types/database';
import type { ArticleData, ArticleCategory } from '@/lib/articles';

// Maps a database article (from articleService) into the shape the public
// insights pages/components already render. Keeps the existing UI components
// unchanged — this is the only place that knows about both shapes.
export function toArticleData(article: DbArticle): ArticleData {
  return {
    slug: article.slug,
    title: article.title,
    category: (article.category?.name ?? 'Operations') as ArticleCategory,
    readingTime: article.reading_time || '5 min',
    summary: article.excerpt || '',
    publishedAt: article.published_at || article.created_at,
    content: article.content || '',
    featuredImageUrl: article.featured_image_url,
  };
}
