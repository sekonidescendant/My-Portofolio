import type { Metadata } from 'next';
import { KnowledgeHubClient } from '@/components/insights/knowledge-hub-client';
import { createMetadata } from '@/lib/seo';
import { articleService } from '@/lib/services/article-service';
import { toArticleData } from '@/lib/articles-db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createMetadata({
  title: 'Knowledge Hub',
  description:
    'I write about systems, startup operations, digital products, community building and emerging technologies. Most articles begin as X threads and are expanded into deeper, more structured resources.',
  path: '/insights',
});

export default async function KnowledgeHubPage() {
  const dbArticles = await articleService.getPublished();
  const articles = dbArticles.map(toArticleData);

  return <KnowledgeHubClient articles={articles} />;
}
