'use client';

import { useMemo, useState } from 'react';
import { ImageIcon, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';
import type { MediaItem } from '@/types';

export function MediaPickerDialog({
  items,
  value,
  onChange,
  trigger,
}: {
  items: MediaItem[];
  value: { id: string; url: string } | null;
  onChange: (item: { id: string; url: string } | null) => void;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const images = useMemo(() => items.filter((item) => item.bucket === 'images'), [items]);

  const filtered = useMemo(() => {
    if (!search.trim()) return images;
    const q = search.trim().toLowerCase();
    return images.filter((item) => item.file_name.toLowerCase().includes(q));
  }, [images, search]);

  return (
    <>
      <div className="space-y-2">
        {value ? (
          <div className="relative w-full max-w-xs overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value.url} alt="Featured" className="aspect-video w-full object-cover" />
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute right-2 top-2 h-7 w-7"
              onClick={() => onChange(null)}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        ) : (
          <div className="flex aspect-video w-full max-w-xs items-center justify-center rounded-lg border border-dashed border-border bg-secondary/30">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div>
          {trigger ? (
            <span onClick={() => setOpen(true)}>{trigger}</span>
          ) : (
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
              {value ? 'Change image' : 'Choose from Media Library'}
            </Button>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Choose an image</DialogTitle>
          </DialogHeader>

          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images..."
              className="pl-8"
            />
          </div>

          <div className="max-h-[55vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <EmptyState
                icon={ImageIcon}
                title="No images found"
                description="Upload images in the Media Library first."
              />
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange({ id: item.id, url: item.url });
                      setOpen(false);
                    }}
                    className={cn(
                      'group relative aspect-square overflow-hidden rounded-lg border-2 transition-colors',
                      value?.id === item.id ? 'border-primary' : 'border-transparent hover:border-border',
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.alt_text || item.file_name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
