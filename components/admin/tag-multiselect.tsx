'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { slugify } from '@/lib/slugify';
import { createTag } from '@/lib/actions/content-actions';
import type { Tag } from '@/lib/types/database';

export function TagMultiSelect({
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
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);

  const selected = allTags.filter((t) => selectedIds.includes(t.id));
  const exactMatch = allTags.some((t) => t.name.toLowerCase() === search.trim().toLowerCase());

  function toggle(id: string) {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  }

  async function handleCreate() {
    const name = search.trim();
    if (!name) return;
    setCreating(true);
    const slug = slugify(name);
    const result = await createTag({ name, slug });
    setCreating(false);
    if (!result.success || !result.tag) {
      toast.error(result.error ?? 'Could not create tag');
      return;
    }
    toast.success(`Tag "${name}" created`);
    setSearch('');
    onTagCreated(result.tag);
    onChange([...selectedIds, result.tag.id]);
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-between font-normal"
          >
            {selected.length > 0 ? `${selected.length} tag${selected.length > 1 ? 's' : ''} selected` : 'Select tags...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0">
          <Command>
            <CommandInput placeholder="Search or create a tag..." value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>
                {search.trim() && !exactMatch ? (
                  <button
                    type="button"
                    onClick={handleCreate}
                    disabled={creating}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-secondary"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Create &ldquo;{search.trim()}&rdquo;
                  </button>
                ) : (
                  'No tags found.'
                )}
              </CommandEmpty>
              <CommandGroup>
                {allTags.map((tag) => (
                  <CommandItem key={tag.id} value={tag.name} onSelect={() => toggle(tag.id)}>
                    <Check
                      className={cn('mr-2 h-4 w-4', selectedIds.includes(tag.id) ? 'opacity-100' : 'opacity-0')}
                    />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="gap-1">
              {tag.name}
              <button type="button" onClick={() => toggle(tag.id)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
