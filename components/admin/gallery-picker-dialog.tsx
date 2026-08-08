'use client';

import { useMemo, useState } from 'react';
import { ImageIcon, Plus, Search, X } from 'lucide-react';
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

export function GalleryPickerDialog({
  items,
  value,
  onChange,
}: {
  items: MediaItem[];
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const images = useMemo(() => items.filter((item) => item.bucket === 'images'), [items]);

  const filtered = useMemo(() => {
    if (!search.trim()) return images;
    const q = search.trim().toLowerCase();
    return images.filter((item) => item.file_name.toLowerCase().includes(q));
  }, [images, search]);

  function toggle(url: string) {
    if (value.includes(url)) {
      onChange(value.filter((u) => u !== url));
    } else {
      onChange([...value, url]);
    }
  }

  return (
    <>
      <div className="space-y-3">
        {value.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {value.map((url) => (
              <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute right-1 top-1 h-6 w-6"
                  onClick={() => onChange(value.filter((u) => u !== url))}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          {value.length > 0 ? 'Add more images' : 'Add images from Media Library'}
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-hidden">
          <DialogHeader>
            <DialogTitle>Choose gallery images</DialogTitle>
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

          <div className="max-h-[50vh] overflow-y-auto">
            {filtered.length === 0 ? (
              <EmptyState
                icon={ImageIcon}
                title="No images found"
                description="Upload images in the Media Library first."
              />
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {filtered.map((item) => {
                  const selected = value.includes(item.url);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggle(item.url)}
                      className={cn(
                        'group relative aspect-square overflow-hidden rounded-lg border-2 transition-colors',
                        selected ? 'border-primary' : 'border-transparent hover:border-border',
                      )}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.url}
                        alt={item.alt_text || item.file_name}
                        className="h-full w-full object-cover"
                      />
                      {selected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-primary/40">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            ✓
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <Button type="button" size="sm" onClick={() => setOpen(false)} className="mt-2">
            Done ({value.length} selected)
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
