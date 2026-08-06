'use client';

import { motion } from 'framer-motion';
import {
  Workflow,
  ClipboardList,
  PenLine,
  Users,
  Globe,
  BookOpen,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/layout/section-heading';
import { fadeUp, staggerContainer } from '@/lib/animations';

const services = [
  {
    icon: Workflow,
    title: 'Digital Operations',
    description: 'Building and optimizing the operational backbone that keeps distributed teams shipping with clarity.',
  },
  {
    icon: ClipboardList,
    title: 'Project Coordination',
    description: 'Coordinating timelines, stakeholders and deliverables so launches happen on time and with full visibility.',
  },
  {
    icon: PenLine,
    title: 'Content Operations',
    description: 'Designing content systems, onboarding writers and scaling educational content across channels.',
  },
  {
    icon: Users,
    title: 'Community Growth',
    description: 'Growing and nurturing communities through events, partnerships and consistent engagement.',
  },
  {
    icon: Globe,
    title: 'WordPress Management',
    description: 'Maintaining, optimizing and documenting WordPress sites for performance and reliability.',
  },
  {
    icon: BookOpen,
    title: 'Documentation & SOPs',
    description: 'Creating standard operating procedures and knowledge bases that make teams self-sufficient.',
  },
];

export function WhatIDo() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Capabilities"
          title="What I do"
          description="The disciplines I bring together to help startups and communities operate with momentum."
        />
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                <service.icon className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold tracking-tight">
                {service.title}
              </h3>
              <p className="text-sm text-muted-foreground text-pretty">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
