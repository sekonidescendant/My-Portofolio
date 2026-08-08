'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { Tag } from '@/components/ui/tag';
import { fadeUp } from '@/lib/animations';
import type { ArticleData } from '@/lib/articles';

export function ArticleCard({ article }: { article: ArticleData }) {
  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-colors hover:border-primary/40"
    >
      <Link href={`/insights/${article.slug}`} className="flex h-full flex-col">
        {/* Cover */}
        <div className="relative aspect-video overflow-hidden border-b border-border bg-secondary/30">
          {article.featuredImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={article.featuredImageUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <>
              <div className="absolute inset-0 surface-gradient" />
              <div className="absolute inset-0 grid-bg bg-grid-pattern bg-grid-32 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Content coming soon
                </span>
              </div>
            </>
          )}
          <div className="absolute left-4 top-4">
            <Tag className="bg-background/80 backdrop-blur-sm">{article.category}</Tag>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readingTime}
            </span>
            <span className="text-muted-foreground/60">·</span>
            <time>
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>

          <h3 className="text-lg font-semibold tracking-tight text-pretty">
            {article.title}
          </h3>

          <p className="text-sm text-muted-foreground text-pretty line-clamp-2">
            {article.summary}
          </p>

          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            Read Article
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
