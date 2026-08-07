'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  FileText,
  Film,
  ImageIcon,
  Link as LinkIcon,
  MoreVertical,
  Pencil,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { formatBytes } from '@/lib/media';
import type { MediaItem } from '@/types';
import {
  deleteMediaAction,
  getSignedUrlAction,
  replaceMediaAction,
  updateMediaMetaAction,
} from '@/app/admin/media/actions';

export function MediaItemCard({ item }: { item: MediaItem }) {
  const router = useRouter();
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [altText, setAltText] = useState(item.alt_text);
  const [caption, setCaption] = useState(item.caption);
  const [folder, setFolder] = useState(item.folder ?? '');

  const isImage = item.bucket === 'images';
  const isVideo = item.bucket === 'videos';

  async function handleCopyLink() {
    const result = await getSignedUrlAction(item.id);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    await navigator.clipboard.writeText(result.url);
    toast.success(item.bucket === 'documents' ? 'Download link copied (valid 10 min)' : 'URL copied');
  }

  async function handleSaveEdit() {
    setBusy(true);
    const result = await updateMediaMetaAction(item.id, { alt_text: altText, caption, folder });
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Details updated');
    setEditOpen(false);
    router.refresh();
  }

  async function handleReplaceFile(file: File) {
    setBusy(true);
    const formData = new FormData();
    formData.append('file', file);
    const result = await replaceMediaAction(item.id, formData);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('File replaced');
    router.refresh();
  }

  async function handleDelete() {
    setBusy(true);
    const result = await deleteMediaAction(item.id);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success('Deleted');
    setDeleteOpen(false);
    router.refresh();
  }

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-secondary/40">
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.alt_text || item.file_name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : isVideo ? (
            <Film className="h-10 w-10 text-muted-foreground" />
          ) : (
            <FileText className="h-10 w-10 text-muted-foreground" />
          )}

          <div className="absolute right-2 top-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 shadow-sm"
                  disabled={busy}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyLink}>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  {item.bucket === 'documents' ? 'Get download link' : 'Copy URL'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => replaceInputRef.current?.click()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Replace file
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteOpen(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <input
            ref={replaceInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleReplaceFile(file);
              e.target.value = '';
            }}
          />
        </div>

        <div className="space-y-1.5 p-3">
          <p className="truncate text-sm font-medium" title={item.file_name}>
            {item.file_name}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-[10px] capitalize">
              {isImage ? <ImageIcon className="mr-1 h-3 w-3" /> : isVideo ? <Film className="mr-1 h-3 w-3" /> : <FileText className="mr-1 h-3 w-3" />}
              {item.bucket}
            </Badge>
            {item.folder && (
              <Badge variant="outline" className="text-[10px]">
                {item.folder}
              </Badge>
            )}
            <span className="text-[11px] text-muted-foreground">{formatBytes(item.size_bytes)}</span>
          </div>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor={`alt-${item.id}`}>Alt text</Label>
              <Input
                id={`alt-${item.id}`}
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image for accessibility"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`caption-${item.id}`}>Caption</Label>
              <Textarea
                id={`caption-${item.id}`}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`folder-${item.id}`}>Folder</Label>
              <Input
                id={`folder-${item.id}`}
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                placeholder="e.g. case-studies (leave blank for none)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={busy}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={busy}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{item.file_name}&rdquo; will be permanently removed from storage. This can&apos;t be
              undone — if it&apos;s used anywhere on the site, that reference will break.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={busy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
