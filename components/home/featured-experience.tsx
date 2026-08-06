'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/layout/section-heading';
import { Tag } from '@/components/ui/tag';
import { fadeUp, staggerContainer } from '@/lib/animations';

interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  highlights: string[];
}

const experiences: ExperienceEntry[] = [
  {
    id: 'verrsa',
    organization: 'Verrsa',
    role: 'Chief Operating Officer',
    highlights: [
      'Launch Strategy',
      'Social Media Manager Guide',
      '20 Writers',
      '30 → 190 Downloads',
    ],
  },
  {
    id: 'blockchain-fuoye',
    organization: 'Blockchain FUOYE',
    role: 'Project Coordinator',
    highlights: [
      '6 Events',
      '2,000+ Attendees',
      'Partnerships',
      'Community Growth',
    ],
  },
  {
    id: 'workloob',
    organization: 'Workloob Global',
    role: 'Content Lead',
    highlights: [
      'Educational Content',
      'Threads',
      'Videos',
      'Onboarding Content',
    ],
  },
  {
    id: 'earn-remote',
    organization: 'Earn Remote Africa',
    role: 'WordPress Operations',
    highlights: [
      'Website Optimization',
      'Documentation',
      'Maintenance',
    ],
  },
];

export function FeaturedExperience() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Experience"
          title="Featured experience"
          description="A snapshot of roles across startups, communities and digital products. Detailed case studies will follow."
        />
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative space-y-4"
        >
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.id}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40 md:p-7"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-secondary/60 text-xs font-bold text-primary">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {exp.organization}
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {exp.role}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 md:justify-end md:max-w-[60%]">
                  {exp.highlights.map((h) => (
                    <Tag key={h}>{h}</Tag>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
