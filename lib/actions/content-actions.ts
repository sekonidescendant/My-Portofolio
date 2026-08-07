'use server';

import { revalidatePath } from 'next/cache';
import { articleService } from '@/lib/services/article-service';
import { caseStudyService } from '@/lib/services/case-study-service';
import {
  categoryService,
  tagService,
  resumeFileService,
  documentService,
} from '@/lib/services/content-services';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { estimateReadingTime } from '@/lib/reading-time';

// ============================================================
// ARTICLES
// ============================================================

function prepareArticleInput(input: Record<string, unknown>) {
  const prepared = { ...input };
  if (typeof prepared.content === 'string') {
    const clean = sanitizeHtml(prepared.content);
    prepared.content = clean;
    prepared.reading_time = estimateReadingTime(clean);
  }
  if (prepared.status === 'published' && !prepared.published_at) {
    prepared.published_at = new Date().toISOString();
  }
  return prepared;
}

export async function createArticle(input: Record<string, unknown>) {
  try {
    const article = await articleService.create(prepareArticleInput(input));
    revalidatePath('/admin/articles');
    revalidatePath('/insights');
    return { success: true, id: article.id };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create article.' };
  }
}

export async function updateArticle(id: string, input: Record<string, unknown>) {
  try {
    await articleService.update(id, prepareArticleInput(input));
    revalidatePath('/admin/articles');
    revalidatePath('/insights');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update article.' };
  }
}

export async function setArticleTags(articleId: string, tagIds: string[]) {
  try {
    await articleService.setTags(articleId, tagIds);
    revalidatePath('/admin/articles');
    revalidatePath('/insights');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to set tags.' };
  }
}

export async function deleteArticle(id: string) {
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
  try {
    await caseStudyService.create(input);
    revalidatePath('/admin/case-studies');
    revalidatePath('/case-studies');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create case study.' };
  }
}

export async function updateCaseStudy(id: string, input: Record<string, unknown>) {
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
  try {
    const category = await categoryService.create(input);
    revalidatePath('/admin/articles');
    return { success: true, category };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create category.' };
  }
}

export async function deleteCategory(id: string) {
  try {
    await categoryService.remove(id);
    revalidatePath('/admin/articles');
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete category.' };
  }
}

export async function createTag(input: { name: string; slug: string }) {
  try {
    const tag = await tagService.create(input);
    revalidatePath('/admin/articles');
    return { success: true, tag };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create tag.' };
  }
}

export async function deleteTag(id: string) {
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
