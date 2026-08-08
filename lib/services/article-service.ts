import { createClient } from '@/lib/supabase/server';
import type { Article } from '@/lib/types/database';

export const articleService = {
  async getPublished(): Promise<Article[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, category:categories(*)')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Article[];
  },

  async getBySlug(slug: string): Promise<Article | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) throw error;
    return data as Article | null;
  },

  async getAll(): Promise<Article[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*, category:categories(*)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Article[];
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

  async getTagIds(articleId: string): Promise<string[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('article_tags')
      .select('tag_id')
      .eq('article_id', articleId);
    if (error) throw error;
    return (data ?? []).map((row) => row.tag_id as string);
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
