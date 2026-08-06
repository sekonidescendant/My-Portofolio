import type { Metadata } from 'next';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Not Found',
  description: 'The page you are looking for does not exist.',
});

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="text-xs font-medium uppercase tracking-widest text-primary">
        404
      </span>
      <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl">
        Page not found
      </h1>
      <p className="max-w-md text-sm text-muted-foreground text-pretty">
        The page you&apos;re looking for may have moved or never existed.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4"
      >
        Back home
      </a>
    </div>
  );
}
