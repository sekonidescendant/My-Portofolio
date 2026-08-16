'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, CheckCircle2, Circle, ListTodo } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
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
import { createTopic, deleteTopic } from '@/lib/actions/topic-actions';
import type { ContentTopic } from '@/lib/types/database';

export function TopicsManager({ initialTopics }: { initialTopics: ContentTopic[] }) {
  const router = useRouter();
  const [newTopic, setNewTopic] = useState('');
  const [adding, setAdding] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContentTopic | null>(null);
  const [deleting, setDeleting] = useState(false);

  const unused = initialTopics.filter((t) => !t.used);
  const used = initialTopics.filter((t) => t.used);

  async function handleAdd() {
    if (!newTopic.trim()) return;
    setAdding(true);
    const result = await createTopic(newTopic);
    setAdding(false);
    if (!result.success) {
      toast.error(result.error ?? 'Failed to add topic.');
      return;
    }
    setNewTopic('');
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteTopic(deleteTarget.id);
    setDeleting(false);
    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete topic.');
      return;
    }
    toast.success('Topic removed');
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <Container className="max-w-2xl space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Draft Topics</h1>
        <p className="text-sm text-muted-foreground">
          The daily draft job works through this list, oldest first, and never invents topics on its own.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="e.g. What I learned coordinating 6 community events in one semester"
        />
        <Button onClick={handleAdd} disabled={adding || !newTopic.trim()}>
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      {initialTopics.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title="No topics queued"
          description="Add a few above so the daily job has something to write about."
        />
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Up next ({unused.length})
            </p>
            {unused.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Queue is empty — the next scheduled run will have nothing to write about. Add more topics above.
              </p>
            ) : (
              <div className="divide-y divide-border rounded-lg border border-border">
                {unused.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-sm">{t.topic}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(t)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {used.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Already used ({used.length})
              </p>
              <div className="divide-y divide-border rounded-lg border border-border opacity-60">
                {used.map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 text-sm line-through">{t.topic}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 shrink-0 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(t)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this topic?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.topic}&rdquo; will be removed from the queue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Container>
  );
}
