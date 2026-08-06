import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <span className="text-xs font-medium uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="max-w-2xl text-2xl font-semibold tracking-tighter text-balance md:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="max-w-xl text-sm text-muted-foreground text-pretty md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
