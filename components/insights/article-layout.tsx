'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Clock, Calendar } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/insights/article-card';
import { siteConfig } from '@/lib/site-config';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { markdownToHtml } from '@/lib/markdown';
import type { ArticleData } from '@/lib/articles';

function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-16 z-50 h-0.5 origin-left bg-primary"
    />
  );
}

function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const url = `${siteConfig.url}/insights/${slug}`;
  const links = [
    {
      label: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Copy',
      href: '#',
    },
  ];

  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
        Share
      </span>
      {links.map((link) => (
        <button
          key={link.label}
          onClick={(e) => {
            if (link.label === 'Copy') {
              e.preventDefault();
              navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
              return;
            }
            window.open(link.href, '_blank', 'noopener,noreferrer');
          }}
          className="inline-flex h-8 items-center rounded-md border border-border bg-card px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          {link.label === 'Copy' && copied ? 'Copied!' : link.label}
        </button>
      ))}
    </div>
  );
}

export function ArticleLayout({
  article,
  related,
}: {
  article: ArticleData;
  related: ArticleData[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <PageWrapper>
      {mounted && <ReadingProgressBar />}
      <Container className="space-y-20">
        {/* Hero */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3">
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowRight className="h-3.5 w-3.5 rotate-180" />
              Knowledge Hub
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
            <Tag>{article.category}</Tag>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Clock className="h-3 w-3" />
              {article.readingTime}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(article.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="max-w-3xl text-3xl font-semibold tracking-tighter text-balance md:text-5xl"
          >
            {article.title}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-base text-muted-foreground text-pretty md:text-lg"
          >
            {article.summary}
          </motion.p>
          <motion.div variants={fadeUp}>
            <ShareButtons title={article.title} slug={article.slug} />
          </motion.div>
        </motion.div>

        {/* Cover */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="relative aspect-[2/1] overflow-hidden rounded-2xl border border-border bg-secondary/30"
        >
          {article.featuredImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.featuredImageUrl} alt={article.title} className="h-full w-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0 surface-gradient" />
              <div className="absolute inset-0 grid-bg bg-grid-pattern bg-grid-32 opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                  Content coming soon
                </span>
              </div>
            </>
          )}
        </motion.div>

        {/* Body */}
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Estimated Reading Time
              </p>
              <p className="text-sm font-medium text-foreground">
                {article.readingTime}
              </p>
            </div>
          </aside>

          {/* Article content */}
          <div className="space-y-8">
            {article.content ? (
              <div
                className="md-preview"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(article.content) }}
              />
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-secondary/20 px-6 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Content coming soon.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Author section */}
        <motion.section
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="rounded-xl border border-border bg-card p-8 shadow-soft"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 text-lg font-bold text-primary">
              PS
            </span>
            <div className="space-y-1">
              <p className="text-base font-semibold tracking-tight">
                {siteConfig.author.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {siteConfig.author.role} · {siteConfig.author.location}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Newsletter CTA placeholder */}
        <motion.section
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 shadow-soft md:p-14"
        >
          <div className="pointer-events-none absolute inset-0 surface-gradient" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:items-center md:text-center">
            <motion.h2
              variants={fadeUp}
              className="max-w-2xl text-2xl font-semibold tracking-tighter text-balance md:text-3xl"
            >
              Never miss a new article.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-sm text-muted-foreground text-pretty md:text-base"
            >
              I&apos;m documenting lessons from startups, operations, AI and community building as I continue learning and growing.
            </motion.p>
            <motion.form
              variants={fadeUp}
              className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@example.com"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit" size="lg" className="shrink-0">
                Subscribe
              </Button>
            </motion.form>
          </div>
        </motion.section>

        {/* Comments placeholder */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="rounded-xl border border-dashed border-border bg-secondary/20 px-6 py-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Comments coming soon.
          </p>
        </motion.section>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight">
                Related Articles
              </h2>
              <Link
                href="/insights"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                All articles
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <motion.div
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </motion.div>
          </section>
        )}

        {/* Contact CTA */}
        <motion.section
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 shadow-soft md:p-16"
        >
          <div className="pointer-events-none absolute inset-0 surface-gradient" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:items-center md:text-center">
            <motion.h2
              variants={fadeUp}
              className="max-w-2xl text-3xl font-semibold tracking-tighter text-balance md:text-4xl"
            >
              Let&apos;s build something meaningful.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base text-muted-foreground text-pretty md:text-lg"
            >
              Whether you&apos;re hiring, collaborating or building something ambitious, I&apos;d love to hear from you.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Button asChild size="lg">
                <Link href="/contact">
                  Get In Touch
                  <ArrowUpRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </Container>
    </PageWrapper>
  );
}
