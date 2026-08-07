'use client';

import { useMemo, useState } from 'react';
import { Search, Image as ImageIcon } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MediaItemCard } from '@/components/admin/media-item-card';
import { MediaUploadZone } from '@/components/admin/media-upload-zone';
import type { MediaBucket, MediaItem } from '@/types';

type BucketFilter = MediaBucket | 'all';

export function MediaLibrary({ initialItems }: { initialItems: MediaItem[] }) {
  const [bucketFilter, setBucketFilter] = useState<BucketFilter>('all');
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const folders = useMemo(() => {
    const set = new Set<string>();
    initialItems.forEach((item) => {
      if (item.folder) set.add(item.folder);
    });
    return Array.from(set).sort();
  }, [initialItems]);

  const filtered = useMemo(() => {
    return initialItems.filter((item) => {
      if (bucketFilter !== 'all' && item.bucket !== bucketFilter) return false;
      if (folderFilter !== 'all') {
        if (folderFilter === '__none__' ? item.folder : item.folder !== folderFilter) return false;
      }
      if (search.trim() && !item.file_name.toLowerCase().includes(search.trim().toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [initialItems, bucketFilter, folderFilter, search]);

  return (
    <Container className="space-y-8 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Media Library</h1>
        <p className="text-sm text-muted-foreground">Upload and manage images, videos and documents.</p>
      </div>

      <MediaUploadZone existingFolders={folders} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={bucketFilter} onValueChange={(v) => setBucketFilter(v as BucketFilter)}>
          <TabsList>
            <TabsTrigger value="all">All ({initialItems.length})</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={folderFilter} onValueChange={setFolderFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All folders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All folders</SelectItem>
              <SelectItem value="__none__">No folder</SelectItem>
              {folders.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search file name..."
              className="w-full pl-8 sm:w-56"
            />
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title={initialItems.length === 0 ? 'No media yet' : 'No files match your filters'}
          description={
            initialItems.length === 0
              ? 'Uploaded images, videos and documents will appear here.'
              : 'Try a different search term, folder, or file type.'
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <MediaItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </Container>
  );
}
