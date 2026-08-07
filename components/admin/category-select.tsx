'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { createCategory } from '@/lib/actions/content-actions';
import type { Category } from '@/lib/types/database';

export function CategorySelect({
  allCategories,
  selectedId,
  onChange,
  onCategoryCreated,
}: {
  allCategories: Category[];
  selectedId: string | null;
  onChange: (id: string | null) => void;
  onCategoryCreated: (category: Category) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [creating, setCreating] = useState(false);

  const selected = allCategories.find((c) => c.id === selectedId);
  const exactMatch = allCategories.some((c) => c.name.toLowerCase() === search.trim().toLowerCase());

  async function handleCreate() {
    const name = search.trim();
    if (!name) return;
    setCreating(true);
    const result = await createCategory({ name, slug: slugify(name) });
    setCreating(false);
    if (!result.success || !result.category) {
      toast.error(result.error ?? 'Could not create category');
      return;
    }
    toast.success(`Category "${name}" created`);
    setSearch('');
    onCategoryCreated(result.category);
    onChange(result.category.id);
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" className="w-full justify-between font-normal">
          {selected ? selected.name : 'No category'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <Command>
          <CommandInput placeholder="Search or create..." value={search} onValueChange={setSearch} />
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
                'No categories found.'
              )}
            </CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="__none__"
                onSelect={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                <Check className={cn('mr-2 h-4 w-4', !selectedId ? 'opacity-100' : 'opacity-0')} />
                No category
              </CommandItem>
              {allCategories.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.name}
                  onSelect={() => {
                    onChange(category.id);
                    setOpen(false);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', selectedId === category.id ? 'opacity-100' : 'opacity-0')} />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
