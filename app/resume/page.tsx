import type { Metadata } from 'next';
import { ResumeExperience } from '@/components/resume/resume-experience';
import { createMetadata } from '@/lib/seo';
import { resumeFileService } from '@/lib/services/content-services';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createMetadata({
  title: 'Resume',
  description:
    'A snapshot of my experience, projects and professional growth. Digital Operations & Project Coordinator with experience in startup operations, documentation, project execution, community growth and content strategy.',
  path: '/resume',
});

export default async function ResumePage() {
  const resumeFiles = await resumeFileService.getPublished();
  return <ResumeExperience resumeFiles={resumeFiles} />;
}
