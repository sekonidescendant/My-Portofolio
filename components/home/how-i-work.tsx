'use client';

import { motion } from 'framer-motion';
import {
  Network,
  ShieldCheck,
  MessageSquare,
  GraduationCap,
  Users,
  Target,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/layout/section-heading';
import { fadeUp, staggerContainer } from '@/lib/animations';

const principles = [
  {
    icon: Network,
    title: 'Systems Thinking',
    description: 'I enjoy creating repeatable processes that make teams more efficient.',
  },
  {
    icon: ShieldCheck,
    title: 'Ownership',
    description: 'I take responsibility from planning through execution and follow-through.',
  },
  {
    icon: MessageSquare,
    title: 'Clear Communication',
    description: 'I believe documentation and communication are essential for successful remote teams.',
  },
  {
    icon: GraduationCap,
    title: 'Continuous Learning',
    description: 'I actively learn new tools, technologies and workflows to improve my effectiveness.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'I enjoy working across teams and helping people move toward shared goals.',
  },
  {
    icon: Target,
    title: 'Execution',
    description: 'Ideas only matter when they are delivered. I focus on turning plans into measurable outcomes.',
  },
];

export function HowIWork() {
  return (
    <section className="space-y-10">
      <SectionHeading
        eyebrow="Approach"
        title="How I Work"
        description="The working style and values that shape how I operate with startups and communities."
      />
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {principles.map((item) => (
          <motion.div
            key={item.title}
            variants={fadeUp}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
              <item.icon className="h-5 w-5" />
            </span>
            <h3 className="text-base font-semibold tracking-tight">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground text-pretty">
              {item.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
