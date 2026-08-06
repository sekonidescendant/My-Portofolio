import { Container } from '@/components/layout/container';
import { SectionHeading } from '@/components/layout/section-heading';
import { AnimatedStatGrid } from '@/components/ui/animated-stat-card';

const stats = [
  { value: '6+', label: 'Events Organized', hint: 'Coordinated end-to-end' },
  { value: '2,000+', label: 'Students Reached', hint: 'Across educational communities' },
  { value: '20', label: 'Writers Onboarded', hint: 'Content operations' },
  { value: '200+', label: 'Blockchain FUOYE Members', hint: 'Community growth' },
  { value: '30 → 190', label: 'Verrsa iOS Downloads', hint: 'In one week' },
  { value: '700 → 1,700+', label: 'Community Growth', hint: 'Sustained trajectory' },
];

export function Statistics() {
  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="By the numbers"
          title="Outcomes, not just output"
          description="Verified metrics from operations, community, and content work across startups and student communities."
        />
        <AnimatedStatGrid stats={stats} />
      </Container>
    </section>
  );
}
