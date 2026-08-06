'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site-config';

export function Logo({ className }: { className?: string }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <Link
      href="/"
      className={cn(
        'group flex items-center gap-2 text-sm font-semibold tracking-tight',
        className,
      )}
      aria-label={`${siteConfig.author.name} home`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft transition-transform duration-300 group-hover:scale-105">
        <span className="text-sm font-bold">{siteConfig.author.name.charAt(0)}</span>
      </span>
      <span className="hidden sm:inline">{siteConfig.author.name}</span>
      {isHome ? null : null}
    </Link>
  );
}

export { Logo as default };
