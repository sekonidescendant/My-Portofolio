import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/components/case-studies/case-study-layout';
import { createMetadata } from '@/lib/seo';
import { caseStudyService } from '@/lib/services/case-study-service';
import { toCaseStudyData } from '@/lib/case-studies-db';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const dbStudy = await caseStudyService.getBySlug(params.slug);
  if (!dbStudy) {
    return createMetadata({
      title: 'Case Study',
      path: '/case-studies',
    });
  }
  const study = toCaseStudyData(dbStudy);
  return createMetadata({
    title: study.title,
    description: study.summary,
    path: `/case-studies/${study.slug}`,
  });
}

export default async function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const dbStudy = await caseStudyService.getBySlug(params.slug);
  if (!dbStudy) notFound();
  const study = toCaseStudyData(dbStudy);
  return <CaseStudyLayout study={study} />;
}
