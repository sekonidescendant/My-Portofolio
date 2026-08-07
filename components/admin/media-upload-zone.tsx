'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Loader2, UploadCloud, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bucketForMimeType, maxSizeLabel } from '@/lib/media';
import { uploadMediaAction } from '@/app/admin/media/actions';

type PendingUpload = {
  id: string;
  name: string;
  status: 'uploading' | 'success' | 'error';
  error?: string;
};

export function MediaUploadZone({ existingFolders }: { existingFolders: string[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [folder, setFolder] = useState('');
  const [pending, setPending] = useState<PendingUpload[]>([]);

  async function uploadFiles(files: FileList | File[]) {
    const list = Array.from(files);
    if (list.length === 0) return;

    const entries: PendingUpload[] = list.map((file) => ({
      id: `${file.name}-${crypto.randomUUID()}`,
      name: file.name,
      status: 'uploading',
    }));
    setPending((prev) => [...entries, ...prev]);

    await Promise.all(
      list.map(async (file, index) => {
        const entry = entries[index];
        const bucket = bucketForMimeType(file.type);

        if (!bucket) {
          setPending((prev) =>
            prev.map((p) =>
              p.id === entry.id ? { ...p, status: 'error', error: `Unsupported file type: ${file.type || 'unknown'}` } : p,
            ),
          );
          return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', bucket);
        formData.append('folder', folder);

        const result = await uploadMediaAction(formData);

        setPending((prev) =>
          prev.map((p) =>
            p.id === entry.id
              ? result.ok
                ? { ...p, status: 'success' }
                : { ...p, status: 'error', error: result.error }
              : p,
          ),
        );

        if (!result.ok) toast.error(`${file.name}: ${result.error}`);
      }),
    );

    router.refresh();

    // Clear finished entries after a moment so the list doesn't grow forever.
    setTimeout(() => {
      setPending((prev) => prev.filter((p) => p.status === 'uploading'));
    }, 4000);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full max-w-xs space-y-1.5">
          <Label htmlFor="upload-folder">Folder (optional)</Label>
          <Input
            id="upload-folder"
            list="existing-folders"
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            placeholder="e.g. case-studies"
          />
          <datalist id="existing-folders">
            {existingFolders.map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
        </div>
        <p className="text-xs text-muted-foreground">
          Images up to {maxSizeLabel('images')} · Videos up to {maxSizeLabel('videos')} · PDFs up to{' '}
          {maxSizeLabel('documents')}
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-border bg-secondary/30',
        )}
      >
        <UploadCloud className="h-8 w-8 text-muted-foreground" />
        <div>
          <p className="text-sm font-medium">Drag and drop files here</p>
          <p className="text-xs text-muted-foreground">or</p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          Browse files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*,video/mp4,video/webm,video/quicktime,application/pdf"
          onChange={(e) => {
            if (e.target.files?.length) uploadFiles(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {pending.length > 0 && (
        <ul className="space-y-1.5">
          {pending.map((p) => (
            <li
              key={p.id}
              className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs"
            >
              {p.status === 'uploading' && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />}
              {p.status === 'success' && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}
              {p.status === 'error' && <XCircle className="h-3.5 w-3.5 shrink-0 text-destructive" />}
              <span className="truncate">{p.name}</span>
              {p.error && <span className="ml-auto shrink-0 text-destructive">{p.error}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
