'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/require-admin';
import { articleService } from '@/lib/services/article-service';
import { caseStudyService } from '@/lib/services/case-study-service';
import {
  categoryService,
  tagService,
  resumeFileService,
  documentService,
} from '@/lib/services/content-services';

// ============================================================
// ARTICLES
// ============================================================

export async function createArticle(input: Record<string, unknown>, tagIds: string[] = []) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    const article = await articleService.create(input);
    if (tagIds.length) await articleService.setTags(article.id, tagIds);
    revalidatePath('/admin/articles');
    revalidatePath('/insights');
    return { success: true, id: article.id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create article.' };
  }
}

export async function updateArticle(id: string, input: Record<string, unknown>, tagIds?: string[]) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    await articleService.update(id, input);
    if (tagIds !== undefined) await articleService.setTags(id, tagIds);
    revalidatePath('/admin/articles');
    revalidatePath('/insights');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update article.' };
  }
}

export async function deleteArticle(id: string) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    await articleService.remove(id);
    revalidatePath('/admin/articles');
    revalidatePath('/insights');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete article.' };
  }
}

// ============================================================
// CASE STUDIES
// ============================================================

export async function createCaseStudy(input: Record<string, unknown>) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    const study = await caseStudyService.create(input);
    revalidatePath('/admin/case-studies');
    revalidatePath('/case-studies');
    return { success: true, id: study.id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create case study.' };
  }
}

export async function updateCaseStudy(id: string, input: Record<string, unknown>) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    await caseStudyService.update(id, input);
    revalidatePath('/admin/case-studies');
    revalidatePath('/case-studies');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update case study.' };
  }
}

export async function deleteCaseStudy(id: string) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    await caseStudyService.remove(id);
    revalidatePath('/admin/case-studies');
    revalidatePath('/case-studies');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete case study.' };
  }
}

// ============================================================
// CATEGORIES & TAGS
// ============================================================

export async function createCategory(input: { name: string; slug: string; description?: string }) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    const category = await categoryService.create(input);
    revalidatePath('/admin/articles');
    return { success: true, category };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create category.' };
  }
}

export async function deleteCategory(id: string) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    await categoryService.remove(id);
    revalidatePath('/admin/articles');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete category.' };
  }
}

export async function createTag(input: { name: string; slug: string }) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    const tag = await tagService.create(input);
    revalidatePath('/admin/articles');
    return { success: true, tag };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create tag.' };
  }
}

export async function deleteTag(id: string) {
  const { user, error: authError } = await requireAdmin();
  if (!user) return { success: false, error: authError };

  try {
    await tagService.remove(id);
    revalidatePath('/admin/articles');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete tag.' };
  }
}

// ============================================================
// RESUME FILES
// ============================================================

export async function createResumeFile(input: Record<string, unknown>) {
  try {
    await resumeFileService.create(input);
    revalidatePath('/admin/resume');
    revalidatePath('/resume');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create resume file.' };
  }
}

export async function updateResumeFile(id: string, input: Record<string, unknown>) {
  try {
    await resumeFileService.update(id, input);
    revalidatePath('/admin/resume');
    revalidatePath('/resume');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update resume file.' };
  }
}

export async function deleteResumeFile(id: string) {
  try {
    await resumeFileService.remove(id);
    revalidatePath('/admin/resume');
    revalidatePath('/resume');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete resume file.' };
  }
}

// ============================================================
// DOCUMENTS
// ============================================================

export async function createDocument(input: Record<string, unknown>) {
  try {
    await documentService.create(input);
    revalidatePath('/admin/documents');
    revalidatePath('/contact');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create document.' };
  }
}

export async function updateDocument(id: string, input: Record<string, unknown>) {
  try {
    await documentService.update(id, input);
    revalidatePath('/admin/documents');
    revalidatePath('/contact');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update document.' };
  }
}

export async function deleteDocument(id: string) {
  try {
    await documentService.remove(id);
    revalidatePath('/admin/documents');
    revalidatePath('/contact');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete document.' };
  }
}
