'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tag } from '@/components/ui/tag';
import { fadeUp } from '@/lib/animations';

interface FeatureCardProps {
  href?: string;
  title: string;
  description?: string;
  category?: string;
  tags?: string[];
  meta?: string;
  className?: string;
}

export function FeatureCard({
  href,
  title,
  description,
  category,
  tags,
  meta,
  className,
}: FeatureCardProps) {
  const content = (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        'group relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        {category && (
          <span className="text-xs font-medium uppercase tracking-widest text-primary">
            {category}
          </span>
        )}
        {href && (
          <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
        )}
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground text-pretty">{description}</p>
      )}
      {tags && tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
          {tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
      {meta && (
        <p className="text-xs text-muted-foreground">{meta}</p>
      )}
    </motion.div>
  );

  if (!href) return content;
  return (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  );
}
