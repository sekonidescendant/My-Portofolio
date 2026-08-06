'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/layout/section-heading';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { fadeUp, staggerContainer } from '@/lib/animations';

const categories = [
  'Operations',
  'AI',
  'Startups',
  'Community',
  'Blockchain',
];

export function FeaturedWriting() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Writing"
            title="Latest Insights"
            description="Notes on operations, systems thinking, and building for distributed teams."
          />
          <Button asChild variant="ghost" className="self-start sm:self-end">
            <Link href="/insights">
              Read more
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Tag key={cat} className="px-3 py-1 text-xs">
              {cat}
            </Tag>
          ))}
        </div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border border-dashed border-border bg-secondary/20 p-6 transition-colors hover:border-primary/30 hover:bg-secondary/30"
            >
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {categories[i]}
              </span>
              <div className="space-y-2">
                <div className="h-4 w-3/4 rounded bg-border/60" />
                <div className="h-3 w-full rounded bg-border/40" />
                <div className="h-3 w-2/3 rounded bg-border/40" />
              </div>
              <span className="mt-auto text-xs text-muted-foreground">
                Article coming soon
              </span>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
