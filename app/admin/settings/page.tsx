import { createClient } from '@/lib/supabase/server';
import { settingsService } from '@/lib/services/contact-settings-service';
import { SettingsManager } from '@/components/admin/settings-manager';
import type { MediaItem } from '@/types';

export default async function AdminSettingsPage() {
  const supabase = createClient();

  const [settings, mediaResult] = await Promise.all([
    settingsService.get(),
    supabase.from('media').select('*').eq('bucket', 'images').order('created_at', { ascending: false }),
  ]);

  return (
    <SettingsManager
      initialSettings={settings}
      mediaItems={(mediaResult.data ?? []) as MediaItem[]}
    />
  );
}
