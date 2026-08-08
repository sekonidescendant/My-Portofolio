'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Briefcase, MoreVertical, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CaseStudyFormDialog } from '@/components/admin/case-study-form-dialog';
import { deleteCaseStudy } from '@/lib/actions/content-actions';
import type { CaseStudy } from '@/lib/types/database';
import type { MediaItem } from '@/types';

type StatusFilter = 'all' | 'draft' | 'published';

export function CaseStudiesManager({
  initialCaseStudies,
  mediaItems,
}: {
  initialCaseStudies: CaseStudy[];
  mediaItems: MediaItem[];
}) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const [formOpen, setFormOpen] = useState(false);
  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<CaseStudy | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    return initialCaseStudies.filter((cs) => {
      if (statusFilter !== 'all' && cs.status !== statusFilter) return false;
      if (search.trim() && !cs.title.toLowerCase().includes(search.trim().toLowerCase())) return false;
      return true;
    });
  }, [initialCaseStudies, statusFilter, search]);

  function openCreate() {
    setEditingCaseStudy(null);
    setFormOpen(true);
  }

  function openEdit(cs: CaseStudy) {
    setEditingCaseStudy(cs);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteCaseStudy(deleteTarget.id);
    setDeleting(false);
    if (!result.success) {
      toast.error(result.error ?? 'Failed to delete case study.');
      return;
    }
    toast.success('Case study deleted');
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <Container className="space-y-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Case Studies</h1>
          <p className="text-sm text-muted-foreground">Manage your case studies.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1.5 h-4 w-4" />
          New Case Study
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <TabsList>
            <TabsTrigger value="all">All ({initialCaseStudies.length})</TabsTrigger>
            <TabsTrigger value="published">
              Published ({initialCaseStudies.filter((c) => c.status === 'published').length})
            </TabsTrigger>
            <TabsTrigger value="draft">
              Drafts ({initialCaseStudies.filter((c) => c.status === 'draft').length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search case studies..."
            className="w-full pl-8 sm:w-56"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title={initialCaseStudies.length === 0 ? 'No case studies yet' : 'No case studies match your filters'}
          description={
            initialCaseStudies.length === 0
              ? 'Create your first case study to get started.'
              : 'Try a different search term or status filter.'
          }
        />
      ) : (
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cs) => (
                <TableRow key={cs.id}>
                  <TableCell className="max-w-xs">
                    <button className="flex items-center gap-1.5 text-left font-medium hover:underline" onClick={() => openEdit(cs)}>
                      {cs.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />}
                      {cs.title || 'Untitled'}
                    </button>
                    <p className="truncate text-xs text-muted-foreground">/case-studies/{cs.slug}</p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{cs.client || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={cs.status === 'published' ? 'default' : 'outline'} className="capitalize">
                      {cs.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(cs.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(cs)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteTarget(cs)}
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

      <CaseStudyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        caseStudy={editingCaseStudy}
        mediaItems={mediaItems}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this case study?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; will be permanently deleted. This can&apos;t be undone.
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
