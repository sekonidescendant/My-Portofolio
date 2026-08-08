'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/require-admin';
import { MAX_SIZE_BYTES, ALLOWED_MIME } from '@/lib/media';

const BUCKET = 'resume' as const;

function sanitizeFileName(name: string) {
  const cleaned = name.replace(/[^a-zA-Z0-9.\-_]/g, '-').toLowerCase();
  return cleaned.slice(-120);
}

function buildStoragePath(fileName: string) {
  const id = crypto.randomUUID();
  const safeName = sanitizeFileName(fileName);
  return `${id}-${safeName}`;
}

function extractPathFromPublicUrl(url: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const index = url.indexOf(marker);
  if (index === -1) return null;
  return decodeURIComponent(url.slice(index + marker.length));
}

export type ResumeActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function uploadResumeFileAction(formData: FormData): Promise<ResumeActionResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!user) return { ok: false, error: authError };

  const file = formData.get('file');
  const label = (formData.get('label') as string | null) ?? '';
  const description = (formData.get('description') as string | null) ?? '';

  if (!(file instanceof File)) return { ok: false, error: 'No file provided.' };
  if (!label.trim()) return { ok: false, error: 'Label is required.' };
  if (file.size === 0) return { ok: false, error: 'File is empty.' };
  if (file.size > MAX_SIZE_BYTES[BUCKET]) {
    const mb = Math.round(MAX_SIZE_BYTES[BUCKET] / (1024 * 1024));
    return { ok: false, error: `File too large. Max ${mb}MB.` };
  }
  if (!ALLOWED_MIME[BUCKET].includes(file.type)) {
    return { ok: false, error: `File type "${file.type || 'unknown'}" isn't allowed. Upload a PDF.` };
  }

  const path = buildStoragePath(file.name);

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { ok: false, error: uploadError.message };

  const url = supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  const { error: insertError } = await supabase.from('resume_files').insert({
    label: label.trim(),
    description: description.trim(),
    url,
    file_type: file.type,
    status: 'draft',
  });

  if (insertError) {
    await supabase.storage.from(BUCKET).remove([path]);
    return { ok: false, error: insertError.message };
  }

  revalidatePath('/admin/resume');
  revalidatePath('/resume');
  return { ok: true };
}

export async function replaceResumeFileAction(id: string, formData: FormData): Promise<ResumeActionResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!user) return { ok: false, error: authError };

  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'No file provided.' };
  if (file.size > MAX_SIZE_BYTES[BUCKET]) {
    const mb = Math.round(MAX_SIZE_BYTES[BUCKET] / (1024 * 1024));
    return { ok: false, error: `File too large. Max ${mb}MB.` };
  }
  if (!ALLOWED_MIME[BUCKET].includes(file.type)) {
    return { ok: false, error: `File type "${file.type || 'unknown'}" isn't allowed. Upload a PDF.` };
  }

  const { data: item, error: fetchError } = await supabase
    .from('resume_files')
    .select('url')
    .eq('id', id)
    .maybeSingle();
  if (fetchError || !item) return { ok: false, error: fetchError?.message ?? 'Not found.' };

  const oldPath = extractPathFromPublicUrl(item.url);
  const newPath = buildStoragePath(file.name);

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(newPath, file, {
    contentType: file.type,
    upsert: false,
  });
  if (uploadError) return { ok: false, error: uploadError.message };

  const url = supabase.storage.from(BUCKET).getPublicUrl(newPath).data.publicUrl;

  const { error: updateError } = await supabase
    .from('resume_files')
    .update({ url, file_type: file.type, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (updateError) {
    await supabase.storage.from(BUCKET).remove([newPath]);
    return { ok: false, error: updateError.message };
  }

  if (oldPath) {
    await supabase.storage.from(BUCKET).remove([oldPath]);
  }

  revalidatePath('/admin/resume');
  revalidatePath('/resume');
  return { ok: true };
}

export async function updateResumeFileMetaAction(
  id: string,
  fields: { label?: string; description?: string; status?: 'draft' | 'published' },
): Promise<ResumeActionResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!user) return { ok: false, error: authError };

  const { error } = await supabase
    .from('resume_files')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return { ok: false, error: error.message };

  revalidatePath('/admin/resume');
  revalidatePath('/resume');
  return { ok: true };
}

export async function deleteResumeFileAction(id: string): Promise<ResumeActionResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!user) return { ok: false, error: authError };

  const { data: item, error: fetchError } = await supabase
    .from('resume_files')
    .select('url')
    .eq('id', id)
    .maybeSingle();
  if (fetchError || !item) return { ok: false, error: fetchError?.message ?? 'Not found.' };

  const path = extractPathFromPublicUrl(item.url);
  if (path) {
    await supabase.storage.from(BUCKET).remove([path]);
  }

  const { error: deleteError } = await supabase.from('resume_files').delete().eq('id', id);
  if (deleteError) return { ok: false, error: deleteError.message };

  revalidatePath('/admin/resume');
  revalidatePath('/resume');
  return { ok: true };
}
