export interface CaseStudyData {
  slug: string;
  title: string;
  role: string;
  category: string;
  result?: string[];
  summary: string;
  overview: string;
  challenge: string;
  objectives: string[];
  responsibilities: string[];
  tools: string[];
  process: { title: string; description: string }[];
  outcomes: string[];
  lessons: string[];
  client?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  gallery?: string[];
}

export const caseStudies: CaseStudyData[] = [
  {
    slug: 'verrsa',
    title: 'Verrsa Product Launch',
    role: 'Chief Operating Officer',
    category: 'Operations',
    result: ['30 → 190 iOS downloads in one week'],
    summary:
      'Leading operations and content systems for a startup launch from zero to measurable traction.',
    overview:
      'As Chief Operating Officer at Verrsa, I was responsible for coordinating the product launch end-to-end — from launch strategy and team onboarding to content systems and social media operations. The goal was to turn an early-stage product into a launch with measurable traction within its first week.',
    challenge:
      'Verrsa needed to go from pre-launch to a live product with an active content engine and a coordinated launch — all with a small, distributed team and no existing operational documentation.',
    objectives: [
      'Ship a coordinated product launch with clear ownership across teams',
      'Build a content operations system capable of scaling beyond launch',
      'Drive measurable iOS downloads within the first week',
    ],
    responsibilities: [
      'Launch strategy and execution coordination',
      'Built the Social Media Manager Guide for the team',
      'Onboarded and coordinated 20 writers',
      'Oversaw content operations and publishing workflows',
    ],
    tools: ['More details coming soon.'],
    process: [
      {
        title: 'Launch Strategy',
        description:
          'Defined the launch plan, ownership areas, and milestones to align the team around a single launch date.',
      },
      {
        title: 'Content Systems',
        description:
          'Created the Social Media Manager Guide and onboarded 20 writers into a repeatable content workflow.',
      },
      {
        title: 'Execution',
        description:
          'Coordinated the launch week, tracked downloads, and adjusted outreach in real time to sustain momentum.',
      },
    ],
    outcomes: [
      '30 → 190 iOS downloads in one week',
      '20 writers onboarded into a repeatable content system',
      'A documented social media playbook the team could reuse',
    ],
    lessons: [
      'A clear launch strategy with named owners removes ambiguity for small teams.',
      'Content systems built before launch compound once the product is live.',
      'More details coming soon.',
    ],
  },
  {
    slug: 'blockchain-fuoye',
    title: 'Blockchain FUOYE',
    role: 'Project Coordinator',
    category: 'Community Operations',
    result: ['50 → 200+ Members', '6 Events', '2000+ Attendees'],
    summary:
      'Coordinating events and partnerships that grew a student blockchain community past 200 members.',
    overview:
      'As Project Coordinator for Blockchain FUOYE, I helped build and grow a student blockchain community at FUOYE — coordinating events, securing partnerships, and creating the structure that let the community scale from its earliest members to over 200.',
    challenge:
      'The community needed to grow from a small founding group into a recognized student community, with consistent events, partnerships, and engagement — all without dedicated full-time staff.',
    objectives: [
      'Grow the community from its founding members past 200',
      'Run consistent, high-attendance events',
      'Establish partnerships that could sustain the community long-term',
    ],
    responsibilities: [
      'Coordinated 6 events end-to-end',
      'Secured and managed external partnerships',
      'Drove community growth and engagement',
    ],
    tools: ['More details coming soon.'],
    process: [
      {
        title: 'Event Coordination',
        description:
          'Planned and ran 6 events, managing logistics, speakers, and promotion to reach 2,000+ attendees in total.',
      },
      {
        title: 'Partnerships',
        description:
          'Identified and secured partnerships that brought resources, speakers, and credibility to the community.',
      },
      {
        title: 'Community Growth',
        description:
          'Built the engagement rhythm that grew the community from 50 to 200+ members.',
      },
    ],
    outcomes: [
      '50 → 200+ members',
      '6 events organized',
      '2,000+ attendees reached',
      'Partnerships established',
    ],
    lessons: [
      'Consistency in events matters more than scale — showing up regularly builds trust.',
      'Partnerships multiply what a small team can do alone.',
      'More details coming soon.',
    ],
  },
  {
    slug: 'workloob',
    title: 'Workloob Global',
    role: 'Content Lead',
    category: 'Content Operations',
    summary:
      'Building educational content and onboarding systems for a global learning platform.',
    overview:
      'As Content Lead at Workloob Global, I was responsible for the educational content engine — producing threads, videos, and onboarding content that helped learners and creators get value from the platform.',
    challenge:
      'Workloob needed a consistent, high-quality content pipeline across multiple formats, plus onboarding content that could help new users and creators ramp up quickly.',
    objectives: [
      'Build a repeatable content pipeline across threads, videos, and onboarding',
      'Produce educational content that served a global learning audience',
      'Create onboarding content that reduced ramp-up time',
    ],
    responsibilities: [
      'Led educational content production',
      'Created threads and video content',
      'Built onboarding content for new users and creators',
    ],
    tools: ['More details coming soon.'],
    process: [
      {
        title: 'Content Strategy',
        description:
          'Defined the content mix across educational threads, videos, and onboarding material to serve the platform\'s global audience.',
      },
      {
        title: 'Production',
        description:
          'Produced and shipped content across formats, maintaining consistency and quality.',
      },
      {
        title: 'Onboarding',
        description:
          'Created onboarding content that helped new users and creators understand and adopt the platform.',
      },
    ],
    outcomes: [
      'Educational content shipped across multiple formats',
      'Onboarding content created for new users',
      'More details coming soon.',
    ],
    lessons: [
      'A clear content mix prevents format sprawl and keeps quality consistent.',
      'Onboarding content is one of the highest-leverage things a content team can build.',
      'More details coming soon.',
    ],
  },
  {
    slug: 'earn-remote',
    title: 'Earn Remote Africa',
    role: 'WordPress Operations',
    category: 'Website Operations',
    summary:
      'Managing, optimizing and documenting WordPress operations for a remote-work platform.',
    overview:
      'As WordPress Operations at Earn Remote Africa, I managed the website end-to-end — handling optimization, documentation, and ongoing maintenance to keep the platform reliable for a remote-work audience.',
    challenge:
      'The website needed consistent maintenance, performance optimization, and operational documentation so the team could manage it without relying on a single person\'s tacit knowledge.',
    objectives: [
      'Keep the WordPress site fast, reliable, and up to date',
      'Create documentation that made the site maintainable by the team',
      'Establish a maintenance rhythm that prevented issues before they reached users',
    ],
    responsibilities: [
      'Website optimization and performance tuning',
      'Created operational documentation',
      'Handled ongoing site maintenance',
    ],
    tools: ['WordPress', 'More details coming soon.'],
    process: [
      {
        title: 'Optimization',
        description:
          'Improved website performance and reliability for the remote-work platform\'s audience.',
      },
      {
        title: 'Documentation',
        description:
          'Created operational documentation so the team could manage the site without relying on one person.',
      },
      {
        title: 'Maintenance',
        description:
          'Established a maintenance rhythm that kept the site healthy and prevented user-facing issues.',
      },
    ],
    outcomes: [
      'Website optimized for performance',
      'Operational documentation created',
      'Ongoing maintenance established',
      'More details coming soon.',
    ],
    lessons: [
      'Documentation is what makes a website maintainable — not the person who runs it.',
      'Preventive maintenance is cheaper than firefighting.',
      'More details coming soon.',
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudyData | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
