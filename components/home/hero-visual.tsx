'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  Users,
  Workflow,
  TrendingUp,
  Network,
  Layers,
} from 'lucide-react';
import { easing } from '@/lib/animations';

const nodes = [
  { icon: Workflow, label: 'Workflow', className: 'left-[8%] top-[10%]', delay: 0 },
  { icon: FileText, label: 'Documentation', className: 'right-[8%] top-[4%]', delay: 0.4 },
  { icon: Users, label: 'Collaboration', className: 'left-[4%] bottom-[12%]', delay: 0.8 },
  { icon: TrendingUp, label: 'Startup Growth', className: 'right-[6%] bottom-[8%]', delay: 1.2 },
  { icon: Network, label: 'Systems Thinking', className: 'left-[42%] top-[2%]', delay: 1.6 },
  { icon: Layers, label: 'Operations', className: 'left-[40%] bottom-[2%]', delay: 2.0 },
];

const connections = [
  { from: 'left-[8%] top-[10%]', to: 'left-[42%] top-[2%]' },
  { from: 'right-[8%] top-[4%]', to: 'left-[42%] top-[2%]' },
  { from: 'left-[4%] bottom-[12%]', to: 'left-[40%] bottom-[2%]' },
  { from: 'right-[6%] bottom-[8%]', to: 'left-[40%] bottom-[2%]' },
  { from: 'left-[42%] top-[2%]', to: 'left-[40%] bottom-[2%]' },
];

export function HeroVisual() {
  return (
    <div className="relative aspect-square w-full max-w-md mx-auto">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-primary/10 blur-3xl" />

      {/* Rotating ring */}
      <motion.div
        className="absolute inset-[12%] rounded-full border border-dashed border-primary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-[24%] rounded-full border border-primary/10"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />

      {/* Center hub */}
      <motion.div
        className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-primary/30 bg-card shadow-glow"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: easing.out }}
      >
        <span className="text-2xl font-bold tracking-tighter text-primary">PS</span>
      </motion.div>

      {/* Connection lines */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[
          { x1: 16, y1: 18, x2: 48, y2: 10 },
          { x1: 84, y1: 12, x2: 48, y2: 10 },
          { x1: 12, y1: 76, x2: 44, y2: 88 },
          { x1: 88, y1: 80, x2: 44, y2: 88 },
          { x1: 48, y1: 10, x2: 44, y2: 88 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="hsl(var(--primary))"
            strokeWidth={0.3}
            strokeOpacity={0.25}
            strokeDasharray="2 2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 + i * 0.15, ease: easing.out }}
          />
        ))}
      </svg>

      {/* Floating nodes */}
      {nodes.map((node, i) => (
        <motion.div
          key={node.label}
          className={`absolute ${node.className} flex flex-col items-center gap-1.5`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: node.delay },
            scale: { duration: 0.5, delay: node.delay, ease: easing.out },
            y: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: node.delay,
            },
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card/90 shadow-soft backdrop-blur-sm">
            <node.icon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-[0.65rem] font-medium text-muted-foreground">
            {node.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
