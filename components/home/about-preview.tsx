import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/layout/section-heading';
import { Button } from '@/components/ui/button';

export function AboutPreview() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary to-secondary/40 shadow-soft">
            <div className="absolute inset-0 surface-gradient" />
            <div className="absolute inset-0 grid-bg bg-grid-pattern bg-grid-32 opacity-30" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Operations
              </p>
              <p className="text-lg font-semibold tracking-tight text-foreground">
                Systems that scale
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <SectionHeading
              eyebrow="About"
              title="Building systems that help teams move faster."
            />
            <div className="space-y-4 text-base text-muted-foreground text-pretty md:text-lg">
              <p>
                I&apos;m passionate about helping startups and communities become more organized through better documentation, communication and execution.
              </p>
              <p>
                Over the past few years I&apos;ve contributed to startup launches, educational communities, operational planning, website management and content systems.
              </p>
              <p>
                I enjoy turning ideas into repeatable systems that help teams scale.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/about">
                Read My Story
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
