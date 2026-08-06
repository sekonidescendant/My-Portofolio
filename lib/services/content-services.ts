import { createClient } from '@/lib/supabase/server';
import type { Category, Tag, ResumeFile, Document } from '@/lib/types/database';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Category[];
  },

  async create(input: { name: string; slug: string; description?: string }): Promise<Category> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as Category;
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },
};

export const tagService = {
  async getAll(): Promise<Tag[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return (data ?? []) as Tag[];
  },

  async create(input: { name: string; slug: string }): Promise<Tag> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('tags')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as Tag;
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('tags').delete().eq('id', id);
    if (error) throw error;
  },
};

export const resumeFileService = {
  async getPublished(): Promise<ResumeFile[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('resume_files')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as ResumeFile[];
  },

  async getAll(): Promise<ResumeFile[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('resume_files')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as ResumeFile[];
  },

  async create(input: Partial<ResumeFile>): Promise<ResumeFile> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('resume_files')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as ResumeFile;
  },

  async update(id: string, input: Partial<ResumeFile>): Promise<ResumeFile> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('resume_files')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as ResumeFile;
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('resume_files').delete().eq('id', id);
    if (error) throw error;
  },
};

export const documentService = {
  async getPublished(): Promise<Document[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Document[];
  },

  async getAll(): Promise<Document[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Document[];
  },

  async create(input: Partial<Document>): Promise<Document> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as Document;
  },

  async update(id: string, input: Partial<Document>): Promise<Document> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('documents')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Document;
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw error;
  },
};
