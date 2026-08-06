'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { SectionHeading } from '@/components/layout/section-heading';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { fadeUp, staggerContainer } from '@/lib/animations';
import type { CaseStudyData } from '@/lib/case-studies';

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      variants={staggerContainer(0.08)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="space-y-6"
    >
      <SectionHeading eyebrow={eyebrow} title={title} />
      <motion.div variants={fadeUp} className="space-y-4">
        {children}
      </motion.div>
    </motion.section>
  );
}

function ListBlock({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <motion.li
          key={i}
          variants={fadeUp}
          className="flex items-start gap-3 text-sm text-muted-foreground text-pretty md:text-base"
        >
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
          <span>{item}</span>
        </motion.li>
      ))}
    </ul>
  );
}

function TextBlock({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base text-muted-foreground text-pretty md:text-lg">
      {children}
    </p>
  );
}

export function CaseStudyLayout({ study }: { study: CaseStudyData }) {
  return (
    <PageWrapper>
      <Container className="space-y-20">
        {/* Hero */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              All case studies
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            <Tag>{study.category}</Tag>
            <Tag>{study.role}</Tag>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-3xl font-semibold tracking-tighter text-balance md:text-5xl"
          >
            {study.title}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-base text-muted-foreground text-pretty md:text-lg"
          >
            {study.summary}
          </motion.p>
          {study.result && study.result.length > 0 && (
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {study.result.map((r) => (
                <span
                  key={r}
                  className="inline-flex items-center rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary"
                >
                  {r}
                </span>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Overview */}
        <Section eyebrow="Overview" title="The engagement">
          <TextBlock>{study.overview}</TextBlock>
        </Section>

        {/* The Challenge */}
        <Section eyebrow="Context" title="The Challenge">
          <TextBlock>{study.challenge}</TextBlock>
        </Section>

        {/* Objectives */}
        <Section eyebrow="Goals" title="Objectives">
          <ListBlock items={study.objectives} />
        </Section>

        {/* My Responsibilities */}
        <Section eyebrow="Role" title="My Responsibilities">
          <ListBlock items={study.responsibilities} />
        </Section>

        {/* Tools Used */}
        <Section eyebrow="Stack" title="Tools Used">
          <div className="flex flex-wrap gap-2">
            {study.tools.map((tool) => (
              <Tag key={tool} className="px-3 py-1 text-xs">
                {tool}
              </Tag>
            ))}
          </div>
        </Section>

        {/* Process */}
        <Section eyebrow="Approach" title="Process">
          <div className="grid gap-5 md:grid-cols-3">
            {study.process.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-secondary/60 text-xs font-bold text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Outcomes */}
        <Section eyebrow="Results" title="Outcomes">
          <ListBlock items={study.outcomes} />
        </Section>

        {/* Lessons Learned */}
        <Section eyebrow="Reflection" title="Lessons Learned">
          <ListBlock items={study.lessons} />
        </Section>

        {/* Gallery placeholder */}
        <Section eyebrow="Visuals" title="Gallery">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-border bg-secondary/20 text-sm text-muted-foreground"
              >
                Image coming soon
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Contact CTA */}
        <motion.section
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 shadow-soft md:p-16"
        >
          <div className="pointer-events-none absolute inset-0 surface-gradient" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:items-center md:text-center">
            <motion.h2
              variants={fadeUp}
              className="max-w-2xl text-3xl font-semibold tracking-tighter text-balance md:text-4xl"
            >
              Want to build something like this?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base text-muted-foreground text-pretty md:text-lg"
            >
              I&apos;m available for remote operations, content, and community roles. Let&apos;s talk.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button asChild size="lg">
                <Link href="/contact">
                  Get In Touch
                  <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </Container>
    </PageWrapper>
  );
}
