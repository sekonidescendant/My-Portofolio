import { createClient } from '@/lib/supabase/server';
import { articleService } from '@/lib/services/article-service';
import { categoryService, tagService } from '@/lib/services/content-services';
import { ArticlesManager } from '@/components/admin/articles-manager';
import type { Article, Tag } from '@/lib/types/database';
import type { MediaItem } from '@/types';

export default async function AdminArticlesPage() {
  const supabase = createClient();

  const [articles, categories, tags, mediaResult, articleTagsResult] = await Promise.all([
    articleService.getAll(),
    categoryService.getAll(),
    tagService.getAll(),
    supabase.from('media').select('*').eq('bucket', 'images').order('created_at', { ascending: false }),
    supabase.from('article_tags').select('article_id, tag_id'),
  ]);

  const tagsById = new Map<string, Tag>(tags.map((t) => [t.id, t]));
  const tagIdsByArticle = new Map<string, string[]>();
  for (const row of articleTagsResult.data ?? []) {
    const list = tagIdsByArticle.get(row.article_id) ?? [];
    list.push(row.tag_id);
    tagIdsByArticle.set(row.article_id, list);
  }

  const articlesWithTags: Article[] = articles.map((article) => ({
    ...article,
    tags: (tagIdsByArticle.get(article.id) ?? [])
      .map((tagId) => tagsById.get(tagId))
      .filter((t): t is Tag => !!t),
  }));

  return (
    <ArticlesManager
      initialArticles={articlesWithTags}
      categories={categories}
      initialTags={tags}
      mediaItems={(mediaResult.data ?? []) as MediaItem[]}
    />
  );
}
