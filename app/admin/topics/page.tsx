import { topicService } from '@/lib/services/topic-service';
import { TopicsManager } from '@/components/admin/topics-manager';

export default async function AdminTopicsPage() {
  const topics = await topicService.getAll();
  return <TopicsManager initialTopics={topics} />;
}
