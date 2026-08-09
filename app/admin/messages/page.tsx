import { contactService } from '@/lib/services/contact-settings-service';
import { MessagesManager } from '@/components/admin/messages-manager';

export default async function AdminMessagesPage() {
  const messages = await contactService.getAll();
  return <MessagesManager initialMessages={messages} />;
}
