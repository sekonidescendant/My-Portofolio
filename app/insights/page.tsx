import type { Metadata } from 'next';
import { KnowledgeHubClient } from '@/components/insights/knowledge-hub-client';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Knowledge Hub',
  description:
    'I write about systems, startup operations, digital products, community building and emerging technologies. Most articles begin as X threads and are expanded into deeper, more structured resources.',
  path: '/insights',
});

export default function KnowledgeHubPage() {
  return <KnowledgeHubClient />;
}
