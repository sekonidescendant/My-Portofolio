'use client';

import { Container } from '@/components/layout/container';
import { EmptyState } from '@/components/ui/empty-state';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <Container className="space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your site-wide settings and SEO defaults.</p>
      </div>
      <EmptyState
        icon={Settings}
        title="Settings Coming Soon"
        description="The settings form will be available in the dashboard UI build."
      />
    </Container>
  );
}
