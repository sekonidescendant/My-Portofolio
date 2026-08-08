import type { CaseStudy as DbCaseStudy } from '@/lib/types/database';
import type { CaseStudyData } from '@/lib/case-studies';

function linesToArray(text: string | null | undefined): string[] {
  return (text ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

// Maps a database case study into the shape the public case-studies pages
// already render, the same approach used for articles-db.ts.
export function toCaseStudyData(cs: DbCaseStudy): CaseStudyData {
  return {
    slug: cs.slug,
    title: cs.title,
    role: cs.role || '',
    category: cs.category || '',
    result: cs.highlights && cs.highlights.length > 0 ? cs.highlights : undefined,
    summary: cs.summary || '',
    overview: cs.overview || '',
    challenge: cs.challenge || '',
    objectives: linesToArray(cs.objectives),
    responsibilities: linesToArray(cs.responsibilities),
    tools: linesToArray(cs.tools),
    process: cs.process ?? [],
    outcomes: linesToArray(cs.results),
    lessons: linesToArray(cs.lessons),
    client: cs.client || undefined,
    liveUrl: cs.live_url || undefined,
    githubUrl: cs.github_url || undefined,
    featured: cs.featured,
    gallery: cs.gallery && cs.gallery.length > 0 ? cs.gallery : undefined,
  };
}
