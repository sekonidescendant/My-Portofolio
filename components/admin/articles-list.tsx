'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { FileText, MoreVertical, Pencil, Plus, Search, Send, Trash2, Undo2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { deleteArticle, updateArticle } from '@/lib/actions/content-actions';
import type { Article, ContentStatus } from '@/lib/types/database';

type StatusFilter = ContentStatus | 'all';

export function ArticlesList({ initialArticles }: { initialArticles: Article[] }) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return initialArticles.filter((a) => {
      if (statusFilter !== 'all' && a.status !== statusFilter) return false;
      if (search.trim() && !a.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [initialArticles, statusFilter, search]);

  async function togglePublish(article: Article) {
    setBusyId(article.id);
    const nextStatus: ContentStatus = article.status === 'published' ? 'draft' : 'published';
    const result = await updateArticle(article.id, {
      status: nextStatus,
      published_at: nextStatus === 'published' ? new Date().toISOString() : article.published_at,
    });
    setBusyId(null);
    if (!result.success) {
      toast.error(result.error ?? 'Failed to update status.');
      return;
    }
    toast.success(nextStatus === 'published' ? 'Article published' : 'Moved back to draft');
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    const result = await deleteArticle(deleteTarget.id);
    setBusyId(null);
    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete article.');
      return;
    }
    toast.success('Article deleted');
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <Container className="space-y-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
          <p className="text-sm text-muted-foreground">Manage your published and draft articles.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/admin/articles/new">
            <Plus className="mr-2 h-4 w-4" />
            New article
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <TabsList>
            <TabsTrigger value="all">All ({initialArticles.length})</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-8 sm:w-64"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={initialArticles.length === 0 ? 'No articles yet' : 'No articles match your filters'}
          description={
            initialArticles.length === 0
              ? 'Articles you create will appear here. Use the CMS to add new content.'
              : 'Try a different search term or status filter.'
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((article) => (
                <TableRow key={article.id}>
                  <TableCell className="max-w-xs">
                    <Link href={`/admin/articles/${article.id}`} className="font-medium hover:underline">
                      {article.title || 'Untitled'}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant={article.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {article.category?.name ?? '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(article.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8" disabled={busyId === article.id}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/articles/${article.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePublish(article)}>
                          {article.status === 'published' ? (
                            <>
                              <Undo2 className="mr-2 h-4 w-4" />
                              Move to draft
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 h-4 w-4" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(article)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; will be permanently deleted. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
