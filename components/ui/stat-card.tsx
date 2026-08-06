'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, staggerContainer } from '@/lib/animations';
import type { Stat } from '@/types';

export function StatCard({ stat, index }: { stat: Stat; index: number }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-primary/40',
      )}
    >
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <p className="text-3xl font-semibold tracking-tighter text-foreground">
        {stat.value}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{stat.label}</p>
      {stat.hint && (
        <p className="mt-0.5 text-xs text-muted-foreground">{stat.hint}</p>
      )}
    </motion.div>
  );
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  return (
    <motion.div
      variants={staggerContainer(0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="grid grid-cols-2 gap-4 md:grid-cols-4"
    >
      {stats.map((stat, i) => (
        <StatCard key={stat.label} stat={stat} index={i} />
      ))}
    </motion.div>
  );
}
