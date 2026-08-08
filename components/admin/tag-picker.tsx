'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, slugify } from '@/lib/utils';
import { createTag } from '@/lib/actions/content-actions';
import type { Tag } from '@/lib/types/database';

export function TagPicker({
  allTags,
  selectedIds,
  onChange,
  onTagCreated,
}: {
  allTags: Tag[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  onTagCreated: (tag: Tag) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [busy, setBusy] = useState(false);

  function toggle(id: string) {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((t) => t !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  }

  async function handleCreateTag() {
    const name = newTagName.trim();
    if (!name) return;
    setBusy(true);
    const result = await createTag({ name, slug: slugify(name) });
    setBusy(false);
    if (!result.success || !result.tag) {
      toast.error(result.error ?? 'Failed to create tag.');
      return;
    }
    onTagCreated(result.tag as Tag);
    onChange([...selectedIds, (result.tag as Tag).id]);
    setNewTagName('');
    setAdding(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {allTags.map((tag) => {
          const active = selectedIds.includes(tag.id);
          return (
            <button key={tag.id} type="button" onClick={() => toggle(tag.id)}>
              <Badge
                variant={active ? 'default' : 'outline'}
                className={cn('cursor-pointer text-xs', active && 'pr-1.5')}
              >
                {tag.name}
                {active && <X className="ml-1 h-3 w-3" />}
              </Badge>
            </button>
          );
        })}

        {adding ? (
          <div className="flex items-center gap-1.5">
            <Input
              autoFocus
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCreateTag();
                }
                if (e.key === 'Escape') {
                  setAdding(false);
                  setNewTagName('');
                }
              }}
              placeholder="New tag name"
              className="h-7 w-32 text-xs"
            />
            <Button type="button" size="sm" className="h-7 px-2 text-xs" disabled={busy} onClick={handleCreateTag}>
              Add
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-6 gap-1 rounded-full px-2 text-xs"
            onClick={() => setAdding(true)}
          >
            <Plus className="h-3 w-3" />
            New tag
          </Button>
        )}
      </div>
    </div>
  );
}
