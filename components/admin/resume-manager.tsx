'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Download,
  FileBadge,
  Loader2,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import {
  uploadResumeFileAction,
  replaceResumeFileAction,
  updateResumeFileMetaAction,
  deleteResumeFileAction,
} from '@/app/admin/resume/actions';
import type { ResumeFile } from '@/lib/types/database';

export function ResumeManager({ initialFiles }: { initialFiles: ResumeFile[] }) {
  const router = useRouter();

  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadLabel, setUploadLabel] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [editTarget, setEditTarget] = useState<ResumeFile | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ResumeFile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const replaceInputRef = useRef<HTMLInputElement | null>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);

  async function handleUpload() {
    if (!uploadFile) {
      toast.error('Choose a PDF file.');
      return;
    }
    if (!uploadLabel.trim()) {
      toast.error('Label is required.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.set('file', uploadFile);
    formData.set('label', uploadLabel.trim());
    formData.set('description', uploadDescription.trim());

    const result = await uploadResumeFileAction(formData);
    setUploading(false);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Resume file uploaded');
    setUploadOpen(false);
    setUploadLabel('');
    setUploadDescription('');
    setUploadFile(null);
    router.refresh();
  }

  function openEdit(file: ResumeFile) {
    setEditTarget(file);
    setEditLabel(file.label);
    setEditDescription(file.description ?? '');
  }

  async function handleSaveEdit() {
    if (!editTarget) return;
    if (!editLabel.trim()) {
      toast.error('Label is required.');
      return;
    }
    setSavingEdit(true);
    const result = await updateResumeFileMetaAction(editTarget.id, {
      label: editLabel.trim(),
      description: editDescription.trim(),
    });
    setSavingEdit(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Updated');
    setEditTarget(null);
    router.refresh();
  }

  async function handleToggleStatus(file: ResumeFile) {
    setTogglingId(file.id);
    const nextStatus = file.status === 'published' ? 'draft' : 'published';
    const result = await updateResumeFileMetaAction(file.id, { status: nextStatus });
    setTogglingId(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  function triggerReplace(id: string) {
    setReplaceTargetId(id);
    replaceInputRef.current?.click();
  }

  async function handleReplaceFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !replaceTargetId) return;

    setReplacingId(replaceTargetId);
    const formData = new FormData();
    formData.set('file', file);
    const result = await replaceResumeFileAction(replaceTargetId, formData);
    setReplacingId(null);
    setReplaceTargetId(null);

    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('File replaced');
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteResumeFileAction(deleteTarget.id);
    setDeleting(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Deleted');
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <Container className="space-y-8 py-10">
      <input
        ref={replaceInputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleReplaceFileSelected}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Resume Files</h1>
          <p className="text-sm text-muted-foreground">Manage downloadable resume documents.</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Plus className="mr-1.5 h-4 w-4" />
          Upload Resume File
        </Button>
      </div>

      {initialFiles.length === 0 ? (
        <EmptyState
          icon={FileBadge}
          title="No resume files yet"
          description="Upload ATS, one-page and portfolio PDF resumes here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {initialFiles.map((file) => (
            <div key={file.id} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                    <FileBadge className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium leading-tight">{file.label}</p>
                    {file.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{file.description}</p>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(file)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => triggerReplace(file.id)} disabled={replacingId === file.id}>
                      {replacingId === file.id ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="mr-2 h-4 w-4" />
                      )}
                      Replace file
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteTarget(file)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={file.status === 'published' ? 'default' : 'outline'} className="capitalize">
                  {file.status}
                </Badge>
              </div>

              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={file.status === 'published'}
                    onCheckedChange={() => handleToggleStatus(file)}
                    disabled={togglingId === file.id}
                  />
                  <span className="text-xs text-muted-foreground">
                    {file.status === 'published' ? 'Live on site' : 'Draft'}
                  </span>
                </div>
                <Button asChild size="sm" variant="outline">
                  <a href={file.url} target="_blank" rel="noopener noreferrer" download>
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Download
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload resume file</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="resume-file">PDF file</Label>
              <Input
                id="resume-file"
                type="file"
                accept="application/pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume-label">Label</Label>
              <Input
                id="resume-label"
                value={uploadLabel}
                onChange={(e) => setUploadLabel(e.target.value)}
                placeholder="e.g. ATS Resume"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resume-description">Description</Label>
              <Textarea
                id="resume-description"
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                rows={2}
                placeholder="e.g. Applicant Tracking System friendly format"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)} disabled={uploading}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={!!editTarget} onOpenChange={(open) => !open && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-resume-label">Label</Label>
              <Input id="edit-resume-label" value={editLabel} onChange={(e) => setEditLabel(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-resume-description">Description</Label>
              <Textarea
                id="edit-resume-description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)} disabled={savingEdit}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={savingEdit}>
              {savingEdit && <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.label}&rdquo; will be permanently deleted. This can&apos;t be undone.
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
