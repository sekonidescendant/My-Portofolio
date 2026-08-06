import { cn } from '@/lib/utils';

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary',
        className,
      )}
    >
      <span className="h-px w-6 bg-primary/60" />
      {children}
    </span>
  );
}
