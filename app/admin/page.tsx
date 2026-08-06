'use client';

import { Container } from '@/components/layout/container';
import { FileText, Briefcase, Image as ImageIcon, FileBadge, Mail, Settings } from 'lucide-react';

export default function AdminDashboardPage() {
  const sections = [
    { label: 'Articles', icon: FileText, href: '/admin/articles' },
    { label: 'Case Studies', icon: Briefcase, href: '/admin/case-studies' },
    { label: 'Media', icon: ImageIcon, href: '/admin/media' },
    { label: 'Resume', icon: FileBadge, href: '/admin/resume' },
    { label: 'Messages', icon: Mail, href: '/admin/messages' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
  ];

  return (
    <Container className="space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage your portfolio content.
        </p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
              <s.icon className="h-5 w-5" />
            </span>
            <p className="text-base font-semibold tracking-tight">{s.label}</p>
            <p className="text-sm text-muted-foreground">Manage {s.label.toLowerCase()}</p>
          </a>
        ))}
      </div>
    </Container>
  );
}
