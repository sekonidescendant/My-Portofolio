'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, ArrowUpRight, Sparkles, Play } from 'lucide-react';
import { Container } from '@/components/layout/container';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { SectionHeading } from '@/components/layout/section-heading';
import { Tag } from '@/components/ui/tag';
import { Button } from '@/components/ui/button';
import { ArticleCard } from '@/components/insights/article-card';
import {
  articleCategories,
  writingTimeline,
  videoEntries,
  type ArticleCategory,
  type ArticleData,
} from '@/lib/articles';
import { fadeUp, staggerContainer } from '@/lib/animations';

type Filter = 'All' | ArticleCategory;

const filters: Filter[] = ['All', ...articleCategories];

export function KnowledgeHubClient({ articles }: { articles: ArticleData[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchesFilter =
        activeFilter === 'All' || a.category === activeFilter;
      const matchesQuery =
        query.trim() === '' ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [articles, activeFilter, query]);

  const featured = articles[0];

  return (
    <PageWrapper>
      <Container className="space-y-24">
        {/* Hero */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="relative space-y-6"
        >
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-64 overflow-hidden">
            <div className="absolute inset-0 surface-gradient" />
            <div className="absolute inset-0 grid-bg bg-grid-pattern bg-grid-32 opacity-30" />
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
            />
          </div>
          <motion.span
            variants={fadeUp}
            className="relative inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-primary"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Knowledge Hub
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="relative max-w-3xl text-3xl font-semibold tracking-tighter text-balance md:text-5xl"
          >
            Sharing ideas on startups, operations, AI, Web3 and building communities.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="relative max-w-2xl text-base text-muted-foreground text-pretty md:text-lg"
          >
            I write about systems, startup operations, digital products, community building and emerging technologies. Most articles begin as X threads and are expanded into deeper, more structured resources.
          </motion.p>
        </motion.div>

        {/* Featured Article */}
        {featured && (
        <motion.section
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <Link
            href={`/insights/${featured.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-colors hover:border-primary/40"
          >
            <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="grid gap-0 md:grid-cols-2">
              {/* Cover */}
              <div className="relative aspect-video overflow-hidden border-b border-border bg-secondary/30 md:border-b-0 md:border-r">
                {featured.featuredImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.featuredImageUrl}
                    alt={featured.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 surface-gradient" />
                    <div className="absolute inset-0 grid-bg bg-grid-pattern bg-grid-32 opacity-20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                        Coming Soon
                      </span>
                    </div>
                  </>
                )}
                <div className="absolute left-5 top-5 flex gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </span>
                  <Tag className="bg-background/80 backdrop-blur-sm">
                    {featured.category}
                  </Tag>
                </div>
              </div>
              {/* Body */}
              <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{featured.readingTime} read</span>
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">
                  {featured.title}
                </h2>
                <p className="text-sm text-muted-foreground text-pretty md:text-base">
                  {featured.summary}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                  Read Article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        </motion.section>
        )}

        {/* Search + Categories */}
        <section className="space-y-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <motion.div
            variants={staggerContainer(0.05)}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-2"
          >
            {filters.map((filter) => (
              <motion.button
                key={filter}
                variants={fadeUp}
                onClick={() => setActiveFilter(filter)}
                className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {filter}
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* Article Grid */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Library"
            title="All Articles"
            description="Browse the full collection of articles, threads and resources."
          />
          {filtered.length > 0 ? (
            <motion.div
              variants={staggerContainer(0.06)}
              initial="hidden"
              animate="visible"
              key={activeFilter + query}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtered.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </motion.div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-secondary/20 px-6 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No articles match your search.
              </p>
            </div>
          )}
        </section>

        {/* Writing Timeline */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Journey"
            title="Writing Timeline"
            description="A look at the themes I've been writing about over time."
          />
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="relative space-y-0 border-l border-border pl-8"
          >
            {writingTimeline.map((entry, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="relative pb-10 last:pb-0"
              >
                <span className="absolute -left-[37px] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-primary bg-background" />
                <p className="text-xs font-medium uppercase tracking-widest text-primary">
                  {entry.year}
                </p>
                <p className="mt-1 text-lg font-semibold tracking-tight">
                  {entry.title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Featured Media */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Video"
            title="Featured Media"
            description="Educational videos, community events, product demos and founder stories."
          />
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {videoEntries.map((video) => (
              <motion.div
                key={video.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative aspect-video overflow-hidden border-b border-border bg-secondary/30">
                  <div className="absolute inset-0 surface-gradient" />
                  <div className="absolute inset-0 grid-bg bg-grid-pattern bg-grid-32 opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-primary backdrop-blur-sm transition-transform group-hover:scale-110">
                      <Play className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 p-4">
                  <Tag className="self-start">{video.category}</Tag>
                  <h3 className="text-sm font-semibold tracking-tight">
                    {video.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Content coming soon.
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Newsletter */}
        <motion.section
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 shadow-soft md:p-16"
        >
          <div className="pointer-events-none absolute inset-0 surface-gradient" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:items-center md:text-center">
            <motion.h2
              variants={fadeUp}
              className="max-w-2xl text-3xl font-semibold tracking-tighter text-balance md:text-4xl"
            >
              Never miss a new article.
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base text-muted-foreground text-pretty md:text-lg"
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
