import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { PageHeader } from '@/components/ui/page-header';
import { Tag } from '@/components/ui/tag';
import { createMetadata } from '@/lib/seo';
import { caseStudies } from '@/lib/case-studies';

export const metadata: Metadata = createMetadata({
  title: 'Case Studies',
  description:
    'A collection of projects where I contributed to startup operations, community growth, documentation and digital execution.',
  path: '/case-studies',
});

export default function CaseStudiesPage() {
  return (
    <PageWrapper>
      <Container className="space-y-16">
        <PageHeader
          eyebrow="Selected work"
          title="Case Studies"
          description="A collection of projects where I contributed to startup operations, community growth, documentation and digital execution."
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {caseStudies.map((study) => (
            <Link
              key={study.slug}
              href={`/case-studies/${study.slug}`}
              className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40 md:p-8"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-widest text-primary">
                  {study.category}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold tracking-tight">
                  {study.title}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  {study.role}
                </p>
              </div>
              <p className="text-sm text-muted-foreground text-pretty">
                {study.summary}
              </p>
              {study.result && study.result.length > 0 && (
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {study.result.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
              <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                View Case Study
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </PageWrapper>
  );
}
