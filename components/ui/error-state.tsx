'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ErrorState({
  message = 'Something went wrong.',
  className,
  onRetry,
}: {
  message?: string;
  className?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center',
        className,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-destructive/30 bg-card text-destructive">
        <AlertCircle className="h-5 w-5" />
      </span>
      <h3 className="text-base font-semibold tracking-tight">Error</h3>
      <p className="max-w-md text-sm text-muted-foreground text-pretty">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-foreground"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
