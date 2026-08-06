'use client';

import { motion } from 'framer-motion';
import { Tag } from '@/components/ui/tag';
import { fadeUp, staggerContainer } from '@/lib/animations';
import type { TimelineEntry } from '@/types';

export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <motion.ol
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative space-y-8 border-l border-border pl-6"
    >
      {entries.map((entry) => (
        <motion.li key={entry.id} variants={fadeUp} className="relative">
          <span className="absolute -left-[1.65rem] top-1 flex h-3 w-3 items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/15" />
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {entry.period}
            </span>
            <h3 className="text-base font-semibold tracking-tight">
              {entry.title}
            </h3>
            <p className="text-sm text-muted-foreground">{entry.organization}</p>
            {entry.summary && (
              <p className="mt-1 text-sm text-muted-foreground text-pretty">
                {entry.summary}
              </p>
            )}
            {entry.tags && entry.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {entry.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
            )}
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
