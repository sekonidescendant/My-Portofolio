import { createClient } from '@/lib/supabase/server';
import { MediaLibrary } from '@/components/admin/media-library';
import type { MediaItem } from '@/types';

export default async function AdminMediaPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  return <MediaLibrary initialItems={(data ?? []) as MediaItem[]} />;
}
