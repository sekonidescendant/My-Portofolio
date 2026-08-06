'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedStatCardProps {
  value: string;
  label: string;
  hint?: string;
  className?: string;
}

function parseValue(value: string): { prefix: string; num: number; suffix: string; arrow?: string; num2?: number } {
  // Handle "30 → 190" format
  const arrowMatch = value.match(/^([\d,]+)\s*→\s*([\d,]+)$/);
  if (arrowMatch) {
    return {
      prefix: '',
      num: parseInt(arrowMatch[1].replace(/,/g, ''), 10),
      suffix: '',
      arrow: '→',
      num2: parseInt(arrowMatch[2].replace(/,/g, ''), 10),
    };
  }

  const match = value.match(/^([^0-9]*)([\d,]+)(.*)$/);
  if (!match) return { prefix: '', num: 0, suffix: value };
  return {
    prefix: match[1],
    num: parseInt(match[2].replace(/,/g, ''), 10),
    suffix: match[3],
  };
}

function formatNum(n: number): string {
  return n.toLocaleString();
}

export function AnimatedStatCard({ value, label, hint, className }: AnimatedStatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const parsed = parseValue(value);

  const [display1, setDisplay1] = useState(parsed.arrow ? 0 : 0);
  const [display2, setDisplay2] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const controls1 = animate(0, parsed.num, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay1(Math.round(v)),
    });

    let controls2: ReturnType<typeof animate> | undefined;
    if (parsed.arrow && parsed.num2 !== undefined) {
      controls2 = animate(0, parsed.num2, {
        duration: 1.4,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3,
        onUpdate: (v) => setDisplay2(Math.round(v)),
      });
    }

    return () => {
      controls1.stop();
      controls2?.stop();
    };
  }, [inView, parsed.num, parsed.num2, parsed.arrow]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-soft transition-colors hover:border-primary/40',
        className,
      )}
    >
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <p className="text-2xl font-semibold tracking-tighter text-foreground md:text-3xl">
        {parsed.prefix}
        {parsed.arrow ? (
          <span className="flex items-center gap-2">
            <span>{formatNum(display1)}</span>
            <span className="text-muted-foreground/50">→</span>
            <span>{formatNum(display2)}</span>
          </span>
        ) : (
          <span>{formatNum(display1)}</span>
        )}
        {parsed.suffix}
      </p>
      <p className="mt-1.5 text-sm font-medium text-foreground">{label}</p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}

export function AnimatedStatGrid({
  stats,
}: {
  stats: { value: string; label: string; hint?: string }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
      {stats.map((stat) => (
        <AnimatedStatCard
          key={stat.label}
          value={stat.value}
          label={stat.label}
          hint={stat.hint}
        />
      ))}
    </div>
  );
}
