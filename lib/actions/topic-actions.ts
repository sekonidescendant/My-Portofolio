'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/require-admin';
import { topicService } from '@/lib/services/topic-service';

export async function createTopic(topic: string) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  if (!topic.trim()) {
    return { success: false, error: 'Topic cannot be empty.' };
  }

  try {
    await topicService.create(topic.trim());
    revalidatePath('/admin/topics');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to add topic.' };
  }
}

export async function deleteTopic(id: string) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    await topicService.remove(id);
    revalidatePath('/admin/topics');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete topic.' };
  }
}
