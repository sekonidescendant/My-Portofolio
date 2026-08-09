'use client';

import Link from 'next/link';
import { ArrowUp } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { Container } from '@/components/layout/container';
import { Logo } from '@/components/layout/logo';
import type { Settings } from '@/lib/types/database';

export function Footer({ settings }: { settings?: Settings | null }) {
  const year = new Date().getFullYear();

  const role = settings?.role || siteConfig.author.role;
  const email = settings?.email || siteConfig.author.email;
  const name = settings?.name || siteConfig.author.name;
  const logoUrl = settings?.logo_url || undefined;

  const socialLinks = [
    settings?.linkedin_url ? { title: 'LinkedIn', href: settings.linkedin_url } : null,
    settings?.github_url ? { title: 'GitHub', href: settings.github_url } : null,
    settings?.twitter_url ? { title: 'X', href: settings.twitter_url } : null,
    settings?.portfolio_url ? { title: 'Portfolio', href: settings.portfolio_url } : null,
  ].filter((item): item is { title: string; href: string } => !!item);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border/60 bg-background">
      <Container className="py-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-xs space-y-3">
            <Logo logoUrl={logoUrl} />
            <p className="text-sm text-muted-foreground">
              {role} · {siteConfig.author.location}
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

            {socialLinks.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Social
                </p>
                <ul className="space-y-2">
                  {socialLinks.map((item) => (
                    <li key={item.title}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Get in touch
              </p>
              <a
                href={`mailto:${email}`}
                className="block text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {year} {name}. All rights reserved.
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
