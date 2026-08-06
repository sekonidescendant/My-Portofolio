'use client';

import { Container } from '@/components/layout/container';
import { EmptyState } from '@/components/ui/empty-state';
import { Briefcase } from 'lucide-react';

export default function AdminCaseStudiesPage() {
  return (
    <Container className="space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Case Studies</h1>
        <p className="text-sm text-muted-foreground">Manage your case studies.</p>
      </div>
      <EmptyState
        icon={Briefcase}
        title="No case studies yet"
        description="Case studies you create will appear here."
      />
    </Container>
  );
}
