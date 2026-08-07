'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { ALLOWED_BUCKETS, ALLOWED_MIME, MAX_SIZE_BYTES, PUBLIC_BUCKETS } from '@/lib/media';
import type { MediaBucket } from '@/types';

function sanitizeFileName(name: string) {
  const cleaned = name.replace(/[^a-zA-Z0-9.\-_]/g, '-').toLowerCase();
  return cleaned.slice(-120);
}

function buildStoragePath(folder: string | null, fileName: string) {
  const id = crypto.randomUUID();
  const safeName = sanitizeFileName(fileName);
  const folderPrefix = folder && folder.trim() ? `${folder.trim()}/` : '';
  return `${folderPrefix}${id}-${safeName}`;
}

async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, error: 'Not signed in.' as const };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    return { supabase, user: null, error: 'Not authorized.' as const };
  }

  return { supabase, user, error: null };
}

export type UploadResult =
  | { ok: true }
  | { ok: false; error: string };

export async function uploadMediaAction(formData: FormData): Promise<UploadResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!user) return { ok: false, error: authError };

  const file = formData.get('file');
  const bucket = formData.get('bucket') as MediaBucket | null;
  const folder = (formData.get('folder') as string | null) ?? '';
  const altText = (formData.get('alt_text') as string | null) ?? '';
  const caption = (formData.get('caption') as string | null) ?? '';

  if (!(file instanceof File)) return { ok: false, error: 'No file provided.' };
  if (!bucket || !ALLOWED_BUCKETS.includes(bucket)) {
    return { ok: false, error: 'Invalid bucket.' };
  }
  if (file.size === 0) return { ok: false, error: 'File is empty.' };
  if (file.size > MAX_SIZE_BYTES[bucket]) {
    const mb = Math.round(MAX_SIZE_BYTES[bucket] / (1024 * 1024));
    return { ok: false, error: `File too large. Max ${mb}MB for ${bucket}.` };
  }
  if (!ALLOWED_MIME[bucket].includes(file.type)) {
    return { ok: false, error: `File type "${file.type || 'unknown'}" isn't allowed in ${bucket}.` };
  }

  const path = buildStoragePath(folder, file.name);

  const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    return { ok: false, error: uploadError.message };
  }

  const isPublic = PUBLIC_BUCKETS.includes(bucket);
  const url = isPublic ? supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl : path;

  const { error: insertError } = await supabase.from('media').insert({
    file_name: file.name,
    url,
    bucket,
    file_type: file.type,
    size_bytes: file.size,
    alt_text: altText,
    caption,
    folder: folder.trim() || null,
  });

  if (insertError) {
    // Roll back the uploaded object so storage doesn't accumulate orphans.
    await supabase.storage.from(bucket).remove([path]);
    return { ok: false, error: insertError.message };
  }

  revalidatePath('/admin/media');
  return { ok: true };
}

export async function deleteMediaAction(id: string): Promise<UploadResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!user) return { ok: false, error: authError };

  const { data: item, error: fetchError } = await supabase
    .from('media')
    .select('bucket, url')
    .eq('id', id)
    .maybeSingle();

  if (fetchError || !item) return { ok: false, error: fetchError?.message ?? 'Not found.' };

  const path = PUBLIC_BUCKETS.includes(item.bucket as MediaBucket)
    ? extractPathFromPublicUrl(item.url, item.bucket)
    : item.url;

  if (path) {
    await supabase.storage.from(item.bucket).remove([path]);
  }

  const { error: deleteError } = await supabase.from('media').delete().eq('id', id);
  if (deleteError) return { ok: false, error: deleteError.message };

  revalidatePath('/admin/media');
  return { ok: true };
}

export async function updateMediaMetaAction(
  id: string,
  fields: { alt_text?: string; caption?: string; folder?: string | null },
): Promise<UploadResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!user) return { ok: false, error: authError };

  const { error } = await supabase
    .from('media')
    .update({
      ...fields,
      folder: fields.folder?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/media');
  return { ok: true };
}

export async function replaceMediaAction(id: string, formData: FormData): Promise<UploadResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!user) return { ok: false, error: authError };

  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'No file provided.' };

  const { data: item, error: fetchError } = await supabase
    .from('media')
    .select('bucket, url, folder')
    .eq('id', id)
    .maybeSingle();

  if (fetchError || !item) return { ok: false, error: fetchError?.message ?? 'Not found.' };

  const bucket = item.bucket as MediaBucket;
  if (file.size > MAX_SIZE_BYTES[bucket]) {
    const mb = Math.round(MAX_SIZE_BYTES[bucket] / (1024 * 1024));
    return { ok: false, error: `File too large. Max ${mb}MB for ${bucket}.` };
  }
  if (!ALLOWED_MIME[bucket].includes(file.type)) {
    return { ok: false, error: `File type "${file.type || 'unknown'}" isn't allowed in ${bucket}.` };
  }

  const oldPath = PUBLIC_BUCKETS.includes(bucket)
    ? extractPathFromPublicUrl(item.url, bucket)
    : item.url;

  const newPath = buildStoragePath(item.folder, file.name);

  const { error: uploadError } = await supabase.storage.from(bucket).upload(newPath, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { ok: false, error: uploadError.message };

  const isPublic = PUBLIC_BUCKETS.includes(bucket);
  const url = isPublic ? supabase.storage.from(bucket).getPublicUrl(newPath).data.publicUrl : newPath;

  const { error: updateError } = await supabase
    .from('media')
    .update({
      file_name: file.name,
      url,
      size_bytes: file.size,
      file_type: file.type,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (updateError) {
    await supabase.storage.from(bucket).remove([newPath]);
    return { ok: false, error: updateError.message };
  }

  if (oldPath) {
    await supabase.storage.from(bucket).remove([oldPath]);
  }

  revalidatePath('/admin/media');
  return { ok: true };
}

export async function getSignedUrlAction(id: string): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!user) return { ok: false, error: authError };

  const { data: item, error: fetchError } = await supabase
    .from('media')
    .select('bucket, url')
    .eq('id', id)
    .maybeSingle();

  if (fetchError || !item) return { ok: false, error: fetchError?.message ?? 'Not found.' };

  if (PUBLIC_BUCKETS.includes(item.bucket as MediaBucket)) {
    return { ok: true, url: item.url };
  }

  const { data, error } = await supabase.storage.from(item.bucket).createSignedUrl(item.url, 60 * 10);
  if (error || !data) return { ok: false, error: error?.message ?? 'Could not create link.' };

  return { ok: true, url: data.signedUrl };
}

function extractPathFromPublicUrl(url: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}
