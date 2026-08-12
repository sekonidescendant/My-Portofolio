import type { Metadata } from 'next';
import Image from 'next/image';
import { Container } from '@/components/layout/container';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeading } from '@/components/layout/section-heading';
import { StatGrid } from '@/components/ui/stat-card';
import { Timeline } from '@/components/ui/timeline';
import { EmptyState } from '@/components/ui/empty-state';
import { HowIWork } from '@/components/home/how-i-work';
import { createMetadata } from '@/lib/seo';
import type { Stat, TimelineEntry } from '@/types';

export const metadata: Metadata = createMetadata({
  title: 'About',
  description: 'The background, approach and principles behind Pelumi Sekoni\'s operations work with startups and communities.',
  path: '/about',
});

const principles: Stat[] = [
  { label: 'Principle', value: '01', hint: 'Systems over heroics' },
  { label: 'Principle', value: '02', hint: 'Clarity over noise' },
  { label: 'Principle', value: '03', hint: 'Outcomes over output' },
  { label: 'Principle', value: '04', hint: 'Trust over speed' },
];

const journey: TimelineEntry[] = [
  {
    id: 'verrsa',
    period: 'Chief Operating Officer',
    title: 'Verrsa',
    organization: 'Startup Operations',
    summary:
      'Led launch strategy, built the social media manager guide, onboarded 20 writers and drove iOS downloads from 30 to 190 in one week.',
    tags: ['Launch Strategy', 'Content Operations', 'Team Onboarding'],
  },
  {
    id: 'blockchain-fuoye',
    period: 'Project Coordinator',
    title: 'Blockchain FUOYE',
    organization: 'Student Community',
    summary:
      'Coordinated 6 events reaching 2,000+ students, secured partnerships and grew the community past 200 members.',
    tags: ['Event Planning', 'Partnerships', 'Community Growth'],
  },
  {
    id: 'workloob',
    period: 'Content Lead',
    title: 'Workloob Global',
    organization: 'Educational Platform',
    summary:
      'Produced educational content, threads, videos and onboarding material for a global learning audience.',
    tags: ['Content Strategy', 'Onboarding', 'Educational Content'],
  },
  {
    id: 'earn-remote',
    period: 'WordPress Operations',
    title: 'Earn Remote Africa',
    organization: 'Remote-Work Platform',
    summary:
      'Managed website optimization, created operational documentation and handled ongoing maintenance.',
    tags: ['WordPress', 'Documentation', 'Maintenance'],
  },
];

export default function AboutPage() {
  return (
    <PageWrapper>
      <Container className="space-y-24">
        <PageHeader
          eyebrow="About"
          title="The person behind the operations"
          description="A closer look at the background, approach and principles that shape every project I take on."
        />

        <section className="grid gap-10 md:grid-cols-3 md:items-start">
          <div className="relative aspect-[4/5] max-w-xs overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-secondary to-secondary/40 shadow-soft">
            <div className="absolute inset-0">
              <Image
                src="/images/profile.jpg"
                alt="Pelumi Sekoni"
                fill
                className="object-cover object-center brightness-75 contrast-90"
                style={{ transform: 'scale(1.06)' }}
              />
            </div>
            <div className="absolute inset-0 surface-gradient" />
            <div className="absolute inset-0 grid-bg bg-grid-pattern bg-grid-32 opacity-30" />
            <div className="absolute left-6 right-6 bottom-6 h-28 bg-gradient-to-t from-black/60 to-transparent rounded-lg pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6 space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Pelumi Sekoni
              </p>
              <p className="text-sm text-muted-foreground">
                Digital Operations &amp; Project Coordinator
              </p>
            </div>
          </div>
          <div className="space-y-6 md:col-span-2">
            <SectionHeading
              eyebrow="Profile"
              title="Building systems that help teams move faster."
            />
            <div className="space-y-4 text-base text-muted-foreground text-pretty md:text-lg">
              <p>
                I&apos;m passionate about helping startups and communities become more organized through better documentation, communication and execution.
              </p>
              <p>
                Over the past few years I&apos;ve contributed to startup launches, educational communities, operational planning, website management and content systems.
              </p>
              <p>
                I enjoy turning ideas into repeatable systems that help teams scale — whether that means shipping a product launch, growing a community past its first hundred members, or building the documentation that lets a team operate without bottlenecks.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Principles"
            title="How I work"
            description="The operating principles that shape every system, workflow, and conversation."
          />
          <StatGrid stats={principles} />
        </section>

        <HowIWork />

        <section className="space-y-8">
          <SectionHeading
            eyebrow="Journey"
            title="Experience timeline"
            description="A chronological view of roles, projects, and milestones across startups and communities."
          />
          {journey.length > 0 ? (
            <Timeline entries={journey} />
          ) : (
            <EmptyState
              title="Experience timeline coming soon"
              description="Roles and milestones will be added here as the portfolio grows."
            />
          )}
        </section>
      </Container>
    </PageWrapper>
  );
}
