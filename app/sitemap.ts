import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { articleService } from '@/lib/services/article-service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/about', '/case-studies', '/insights', '/resume', '/contact'];
  const lastModified = new Date();

  const staticRoutes = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const publishedArticles = await articleService.getPublished();

  const articleRoutes = publishedArticles.map((article) => ({
    url: `${siteConfig.url}/insights/${article.slug}`,
    lastModified: new Date(article.published_at || article.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}
