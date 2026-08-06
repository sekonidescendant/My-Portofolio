import { cn } from '@/lib/utils';

export function PageWrapper({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('min-h-screen pb-24 pt-28 md:pt-32', className)}>
      {children}
    </div>
  );
}
