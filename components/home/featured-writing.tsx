'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/layout/section-heading';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { ArticleCard } from '@/components/insights/article-card';
import { staggerContainer } from '@/lib/animations';
import type { ArticleData } from '@/lib/articles';

const categories = [
  'Operations',
  'AI',
  'Startups',
  'Community',
  'Blockchain',
];

export function FeaturedWriting({ articles }: { articles: ArticleData[] }) {
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

        {articles.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No articles published yet"
            description="New writing will show up here as soon as it's published."
          />
        ) : (
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}
