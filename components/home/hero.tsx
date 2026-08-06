'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { fadeUp, staggerContainer, easing } from '@/lib/animations';
import { HeroVisual } from '@/components/home/hero-visual';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 surface-gradient" />
      <div className="pointer-events-none absolute inset-0 grid-bg bg-grid-pattern bg-grid-32 opacity-[0.35] dark:opacity-[0.12]" />
      <Container className="relative py-24 md:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="flex max-w-2xl flex-col gap-6"
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                </span>
                Available for Remote Opportunities
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl font-semibold tracking-tighter text-balance md:text-6xl"
            >
              Hi, I&apos;m Pelumi Sekoni.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-xl font-medium text-foreground/90 text-pretty md:text-2xl"
            >
              Helping startups build better operations, content systems and digital experiences.
            </motion.p>

            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base text-muted-foreground text-pretty md:text-lg"
            >
              I&apos;m a Digital Operations &amp; Project Coordinator with experience supporting startups, student communities and digital products through project coordination, operational documentation, content strategy, WordPress management and community growth.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/case-studies">
                  View My Work
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/resume">
                  <Download className="mr-1.5 h-4 w-4" />
                  Download Resume
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easing.out, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
