'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Download,
  Printer,
  Copy,
  Check,
  ChevronDown,
  Mail,
  Linkedin,
  Globe,
  ArrowUpRight,
  MessageSquare,
  FileText,
  Layout,
  Palette,
  Image as ImageIcon,
  Bot,
  Sparkles,
  Star,
  GraduationCap,
  Award,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { SectionHeading } from '@/components/layout/section-heading';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';
import { fadeUp, staggerContainer } from '@/lib/animations';
import {
  experience,
  skills,
  tools,
  certifications,
  education,
  achievements,
  downloads,
} from '@/lib/resume-data';

const toolIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Mail,
  FileText,
  Globe,
  Layout,
  Palette,
  Image: ImageIcon,
  Bot,
  Sparkles,
  Star,
};

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };
  return { copied, copy };
}

function ActionBar() {
  const { copied, copy } = useCopy();
  const actions = [
    {
      key: 'download',
      label: 'Download Resume',
      icon: Download,
      onClick: () => window.print(),
    },
    {
      key: 'print',
      label: 'Print Resume',
      icon: Printer,
      onClick: () => window.print(),
    },
    {
      key: 'email',
      label: 'Copy Email',
      icon: copied === 'email' ? Check : Copy,
      onClick: () => copy('email', siteConfig.author.email),
    },
    {
      key: 'linkedin',
      label: 'Copy LinkedIn',
      icon: copied === 'linkedin' ? Check : Copy,
      onClick: () => copy('linkedin', 'https://www.linkedin.com/in/pelumisekoni'),
    },
    {
      key: 'portfolio',
      label: 'Copy Portfolio Link',
      icon: copied === 'portfolio' ? Check : Copy,
      onClick: () => copy('portfolio', siteConfig.url),
    },
  ];

  return (
    <motion.div
      variants={staggerContainer(0.05)}
      initial="hidden"
      animate="visible"
      className="sticky top-16 z-40 -mx-6 border-b border-border/60 bg-background/80 px-6 py-3 backdrop-blur-xl md:mx-0 md:rounded-lg md:border md:px-4"
    >
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((action) => (
          <motion.button
            key={action.key}
            variants={fadeUp}
            onClick={action.onClick}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <action.icon className="h-3.5 w-3.5" />
            {action.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ExpandableTimelineCard({
  entry,
  index,
}: {
  entry: (typeof experience)[0];
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      variants={fadeUp}
      className="relative pl-8"
    >
      <span className="absolute -left-[33px] top-6 flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary bg-background" />
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-colors hover:border-primary/30">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between gap-4 p-5 text-left"
          aria-expanded={expanded}
        >
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold tracking-tight">
                {entry.company}
              </h3>
              {entry.period && (
                <span className="text-xs font-medium text-primary">
                  {entry.period}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{entry.role}</p>
          </div>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </button>
        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          <div className="border-t border-border px-5 py-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Highlights
            </p>
            <ul className="space-y-2">
              {entry.highlights.map((h, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-muted-foreground text-pretty"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ResumeExperience() {
  return (
    <PageWrapper>
      <Container className="space-y-20">
        {/* Hero */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.span
            variants={fadeUp}
            className="text-xs font-medium uppercase tracking-widest text-primary"
          >
            Resume
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="max-w-3xl text-3xl font-semibold tracking-tighter text-balance md:text-5xl"
          >
            A snapshot of my experience, projects and professional growth.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-base text-muted-foreground text-pretty md:text-lg"
          >
            Digital Operations &amp; Project Coordinator with experience in startup operations, documentation, project execution, community growth and content strategy.
          </motion.p>
        </motion.div>

        <ActionBar />

        {/* Professional Summary */}
        <motion.section
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="space-y-6"
        >
          <SectionHeading
            eyebrow="Overview"
            title="Professional Summary"
          />
          <motion.div
            variants={fadeUp}
            className="rounded-xl border border-border bg-card p-6 shadow-soft md:p-8"
          >
            <p className="text-base text-muted-foreground text-pretty md:text-lg">
              Digital Operations &amp; Project Coordinator with hands-on experience across startup operations, documentation, project execution, community growth and content strategy. I build repeatable systems that help small teams ship — from launch strategy and content operations to WordPress maintenance and community coordination.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                'Digital Operations',
                'Project Coordination',
                'Startup Operations',
                'Documentation',
                'Community Growth',
                'WordPress',
                'Content Operations',
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Career Timeline */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Career"
            title="Experience"
            description="Roles, responsibilities, and contributions over time."
          />
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative space-y-6 border-l border-border pl-8"
          >
            {experience.map((entry, i) => (
              <ExpandableTimelineCard key={entry.id} entry={entry} index={i} />
            ))}
          </motion.div>
        </section>

        {/* Skills */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Capabilities"
            title="Skills"
            description="Core areas of expertise across operations, content and community."
          />
          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-wrap gap-2.5"
          >
            {skills.map((skill) => (
              <motion.span
                key={skill}
                variants={fadeUp}
                whileHover={{ y: -2, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-soft transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                {skill}
              </motion.span>
            ))}
          </motion.div>
        </section>

        {/* Tools */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Stack"
            title="Tools"
            description="Software and platforms I use day-to-day."
          />
          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          >
            {tools.map((tool) => {
              const Icon = toolIcons[tool.icon] ?? Sparkles;
              return (
                <motion.div
                  key={tool.name}
                  variants={fadeUp}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center shadow-soft transition-colors hover:border-primary/40"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-sm font-medium tracking-tight">
                    {tool.name}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* Certifications */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Credentials"
            title="Certifications"
            description="Professional certifications and qualifications."
          />
          {certifications.length > 0 ? (
            <motion.div
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {certifications.map((cert) => (
                <motion.div
                  key={cert.title}
                  variants={fadeUp}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 shadow-soft"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary">
                    <Award className="h-5 w-5" />
                  </span>
                  <div className="space-y-0.5">
                    <h3 className="text-base font-semibold tracking-tight">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    <p className="text-xs text-muted-foreground">{cert.date}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-secondary/20 px-6 py-12 text-center"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-muted-foreground">
                <Award className="h-5 w-5" />
              </span>
              <h3 className="text-base font-semibold tracking-tight">
                Certifications Coming Soon
              </h3>
              <p className="max-w-md text-sm text-muted-foreground text-pretty">
                Professional certifications will be added here as they are earned.
              </p>
            </motion.div>
          )}
        </section>

        {/* Education */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Academic"
            title="Education"
            description="Academic background and qualifications."
          />
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative space-y-0 border-l border-border pl-8"
          >
            {education.map((edu, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="relative pb-0"
              >
                <span className="absolute -left-[37px] top-6 flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary bg-background" />
                <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-5 shadow-soft">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold tracking-tight">
                      {edu.institution}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {edu.degree} ({edu.status})
                    </p>
                    <p className="text-xs font-medium text-primary">
                      {edu.graduation}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Key Achievements */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Impact"
            title="Key Achievements"
            description="Measurable outcomes across roles and projects."
          />
          <motion.div
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3"
          >
            {achievements.map((a) => (
              <motion.div
                key={a.label}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-xl border border-border bg-card p-6 text-center shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                  {a.value}
                </p>
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {a.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Download Section */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Resources"
            title="Download"
            description="Resume and portfolio documents for easy sharing."
          />
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-4 sm:grid-cols-3"
          >
            {downloads.map((dl) => (
              <motion.div
                key={dl.label}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <Download className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold tracking-tight">
                  {dl.label}
                </h3>
                <p className="text-sm text-muted-foreground">{dl.description}</p>
                <Button variant="outline" size="sm" className="mt-auto" asChild>
                  <Link href={dl.href}>
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </section>

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
              Interested in working together?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base text-muted-foreground text-pretty md:text-lg"
            >
              I&apos;m always open to discussing startup operations, project coordination, community growth and remote opportunities.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg">
                <a href={`mailto:${siteConfig.author.email}`}>
                  <Mail className="mr-1.5 h-4 w-4" />
                  Email Me
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/case-studies">
                  View Case Studies
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
