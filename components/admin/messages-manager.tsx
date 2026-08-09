'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Briefcase,
  Circle,
  CircleDot,
  Loader2,
  Mail,
  MailOpen,
  Reply,
  Search,
  Trash2,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { setMessageReadStatus, deleteMessage } from '@/lib/actions/contact-actions';
import type { ContactMessage } from '@/lib/types/database';

type Filter = 'all' | 'unread' | 'opportunities';

export function MessagesManager({ initialMessages }: { initialMessages: ContactMessage[] }) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const [openMessage, setOpenMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return initialMessages.filter((m) => {
      if (filter === 'unread' && m.is_read) return false;
      if (filter === 'opportunities' && !m.job_opportunity) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const haystack = `${m.name} ${m.email} ${m.company ?? ''} ${m.message}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [initialMessages, filter, search]);

  const unreadCount = initialMessages.filter((m) => !m.is_read).length;
  const opportunityCount = initialMessages.filter((m) => m.job_opportunity).length;

  async function openAndMarkRead(message: ContactMessage) {
    setOpenMessage(message);
    if (!message.is_read) {
      const result = await setMessageReadStatus(message.id, true);
      if (result.success) {
        setOpenMessage((prev) => (prev && prev.id === message.id ? { ...prev, is_read: true } : prev));
        router.refresh();
      }
    }
  }

  async function toggleRead(message: ContactMessage) {
    setBusyId(message.id);
    const result = await setMessageReadStatus(message.id, !message.is_read);
    setBusyId(null);
    if (!result.success) {
      toast.error(result.error ?? 'Failed to update message.');
      return;
    }
    setOpenMessage((prev) => (prev && prev.id === message.id ? { ...prev, is_read: !message.is_read } : prev));
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteMessage(deleteTarget.id);
    setDeleting(false);
    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete message.');
      return;
    }
    toast.success('Message deleted');
    setDeleteTarget(null);
    setOpenMessage(null);
    router.refresh();
  }

  function replyHref(message: ContactMessage) {
    const subject = encodeURIComponent(`Re: your message${message.company ? ` (${message.company})` : ''}`);
    const body = encodeURIComponent(`Hi ${message.name},\n\n`);
    return `mailto:${message.email}?subject=${subject}&body=${body}`;
  }

  return (
    <Container className="space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contact Messages</h1>
        <p className="text-sm text-muted-foreground">Messages submitted through your contact form.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
          <TabsList>
            <TabsTrigger value="all">All ({initialMessages.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            <TabsTrigger value="opportunities">Job Opportunities ({opportunityCount})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages..."
            className="w-full pl-8 sm:w-56"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Mail}
          title={initialMessages.length === 0 ? 'No messages yet' : 'No messages match your filters'}
          description={
            initialMessages.length === 0
              ? 'Contact form submissions will appear here.'
              : 'Try a different search term or filter.'
          }
        />
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {filtered.map((message) => (
            <button
              key={message.id}
              onClick={() => openAndMarkRead(message)}
              className={cn(
                'flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/40',
                !message.is_read && 'bg-secondary/20',
              )}
            >
              <span className="mt-1 shrink-0 text-muted-foreground">
                {message.is_read ? <Circle className="h-2 w-2" /> : <CircleDot className="h-2 w-2 text-primary" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('text-sm', !message.is_read ? 'font-semibold' : 'font-medium')}>
                    {message.name}
                  </span>
                  <span className="text-xs text-muted-foreground">{message.email}</span>
                  {message.job_opportunity && (
                    <Badge variant="outline" className="gap-1 text-[10px]">
                      <Briefcase className="h-2.5 w-2.5" />
                      Job opportunity
                    </Badge>
                  )}
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">{message.message}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(message.created_at).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Message detail dialog */}
      <Dialog open={!!openMessage} onOpenChange={(open) => !open && setOpenMessage(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          {openMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{openMessage.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{openMessage.email}</span>
                  {openMessage.company && <span>· {openMessage.company}</span>}
                  {openMessage.role && <span>· {openMessage.role}</span>}
                </div>
                {openMessage.job_opportunity && (
                  <Badge variant="outline" className="gap-1">
                    <Briefcase className="h-3 w-3" />
                    Job opportunity
                  </Badge>
                )}
                <p className="whitespace-pre-wrap rounded-md border border-border bg-secondary/20 p-4 text-sm">
                  {openMessage.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  Received {new Date(openMessage.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <a href={replyHref(openMessage)}>
                      <Reply className="mr-1.5 h-3.5 w-3.5" />
                      Reply
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === openMessage.id}
                    onClick={() => toggleRead(openMessage)}
                  >
                    {busyId === openMessage.id ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : openMessage.is_read ? (
                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                    ) : (
                      <MailOpen className="mr-1.5 h-3.5 w-3.5" />
                    )}
                    Mark as {openMessage.is_read ? 'unread' : 'read'}
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteTarget(openMessage)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              The message from &ldquo;{deleteTarget?.name}&rdquo; will be permanently deleted. This can&apos;t be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
}
