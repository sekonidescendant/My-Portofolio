import { createClient } from '@/lib/supabase/server';
import type { ContentTopic } from '@/lib/types/database';

export const topicService = {
  async getAll(): Promise<ContentTopic[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('content_topics')
      .select('*')
      .order('used', { ascending: true })
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data ?? []) as ContentTopic[];
  },

  async create(topic: string): Promise<ContentTopic> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('content_topics')
      .insert({ topic })
      .select()
      .single();
    if (error) throw error;
    return data as ContentTopic;
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from('content_topics').delete().eq('id', id);
    if (error) throw error;
  },
};
