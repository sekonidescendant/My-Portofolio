'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Eye, ImagePlus, Loader2, Save, Send, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { CategorySelect } from '@/components/admin/category-select';
import { TagMultiSelect } from '@/components/admin/tag-multiselect';
import { MediaPickerDialog, ClearableFeaturedImage } from '@/components/admin/media-picker-dialog';
import { ArticlePreviewDialog } from '@/components/admin/article-preview-dialog';
import { slugify } from '@/lib/slugify';
import { createArticle, updateArticle, deleteArticle, setArticleTags } from '@/lib/actions/content-actions';
import type { Article, Category, Tag, ContentStatus } from '@/lib/types/database';

export function ArticleForm({
  mode,
  article,
  categories,
  tags,
}: {
  mode: 'create' | 'edit';
  article?: Article;
  categories: Category[];
  tags: Tag[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState(article?.title ?? '');
  const [slug, setSlug] = useState(article?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? '');
  const [content, setContent] = useState(article?.content ?? '');
  const [featuredImageUrl, setFeaturedImageUrl] = useState(article?.featured_image_url ?? '');
  const [featuredImageId, setFeaturedImageId] = useState(article?.featured_image_id ?? '');
  const [categoryId, setCategoryId] = useState<string | null>(article?.category_id ?? null);
  const [tagIds, setTagIds] = useState<string[]>((article?.tags ?? []).map((t) => t.id));
  const [seoTitle, setSeoTitle] = useState(article?.seo_title ?? '');
  const [seoDescription, setSeoDescription] = useState(article?.seo_description ?? '');
  const [status, setStatus] = useState<ContentStatus>(article?.status ?? 'draft');

  const [localCategories, setLocalCategories] = useState(categories);
  const [localTags, setLocalTags] = useState(tags);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function persistTags(articleId: string) {
    const result = await setArticleTags(articleId, tagIds);
    if (!result.success) {
      toast.error(`Article saved, but tags failed to save: ${result.error}`);
    }
  }

  async function handleSave(nextStatus?: ContentStatus) {
    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }
    if (!slug.trim()) {
      toast.error('Slug is required.');
      return;
    }

    setSaving(true);
    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content,
      featured_image_url: featuredImageUrl || null,
      featured_image_id: featuredImageId || null,
      category_id: categoryId,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
      status: nextStatus ?? status,
    };

    if (mode === 'create') {
      const result = await createArticle(payload);
      setSaving(false);
      if (!result.success || !result.id) {
        toast.error(friendlyError(result.error));
        return;
      }
      await persistTags(result.id);
      toast.success(nextStatus === 'published' ? 'Article published' : 'Article saved as draft');
      router.push(`/admin/articles/${result.id}`);
      router.refresh();
    } else if (article) {
      const result = await updateArticle(article.id, payload);
      setSaving(false);
      if (!result.success) {
        toast.error(friendlyError(result.error));
        return;
      }
      await persistTags(article.id);
      if (nextStatus) setStatus(nextStatus);
      toast.success(nextStatus === 'published' ? 'Article published' : 'Changes saved');
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!article) return;
    setDeleting(true);
    const result = await deleteArticle(article.id);
    setDeleting(false);
    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete article.');
      return;
    }
    toast.success('Article deleted');
    router.push('/admin/articles');
    router.refresh();
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {mode === 'create' ? 'New article' : 'Edit article'}
          </h1>
          {article && (
            <Badge variant={status === 'published' ? 'default' : 'secondary'} className="mt-1 capitalize">
              {status}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setPreviewOpen(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          {mode === 'edit' && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" disabled={saving} onClick={() => handleSave('draft')}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save draft
          </Button>
          <Button type="button" size="sm" disabled={saving} onClick={() => handleSave('published')}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Article title"
              className="text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="article-slug"
            />
            <p className="text-xs text-muted-foreground">yoursite.com/insights/{slug || 'article-slug'}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="A short summary shown in article listings"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <RichTextEditor value={content} onChange={setContent} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 rounded-lg border border-border p-4">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as ContentStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 rounded-lg border border-border p-4">
            <Label>Featured image</Label>
            {featuredImageUrl ? (
              <ClearableFeaturedImage
                url={featuredImageUrl}
                onClear={() => {
                  setFeaturedImageUrl('');
                  setFeaturedImageId('');
                }}
              />
            ) : (
              <Button type="button"
