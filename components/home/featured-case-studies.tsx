'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/layout/section-heading';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface CaseStudyPreview {
  slug: string;
  title: string;
  category: string;
  summary: string;
}

const previews: CaseStudyPreview[] = [
  {
    slug: 'verrsa',
    title: 'Verrsa',
    category: 'Operations',
    summary: 'Leading operations and content systems for a startup launch from zero to measurable traction.',
  },
  {
    slug: 'blockchain-fuoye',
    title: 'Blockchain FUOYE',
    category: 'Community',
    summary: 'Coordinating events and partnerships that grew a student blockchain community past 200 members.',
  },
  {
    slug: 'workloob',
    title: 'Workloob',
    category: 'Content',
    summary: 'Building educational content and onboarding systems for a global learning platform.',
  },
  {
    slug: 'earn-remote',
    title: 'Earn Remote Africa',
    category: 'WordPress',
    summary: 'Managing, optimizing and documenting WordPress operations for a remote-work platform.',
  },
];

export function FeaturedCaseStudies() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Selected work"
            title="Featured case studies"
            description="Preview of the operations, content and community work behind each engagement."
          />
        </div>
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {previews.map((item) => (
            <motion.div
              key={item.slug}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Link
                href={`/case-studies/${item.slug}`}
                className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="text-xs font-medium uppercase tracking-widest text-primary">
                  {item.category}
                </span>
                <h3 className="text-lg font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  {item.summary}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  View Case Study
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
