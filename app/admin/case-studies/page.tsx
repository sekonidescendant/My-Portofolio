import { createClient } from '@/lib/supabase/server';
import { caseStudyService } from '@/lib/services/case-study-service';
import { CaseStudiesManager } from '@/components/admin/case-studies-manager';
import type { MediaItem } from '@/types';

export default async function AdminCaseStudiesPage() {
  const supabase = createClient();

  const [caseStudies, mediaResult] = await Promise.all([
    caseStudyService.getAll(),
    supabase.from('media').select('*').eq('bucket', 'images').order('created_at', { ascending: false }),
  ]);

  return (
    <CaseStudiesManager
      initialCaseStudies={caseStudies}
      mediaItems={(mediaResult.data ?? []) as MediaItem[]}
    />
  );
}
