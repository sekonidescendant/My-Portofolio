import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/insights/article-layout';
import { createMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
import { articleService } from '@/lib/services/article-service';
import { toArticleData } from '@/lib/articles-db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const dbArticle = await articleService.getBySlug(params.slug);
  if (!dbArticle) {
    return createMetadata({
      title: 'Article',
      path: '/insights',
    });
  }
  const article = toArticleData(dbArticle);

  const url = `${siteConfig.url}/insights/${article.slug}`;
  const title = `${article.title} · ${siteConfig.author.name}`;
  const ogImage = article.featuredImageUrl || `${siteConfig.url}/og.png`;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description: article.summary,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description: article.summary,
      siteName: siteConfig.author.name,
      publishedTime: article.publishedAt,
      authors: [siteConfig.author.name],
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: article.summary,
      images: [ogImage],
    },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.summary,
        author: {
          '@type': 'Person',
          name: siteConfig.author.name,
        },
        publisher: {
          '@type': 'Person',
          name: siteConfig.author.name,
        },
        datePublished: article.publishedAt,
        articleSection: article.category,
        url,
      }),
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const dbArticle = await articleService.getBySlug(params.slug);
  if (!dbArticle) notFound();

  const article = toArticleData(dbArticle);

  const allPublished = await articleService.getPublished();
  const related = allPublished
    .filter(
      (a) =>
        a.slug !== article.slug &&
        dbArticle.category_id !== null &&
        a.category_id === dbArticle.category_id,
    )
    .slice(0, 3)
    .map(toArticleData);

  return <ArticleLayout article={article} related={related} />;
}
