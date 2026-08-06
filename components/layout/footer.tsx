'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { Container } from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';

export function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/60 bg-background">
      <Container className="py-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-xs space-y-3">
            <Logo />
            <p className="text-sm text-muted-foreground">
              {siteConfig.author.role} · {siteConfig.author.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Navigate
              </p>
              <ul className="space-y-2">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Social
              </p>
              <ul className="space-y-2">
                {siteConfig.social.map((item) => (
                  <li key={item.title}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Get in touch
              </p>
              <a
                href={`mailto:${siteConfig.author.email}`}
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {siteConfig.author.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} {siteConfig.author.name}. All rights reserved.
          </p>
          <button
            onClick={scrollToTop}
            className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to top
            <span className="flex h-6 w-6 items-center justify-center rounded-full border border-border transition-colors group-hover:border-primary group-hover:text-primary">
              <ArrowUp className="h-3 w-3" />
            </span>
          </button>
        </div>
      </Container>
    </footer>
  );
}
