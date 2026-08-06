import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { CaseStudyLayout } from '@/components/case-studies/case-study-layout';
import { caseStudies, getCaseStudy } from '@/lib/case-studies';
import { createMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const study = getCaseStudy(params.slug);
  if (!study) {
    return createMetadata({
      title: 'Case Study',
      path: '/case-studies',
    });
  }
  return createMetadata({
    title: study.title,
    description: study.summary,
    path: `/case-studies/${study.slug}`,
  });
}

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const study = getCaseStudy(params.slug);
  if (!study) notFound();
  return <CaseStudyLayout study={study} />;
}
