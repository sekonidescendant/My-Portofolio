'use client';

import { Container } from '@/components/layout/container';
import { EmptyState } from '@/components/ui/empty-state';
import { FileBadge } from 'lucide-react';

export default function AdminResumePage() {
  return (
    <Container className="space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Resume Files</h1>
        <p className="text-sm text-muted-foreground">Manage downloadable resume documents.</p>
      </div>
      <EmptyState
        icon={FileBadge}
        title="No resume files yet"
        description="Upload ATS, one-page and portfolio PDF resumes here."
      />
    </Container>
  );
}
