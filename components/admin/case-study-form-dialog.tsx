'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { GalleryPickerDialog } from '@/components/admin/gallery-picker-dialog';
import { ProcessStepsEditor } from '@/components/admin/process-steps-editor';
import { slugify } from '@/lib/utils';
import { createCaseStudy, updateCaseStudy } from '@/lib/actions/content-actions';
import type { CaseStudy, CaseStudyProcessStep } from '@/lib/types/database';
import type { MediaItem } from '@/types';

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(arr: string[] | undefined | null): string {
  return (arr ?? []).join('\n');
}

type CaseStudyFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseStudy: CaseStudy | null;
  mediaItems: MediaItem[];
};

export function CaseStudyFormDialog({
  open,
  onOpenChange,
  caseStudy,
  mediaItems,
}: CaseStudyFormDialogProps) {
  const router = useRouter();
  const isEdit = !!caseStudy;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [client, setClient] = useState('');
  const [role, setRole] = useState('');
  const [category, setCategory] = useState('');
  const [summary, setSummary] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [highlightsText, setHighlightsText] = useState('');
  const [overview, setOverview] = useState('');
  const [challenge, setChallenge] = useState('');
  const [objectivesText, setObjectivesText] = useState('');
  const [responsibilitiesText, setResponsibilitiesText] = useState('');
  const [toolsText, setToolsText] = useState('');
  const [process, setProcess] = useState<CaseStudyProcessStep[]>([]);
  const [resultsText, setResultsText] = useState('');
  const [lessonsText, setLessonsText] = useState('');
  const [gallery, setGallery] = useState<string[]>([]);
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (caseStudy) {
      setTitle(caseStudy.title);
      setSlug(caseStudy.slug);
      setSlugEdited(true);
      setClient(caseStudy.client ?? '');
      setRole(caseStudy.role ?? '');
      setCategory(caseStudy.category ?? '');
      setSummary(caseStudy.summary ?? '');
      setLiveUrl(caseStudy.live_url ?? '');
      setGithubUrl(caseStudy.github_url ?? '');
      setFeatured(!!caseStudy.featured);
      setHighlightsText(arrayToLines(caseStudy.highlights));
      setOverview(caseStudy.overview ?? '');
      setChallenge(caseStudy.challenge ?? '');
      setObjectivesText(caseStudy.objectives ?? '');
      setResponsibilitiesText(caseStudy.responsibilities ?? '');
      setToolsText(caseStudy.tools ?? '');
      setProcess(caseStudy.process ?? []);
      setResultsText(caseStudy.results ?? '');
      setLessonsText(caseStudy.lessons ?? '');
      setGallery(caseStudy.gallery ?? []);
      setStatus(caseStudy.status === 'published' ? 'published' : 'draft');
    } else {
      setTitle('');
      setSlug('');
      setSlugEdited(false);
      setClient('');
      setRole('');
      setCategory('');
      setSummary('');
      setLiveUrl('');
      setGithubUrl('');
      setFeatured(false);
      setHighlightsText('');
      setOverview('');
      setChallenge('');
      setObjectivesText('');
      setResponsibilitiesText('');
      setToolsText('');
      setProcess([]);
      setResultsText('');
      setLessonsText('');
      setGallery([]);
      setStatus('draft');
    }
  }, [open, caseStudy]);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  async function handleSave(nextStatus?: 'draft' | 'published') {
    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug is required.');
      return;
    }

    setBusy(true);
    const finalStatus = nextStatus ?? status;
    const input = {
      title: title.trim(),
      slug: slugify(slug),
      client: client.trim(),
      role: role.trim(),
      category: category.trim(),
      summary: summary.trim(),
      live_url: liveUrl.trim(),
      github_url: githubUrl.trim(),
      featured,
      highlights: linesToArray(highlightsText),
      overview,
      challenge,
      objectives: objectivesText,
      responsibilities: responsibilitiesText,
      tools: toolsText,
      process,
      results: resultsText,
      lessons: lessonsText,
      gallery,
      status: finalStatus,
      published_at: finalStatus === 'published' ? (caseStudy?.published_at ?? new Date().toISOString()) : null,
    };

    const result = isEdit
      ? await updateCaseStudy(caseStudy!.id, input)
      : await createCaseStudy(input);

    setBusy(false);

    if (!result.success) {
      toast.error(result.error ?? 'Something went wrong.');
      return;
    }

    toast.success(isEdit ? 'Case study updated' : 'Case study created');
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Edit case study' : 'New case study'}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 py-4">
          {/* Basics */}
          <div className="space-y-2">
            <Label htmlFor="cs-title">Title</Label>
            <Input
              id="cs-title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Verrsa Product Launch"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cs-slug">Slug</Label>
            <Input
              id="cs-slug"
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(e.target.value);
              }}
            />
            <p className="text-xs text-muted-foreground">/case-studies/{slug || '...'}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cs-client">Client</Label>
              <Input id="cs-client" value={client} onChange={(e) => setClient(e.target.value)} placeholder="e.g. Verrsa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs-role">Your role</Label>
              <Input id="cs-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Chief Operating Officer" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cs-category">Category</Label>
            <Input id="cs-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Operations" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cs-summary">Description / summary</Label>
            <Textarea
              id="cs-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="One or two sentences shown on the case studies list and hero."
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="cs-live-url">Live URL</Label>
              <Input id="cs-live-url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs-github-url">GitHub URL</Label>
              <Input id="cs-github-url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/..." />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <div>
                <p className="text-sm font-medium">Featured</p>
                <p className="text-xs text-muted-foreground">Highlight this on the case studies page</p>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-xs text-muted-foreground">{status === 'published' ? 'Live on site' : 'Draft'}</p>
              </div>
              <Switch
                checked={status === 'published'}
                onCheckedChange={(checked) => setStatus(checked ? 'published' : 'draft')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cs-highlights">Highlight stats</Label>
            <Textarea
              id="cs-highlights"
              value={highlightsText}
              onChange={(e) => setHighlightsText(e.target.value)}
              rows={2}
              placeholder={'One per line, e.g.\n30 → 190 iOS downloads in one week'}
            />
            <p className="text-xs text-muted-foreground">Shown as badges in the hero. One per line.</p>
          </div>

          {/* Narrative content */}
          <div className="space-y-4 rounded-lg border border-border p-4">
            <p className="text-sm font-medium">Story</p>
            <div className="space-y-2">
              <Label htmlFor="cs-overview">Overview</Label>
              <Textarea id="cs-overview" value={overview} onChange={(e) => setOverview(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs-challenge">The challenge</Label>
              <Textarea id="cs-challenge" value={challenge} onChange={(e) => setChallenge(e.target.value)} rows={3} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs-objectives">Objectives</Label>
              <Textarea
                id="cs-objectives"
                value={objectivesText}
                onChange={(e) => setObjectivesText(e.target.value)}
                rows={3}
                placeholder="One per line"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs-responsibilities">Your responsibilities</Label>
              <Textarea
                id="cs-responsibilities"
                value={responsibilitiesText}
                onChange={(e) => setResponsibilitiesText(e.target.value)}
                rows={3}
                placeholder="One per line"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs-tools">Technologies / tools used</Label>
              <Textarea
                id="cs-tools"
                value={toolsText}
                onChange={(e) => setToolsText(e.target.value)}
                rows={2}
                placeholder="One per line"
              />
            </div>
          </div>

          {/* Process */}
          <div className="space-y-2">
            <Label>Process</Label>
            <ProcessStepsEditor steps={process} onChange={setProcess} />
          </div>

          <div className="space-y-4 rounded-lg border border-border p-4">
            <div className="space-y-2">
              <Label htmlFor="cs-results">Outcomes / results</Label>
              <Textarea
                id="cs-results"
                value={resultsText}
                onChange={(e) => setResultsText(e.target.value)}
                rows={3}
                placeholder="One per line"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cs-lessons">Lessons learned</Label>
              <Textarea
                id="cs-lessons"
                value={lessonsText}
                onChange={(e) => setLessonsText(e.target.value)}
                rows={3}
                placeholder="One per line"
              />
            </div>
          </div>

          {/* Gallery */}
          <div className="space-y-2">
            <Label>Gallery</Label>
            <GalleryPickerDialog items={mediaItems} value={gallery} onChange={setGallery} />
          </div>
        </div>

        <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-2 border-t border-border bg-background px-6 py-4">
          <Button type="button" variant="outline" disabled={busy} onClick={() => handleSave('draft')}>
            {busy && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Save draft
          </Button>
          <Button type="button" disabled={busy} onClick={() => handleSave('published')}>
            {busy && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
            Publish
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
