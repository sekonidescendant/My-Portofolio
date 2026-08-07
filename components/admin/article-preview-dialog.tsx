'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { estimateReadingTime } from '@/lib/reading-time';

export function ArticlePreviewDialog({
  open,
  onOpenChange,
  title,
  featuredImageUrl,
  content,
  categoryName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  featuredImageUrl: string;
  content: string;
  categoryName?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
        </DialogHeader>

        <article className="space-y-4">
          {featuredImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={featuredImageUrl} alt="" className="aspect-video w-full rounded-lg object-cover" />
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {categoryName && <Badge variant="secondary">{categoryName}</Badge>}
            <span>{estimateReadingTime(content)}</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">{title || 'Untitled article'}</h1>

          <div
            className="space-y-4 text-sm leading-relaxed [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-3 [&_blockquote]:italic [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: content || '<p class="text-muted-foreground">Nothing written yet.</p>' }}
          />
        </article>
      </DialogContent>
    </Dialog>
  );
}
