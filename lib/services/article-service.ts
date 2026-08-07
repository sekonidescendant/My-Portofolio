import { createClient } from '@/lib/supabase/server';
import type { Article, Tag } from '@/lib/types/database';

const SELECT_WITH_RELATIONS = '*, category:categories(*), article_tags(tag:tags(*))';

type RawArticleRow = Article & {
  article_tags?: { tag: Tag | null }[] | null;
};

function flattenTags(row: RawArticleRow): Article {
  const { article_tags, ...rest } = row;
  return {
    ...rest,
    tags: (article_tags ?? []).map((row) => row.tag).filter((tag): tag is Tag => Boolean(tag)),
  };
}

export const articleService = {
  async getPublished(): Promise<Article[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(SELECT_WITH_RELATIONS)
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as unknown as RawArticleRow[]).map(flattenTags);
  },

  async getBySlug(slug: string): Promise<Article | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(SELECT_WITH_RELATIONS)
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) throw error;
    return data ? flattenTags(data as unknown as RawArticleRow) : null;
  },

  async getById(id: string): Promise<Article | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(SELECT_WITH_RELATIONS)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? flattenTags(data as unknown as RawArticleRow) : null;
  },

  async getAll(): Promise<Article[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select(SELECT_WITH_RELATIONS)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return ((data ?? []) as unknown as RawArticleRow[]).map(flattenTags);
  },

  async create(input: Partial<Article>): Promise<Article> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as Article;
  },

  async update(id: string, input: Partial<Article>): Promise<Article> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Article;
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) throw error;
  },

  async setTags(articleId: string, tagIds: string[]): Promise<void> {
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from('article_tags')
      .delete()
      .eq('article_id', articleId);
    if (deleteError) throw deleteError;

    if (tagIds.length === 0) return;

    const { error: insertError } = await supabase
      .from('article_tags')
      .insert(tagIds.map((tagId) => ({ article_id: articleId, tag_id: tagId })));
    if (insertError) throw insertError;
  },
};
