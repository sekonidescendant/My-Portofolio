import { articleService } from '@/lib/services/article-service';
import { ArticlesList } from '@/components/admin/articles-list';

export default async function AdminArticlesPage() {
  const articles = await articleService.getAll();
  return <ArticlesList initialArticles={articles} />;
}
