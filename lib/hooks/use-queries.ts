'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import type { Article, CaseStudy, Media, ContactMessage, Settings } from '@/lib/types/database';

const supabase = createClient();

// ============================================================
// ARTICLES
// ============================================================

export function usePublishedArticles() {
  return useQuery({
    queryKey: ['articles', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*, category:categories(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as Article[];
    },
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: ['article', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error) throw error;
      return data as Article | null;
    },
    enabled: !!slug,
  });
}

export function useAllArticles() {
  return useQuery({
    queryKey: ['articles', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Article[];
    },
  });
}

// ============================================================
// CASE STUDIES
// ============================================================

export function usePublishedCaseStudies() {
  return useQuery({
    queryKey: ['case-studies', 'published'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as CaseStudy[];
    },
  });
}

export function useCaseStudy(slug: string) {
  return useQuery({
    queryKey: ['case-study', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error) throw error;
      return data as CaseStudy | null;
    },
    enabled: !!slug,
  });
}

// ============================================================
// MEDIA
// ============================================================

export function useMedia() {
  return useQuery({
    queryKey: ['media'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Media[];
    },
  });
}

// ============================================================
// CONTACT MESSAGES
// ============================================================

export function useContactMessages() {
  return useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ContactMessage[];
    },
  });
}

export function useMarkMessageAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .update({ is_read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
    },
  });
}

// ============================================================
// SETTINGS
// ============================================================

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .maybeSingle();
      if (error) throw error;
      return data as Settings | null;
    },
  });
}
