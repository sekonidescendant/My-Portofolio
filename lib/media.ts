import type { MediaBucket } from '@/types';

// 'resume' deliberately excluded from these two: resume files go through the
// dedicated /admin/resume upload flow (writing to resume_files), not the
// generic Media Library (which writes to the media table) — keeping it out
// of the generic bucket list avoids two systems tracking the same files.
export const PUBLIC_BUCKETS: MediaBucket[] = ['images', 'videos'];
export const ALLOWED_BUCKETS: MediaBucket[] = ['images', 'videos', 'documents'];

export const MAX_SIZE_BYTES: Record<MediaBucket, number> = {
  images: 8 * 1024 * 1024, // 8MB
  videos: 200 * 1024 * 1024, // 200MB
  documents: 25 * 1024 * 1024, // 25MB
  resume: 10 * 1024 * 1024, // 10MB
};

export const ALLOWED_MIME: Record<MediaBucket, string[]> = {
  images: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
  videos: ['video/mp4', 'video/webm', 'video/quicktime'],
  documents: ['application/pdf'],
  resume: ['application/pdf'],
};

export function bucketForMimeType(mimeType: string): MediaBucket | null {
  if (ALLOWED_MIME.images.includes(mimeType)) return 'images';
  if (ALLOWED_MIME.videos.includes(mimeType)) return 'videos';
  if (ALLOWED_MIME.documents.includes(mimeType)) return 'documents';
  return null;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

export function maxSizeLabel(bucket: MediaBucket): string {
  return `${Math.round(MAX_SIZE_BYTES[bucket] / (1024 * 1024))}MB`;
}
