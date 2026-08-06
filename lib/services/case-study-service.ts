import { createClient } from '@/lib/supabase/server';
import type { CaseStudy } from '@/lib/types/database';

export const caseStudyService = {
  async getPublished(): Promise<CaseStudy[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as CaseStudy[];
  },

  async getBySlug(slug: string): Promise<CaseStudy | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();
    if (error) throw error;
    return data as CaseStudy | null;
  },

  async getAll(): Promise<CaseStudy[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as CaseStudy[];
  },

  async create(input: Partial<CaseStudy>): Promise<CaseStudy> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('case_studies')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as CaseStudy;
  },

  async update(id: string, input: Partial<CaseStudy>): Promise<CaseStudy> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('case_studies')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as CaseStudy;
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('case_studies').delete().eq('id', id);
    if (error) throw error;
  },
};
