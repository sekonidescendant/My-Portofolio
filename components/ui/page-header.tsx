'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp, staggerContainer } from '@/lib/animations';

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainer(0.08)}
      initial="hidden"
      animate="visible"
      className={cn('flex max-w-2xl flex-col gap-3', className)}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          className="text-xs font-medium uppercase tracking-widest text-primary"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h1
        variants={fadeUp}
        className="text-3xl font-semibold tracking-tighter text-balance md:text-5xl"
      >
        {title}
      </motion.h1>
      {description && (
        <motion.p
          variants={fadeUp}
          className="text-base text-muted-foreground text-pretty md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
