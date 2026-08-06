'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/layout/container';
import { fadeUp, staggerContainer } from '@/lib/animations';

export function ContactCta() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 shadow-soft md:p-20"
        >
          <div className="pointer-events-none absolute inset-0 surface-gradient" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:items-center md:text-center">
            <motion.h2
              variants={fadeUp}
              className="max-w-2xl text-3xl font-semibold tracking-tighter text-balance md:text-5xl"
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
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
