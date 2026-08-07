'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { ImagePlus, Loader2, UploadCloud, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { listImageMediaAction, uploadMediaAction } from '@/app/admin/media/actions';

type MediaOption = { id: string; url: string; file_name: string; alt_text: string };

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (item: { id: string; url: string }) => void;
}) {
  const [items, setItems] = useState<MediaOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    listImageMediaAction().then((result) => {
      setLoading(false);
      if (result.ok) setItems(result.items);
      else toast.error(result.error);
    });
  }, [open]);

  async function handleUpload(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', 'images');
    formData.append('folder', 'articles');
    const result = await uploadMediaAction(formData);
    setUploading(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    const refreshed = await listImageMediaAction();
    if (refreshed.ok) setItems(refreshed.items);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a featured image</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Pick from your media library, or upload a new one.</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <UploadCloud className="mr-2 h-3.5 w-3.5" />
            )}
            Upload new
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = '';
            }}
          />
        </div>

        <div className="grid max-h-96 grid-cols-3 gap-3 overflow-y-auto sm:grid-cols-4">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-10 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <ImagePlus className="h-6 w-6" />
              <p className="text-xs">No images yet — upload one above.</p>
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect({ id: item.id, url: item.url });
                  onOpenChange(false);
                }}
                className="group relative aspect-square overflow-hidden rounded-md border border-border"
                title={item.file_name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt_text || item.file_name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ClearableFeaturedImage({
  url,
  onClear,
}: {
  url: string;
  onClear: () => void;
}) {
  return (
    <div className="relative w-full max-w-xs overflow-hidden rounded-md border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="Featured" className="aspect-video w-full object-cover" />
      <Button
        type="button"
        size="icon"
        variant="secondary"
        className="absolute right-2 top-2 h-7 w-7"
        onClick={onClear}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
