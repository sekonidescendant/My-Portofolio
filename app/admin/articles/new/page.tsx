import { Container } from '@/components/layout/container';
import { ArticleForm } from '@/components/admin/article-form';
import { categoryService, tagService } from '@/lib/services/content-services';

export default async function NewArticlePage() {
  const [categories, tags] = await Promise.all([categoryService.getAll(), tagService.getAll()]);

  return (
    <Container className="py-10">
      <ArticleForm mode="create" categories={categories} tags={tags} />
    </Container>
  );
}
