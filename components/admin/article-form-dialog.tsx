'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, Loader2 } from 'lucide-react';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MediaPickerDialog } from '@/components/admin/media-picker-dialog';
import { TagPicker } from '@/components/admin/tag-picker';
import { slugify, estimateReadingTime } from '@/lib/utils';
import { markdownToHtml } from '@/lib/markdown';
import { createArticle, updateArticle } from '@/lib/actions/content-actions';
import type { Article, Category, Tag } from '@/lib/types/database';
import type { MediaItem } from '@/types';

type ArticleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article: Article | null;
  categories: Category[];
  tags: Tag[];
  mediaItems: MediaItem[];
  onTagCreated: (tag: Tag) => void;
};

export function ArticleFormDialog({
  open,
  onOpenChange,
  article,
  categories,
  tags,
  mediaItems,
  onTagCreated,
}: ArticleFormDialogProps) {
  const router = useRouter();
  const isEdit = !!article;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEdited, setSlugEdited] = useState(false);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState<string>('none');
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<{ id: string; url: string } | null>(null);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [contentTab, setContentTab] = useState<'write' | 'preview'>('write');
  const [busy, setBusy] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (article) {
      setTitle(article.title);
      setSlug(article.slug);
      setSlugEdited(true);
      setExcerpt(article.excerpt ?? '');
      setContent(article.content ?? '');
      setCategoryId(article.category_id ?? 'none');
      setTagIds((article.tags ?? []).map((t) => t.id));
      setFeaturedImage(
        article.featured_image_url && article.featured_image_id
          ? { id: article.featured_image_id, url: article.featured_image_url }
          : null,
      );
      setSeoTitle(article.seo_title ?? '');
      setSeoDescription(article.seo_description ?? '');
      setStatus(article.status === 'published' ? 'published' : 'draft');
    } else {
      setTitle('');
      setSlug('');
      setSlugEdited(false);
      setExcerpt('');
      setContent('');
      setCategoryId('none');
      setTagIds([]);
      setFeaturedImage(null);
      setSeoTitle('');
      setSeoDescription('');
      setStatus('draft');
    }
    setContentTab('write');
  }, [open, article]);

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
      excerpt: excerpt.trim(),
      content,
      featured_image_url: featuredImage?.url ?? null,
      featured_image_id: featuredImage?.id ?? null,
      category_id: categoryId === 'none' ? null : categoryId,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      status: finalStatus,
      reading_time: estimateReadingTime(content),
      published_at: finalStatus === 'published' ? (article?.published_at ?? new Date().toISOString()) : null,
    };

    const result = isEdit
      ? await updateArticle(article!.id, input, tagIds)
      : await createArticle(input, tagIds);

    setBusy(false);

    if (!result.success) {
      toast.error(result.error ?? 'Something went wrong.');
      return;
    }

    toast.success(isEdit ? 'Article updated' : 'Article created');
    onOpenChange(false);
    router.refresh();
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>{isEdit ? 'Edit article' : 'New article'}</SheetTitle>
          </SheetHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="article-title">Title</Label>
              <Input
                id="article-title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Building Communities That Last"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="article-slug">Slug</Label>
              <Input
                id="article-slug"
                value={slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  setSlug(e.target.value);
                }}
                placeholder="building-communities-that-last"
              />
              <p className="text-xs text-muted-foreground">/insights/{slug || '...'}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="article-excerpt">Excerpt</Label>
              <Textarea
                id="article-excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="One or two sentences for previews and social sharing."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Content</Label>
                <Tabs value={contentTab} onValueChange={(v) => setContentTab(v as 'write' | 'preview')}>
                  <TabsList className="h-8">
                    <TabsTrigger value="write" className="h-6 text-xs">
                      Write
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="h-6 text-xs">
                      Preview
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {contentTab === 'write' ? (
                <>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={14}
                    placeholder="Write in Markdown: # headings, **bold**, *italic*, [links](url), - lists..."
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Supports Markdown. Estimated reading time: {estimateReadingTime(content)}
                  </p>
                </>
              ) : (
                <div
                  className="md-preview rounded-md border border-border bg-secondary/20 p-4"
                  dangerouslySetInnerHTML={{ __html: markdownToHtml(content) || '<p class="text-muted-foreground">Nothing to preview yet.</p>' }}
                />
              )}
            </div>

            <div className="space-y-2">
              <Label>Featured image</Label>
              <MediaPickerDialog items={mediaItems} value={featuredImage} onChange={setFeaturedImage} />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Label>Tags</Label>
              <TagPicker allTags={tags} selectedIds={tagIds} onChange={setTagIds} onTagCreated={onTagCreated} />
            </div>

            <div className="space-y-4 rounded-lg border border-border p-4">
              <p className="text-sm font-medium">SEO</p>
              <div className="space-y-2">
                <Label htmlFor="article-seo-title">SEO title</Label>
                <Input
                  id="article-seo-title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Defaults to article title'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="article-seo-description">SEO description</Label>
                <Textarea
                  id="article-seo-description"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                  placeholder={excerpt || 'Defaults to excerpt'}
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 -mx-6 flex items-center justify-between gap-2 border-t border-border bg-background px-6 py-4">
            <Button type="button" variant="ghost" size="sm" onClick={() => setPreviewOpen(true)}>
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              Preview
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" disabled={busy} onClick={() => handleSave('draft')}>
                {busy && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Save draft
              </Button>
              <Button type="button" disabled={busy} onClick={() => handleSave('published')}>
                {busy && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
                Publish
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title || 'Untitled article'}</DialogTitle>
          </DialogHeader>
          {featuredImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={featuredImage.url} alt={title} className="aspect-video w-full rounded-lg object-cover" />
          )}
          {excerpt && <p className="text-sm text-muted-foreground">{excerpt}</p>}
          <div
            className="md-preview"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
          />
          <p className="text-xs text-muted-foreground">
            This is a content preview only — publishing to the live Knowledge Hub page is part of a later phase.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
