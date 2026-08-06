'use server';

import { revalidatePath } from 'next/cache';
import { contactService, settingsService } from '@/lib/services/contact-settings-service';

export async function submitContactMessage(input: {
  name: string;
  email: string;
  company?: string;
  role?: string;
  message: string;
  job_opportunity?: boolean;
}) {
  try {
    await contactService.create(input);
    revalidatePath('/admin/messages');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message.',
    };
  }
}

export async function markMessageAsRead(id: string) {
  try {
    await contactService.markAsRead(id);
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
  try {
    await settingsService.update(input);
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update settings.',
    };
  }
}
