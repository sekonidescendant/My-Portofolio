import { cn } from '@/lib/utils';

export function Container({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-6 md:px-8', className)}>
      {children}
    </div>
  );
}
