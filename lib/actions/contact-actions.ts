'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/require-admin';
import { contactService, settingsService } from '@/lib/services/contact-settings-service';

export async function submitContactMessage(input: {
  name: string;
  email: string;
  company?: string;
  role?: string;
  message: string;
  job_opportunity?: boolean;
  // Spam protection (not shown in the UI as real fields):
  // honeypot should always arrive empty — bots tend to fill every field they find.
  honeypot?: string;
  // formRenderedAt is a client timestamp (ms) captured when the form mounted —
  // real visitors take at least a couple seconds to fill a form out; bots
  // that submit instantly get rejected.
  formRenderedAt?: number;
}) {
  if (input.honeypot) {
    // Silently pretend success so bots don't learn to avoid the honeypot.
    return { success: true };
  }
  if (input.formRenderedAt && Date.now() - input.formRenderedAt < 2000) {
    return { success: true };
  }

  try {
    await contactService.create({
      name: input.name,
      email: input.email,
      company: input.company,
      role: input.role,
      message: input.message,
      job_opportunity: input.job_opportunity,
    });
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message.',
    };
  }
}

export async function setMessageReadStatus(id: string, isRead: boolean) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    await contactService.setReadStatus(id, isRead);
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update message.',
    };
  }
}

export async function deleteMessage(id: string) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    await contactService.remove(id);
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete message.',
    };
  }
}

export async function updateSettings(input: Record<string, unknown>) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    await settingsService.update(input);
    revalidatePath('/admin/settings');
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update settings.',
    };
  }
}
