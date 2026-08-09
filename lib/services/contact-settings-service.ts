import { createClient } from '@/lib/supabase/server';
import type { ContactMessage, Settings } from '@/lib/types/database';

export const contactService = {
  async create(input: {
    name: string;
    email: string;
    company?: string;
    role?: string;
    message: string;
    job_opportunity?: boolean;
  }): Promise<ContactMessage> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .insert(input)
      .select()
      .single();
    if (error) throw error;
    return data as ContactMessage;
  },

  async getAll(): Promise<ContactMessage[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as ContactMessage[];
  },

  async setReadStatus(id: string, isRead: boolean): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: isRead })
      .eq('id', id);
    if (error) throw error;
  },

  async remove(id: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

export const settingsService = {
  async get(): Promise<Settings | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .maybeSingle();
    if (error) throw error;
    return data as Settings | null;
  },

  async update(input: Partial<Settings>): Promise<Settings> {
    const supabase = createClient();
    const existing = await this.get();
    if (!existing) {
      const { data, error } = await supabase
        .from('settings')
        .insert(input)
        .select()
        .single();
      if (error) throw error;
      return data as Settings;
    }
    const { data, error } = await supabase
      .from('settings')
      .update(input)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data as Settings;
  },
};
