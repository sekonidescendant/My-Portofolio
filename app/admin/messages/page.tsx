'use client';

import { Container } from '@/components/layout/container';
import { EmptyState } from '@/components/ui/empty-state';
import { Mail } from 'lucide-react';

export default function AdminMessagesPage() {
  return (
    <Container className="space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contact Messages</h1>
        <p className="text-sm text-muted-foreground">Messages submitted through your contact form.</p>
      </div>
      <EmptyState
        icon={Mail}
        title="No messages yet"
        description="Contact form submissions will appear here."
      />
    </Container>
  );
}
