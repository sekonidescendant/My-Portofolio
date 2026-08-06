import type { Metadata } from 'next';
import { ResumeExperience } from '@/components/resume/resume-experience';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Resume',
  description:
    'A snapshot of my experience, projects and professional growth. Digital Operations & Project Coordinator with experience in startup operations, documentation, project execution, community growth and content strategy.',
  path: '/resume',
});

export default function ResumePage() {
  return <ResumeExperience />;
}
