'use client';

import { Container } from '@/components/layout/container';
import { EmptyState } from '@/components/ui/empty-state';
import { FileText } from 'lucide-react';

export default function AdminArticlesPage() {
  return (
    <Container className="space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
        <p className="text-sm text-muted-foreground">Manage your published and draft articles.</p>
      </div>
      <EmptyState
        icon={FileText}
        title="No articles yet"
        description="Articles you create will appear here. Use the CMS to add new content."
      />
    </Container>
  );
}
