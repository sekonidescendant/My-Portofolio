import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { ArticleForm } from '@/components/admin/article-form';
import { articleService } from '@/lib/services/article-service';
import { categoryService, tagService } from '@/lib/services/content-services';

export default async function EditArticlePage({ params }: { params: { id: string } }) {
  const [article, categories, tags] = await Promise.all([
    articleService.getById(params.id),
    categoryService.getAll(),
    tagService.getAll(),
  ]);

  if (!article) notFound();

  return (
    <Container className="py-10">
      <ArticleForm mode="edit" article={article} categories={categories} tags={tags} />
    </Container>
  );
}
