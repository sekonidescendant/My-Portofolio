export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    id: 'verrsa',
    company: 'Verrsa',
    role: 'Chief Operating Officer',
    period: '2025 – Present',
    highlights: [
      'Created Launch Strategy',
      'Authored Social Media Manager Guide',
      'Helped increase iOS downloads from 30 to 190 in one week',
      'Coordinated onboarding of 20 writers',
    ],
  },
  {
    id: 'blockchain-fuoye',
    company: 'Blockchain FUOYE',
    role: 'Project Coordinator',
    period: '2024 – Present',
    highlights: [
      'Organized 6 events',
      'Reached 2,000+ attendees',
      'Grew community from 50 to 200+ members',
      'Coordinated partnerships',
    ],
  },
  {
    id: 'workloob',
    company: 'Workloob Global',
    role: 'Content Lead',
    period: '',
    highlights: ['Educational content', 'Threads', 'Videos', 'Onboarding'],
  },
  {
    id: 'earn-remote',
    company: 'Earn Remote Africa',
    role: 'WordPress Operations',
    period: '',
    highlights: ['Website optimization', 'Documentation', 'Maintenance'],
  },
];

export interface SkillCategory {
  name: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  { name: 'Operations', skills: ['Project Coordination', 'Documentation', 'Community', 'Content', 'WordPress', 'AI Tools', 'Design'] },
];

export const skills = [
  'Project Coordination',
  'Documentation',
  'Community',
  'Content',
  'WordPress',
  'AI Tools',
  'Design',
];

export interface ToolEntry {
  name: string;
  icon: string;
}

export const tools: ToolEntry[] = [
  { name: 'Slack', icon: 'MessageSquare' },
  { name: 'Google Workspace', icon: 'Mail' },
  { name: 'Microsoft Office', icon: 'FileText' },
  { name: 'WordPress', icon: 'Globe' },
  { name: 'Elementor', icon: 'Layout' },
  { name: 'Canva', icon: 'Palette' },
  { name: 'Photoshop', icon: 'Image' },
  { name: 'ChatGPT', icon: 'Bot' },
  { name: 'Claude', icon: 'Sparkles' },
  { name: 'Gemini', icon: 'Star' },
];

export interface Certification {
  title: string;
  issuer: string;
  date: string;
}

export const certifications: Certification[] = [];

export interface EducationEntry {
  institution: string;
  degree: string;
  status: string;
  graduation: string;
}

export const education: EducationEntry[] = [
  {
    institution: 'Federal University Oye-Ekiti',
    degree: 'B.Sc. Mass Communication',
    status: 'In View',
    graduation: 'Expected Graduation: 2027',
  },
];

export interface Achievement {
  value: string;
  label: string;
}

export const achievements: Achievement[] = [
  { value: '30 → 190', label: 'iOS Downloads' },
  { value: '20', label: 'Writers Onboarded' },
  { value: '6', label: 'Events Organized' },
  { value: '2,000+', label: 'Students Reached' },
  { value: '50 → 200+', label: 'Community Growth' },
  { value: '700 → 1,700+', label: 'Online Community Growth' },
];

export interface DownloadOption {
  label: string;
  description: string;
  href: string;
}

export const downloads: DownloadOption[] = [
  { label: 'ATS Resume', description: 'Applicant Tracking System friendly format', href: '#' },
  { label: 'Portfolio PDF', description: 'Full portfolio document', href: '#' },
  { label: 'One-page Resume', description: 'Condensed single-page version', href: '#' },
];
