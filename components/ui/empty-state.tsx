'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeUp } from '@/lib/animations';

export function EmptyState({
  title,
  description,
  icon: Icon,
  className,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-secondary/30 px-6 py-16 text-center',
        className,
      )}
    >
      {Icon && (
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-muted-foreground text-pretty">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </motion.div>
  );
}
