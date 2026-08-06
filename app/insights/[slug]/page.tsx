import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/insights/article-layout';
import { articles, getArticle, getRelatedArticles } from '@/lib/articles';
import { createMetadata } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticle(params.slug);
  if (!article) {
    return createMetadata({
      title: 'Article',
      path: '/insights',
    });
  }

  const url = `${siteConfig.url}/insights/${article.slug}`;
  const title = `${article.title} · ${siteConfig.author.name}`;

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
      images: [{ url: `${siteConfig.url}/og.png`, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: article.summary,
      images: [`${siteConfig.url}/og.png`],
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

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticle(params.slug);
  if (!article) notFound();
  const related = getRelatedArticles(article.slug, article.category);
  return <ArticleLayout article={article} related={related} />;
}
