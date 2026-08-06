'use client';

import { Container } from '@/components/layout/container';
import { EmptyState } from '@/components/ui/empty-state';
import { Image as ImageIcon } from 'lucide-react';

export default function AdminMediaPage() {
  return (
    <Container className="space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
        <p className="text-sm text-muted-foreground">Upload and manage images, videos and documents.</p>
      </div>
      <EmptyState
        icon={ImageIcon}
        title="No media yet"
        description="Uploaded images, videos and files will appear here."
      />
    </Container>
  );
}
