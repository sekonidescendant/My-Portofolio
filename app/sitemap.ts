import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';
import { articles } from '@/lib/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/about', '/case-studies', '/insights', '/resume', '/contact'];
  const lastModified = new Date();

  const staticRoutes = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${siteConfig.url}/insights/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes];
}
