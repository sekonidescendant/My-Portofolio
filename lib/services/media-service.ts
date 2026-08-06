import { createClient } from '@/lib/supabase/server';
import type { Media } from '@/lib/types/database';

export const mediaService = {
  async getAll(): Promise<Media[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Media[];
  },

  async create(input: Partial<Media>): Promise<Media> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('media')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as Media;
  },

  async update(id: string, input: Partial<Media>): Promise<Media> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('media')
      .update(input)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data as Media;
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
  },

  async upload(
    bucket: string,
    filePath: string,
    file: File,
  ): Promise<{ url: string; path: string }> {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    return { url: urlData.publicUrl, path: data.path };
  },
};
