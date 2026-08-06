'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mail,
  Linkedin,
  Twitter,
  Clock,
  Users,
  FileText,
  Layers,
  MessageSquare,
  GraduationCap,
  Zap,
  Download,
  Calendar,
  FileBadge,
  Briefcase,
  Globe,
  Github,
} from 'lucide-react';
import { Container } from '@/components/layout/container';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { SectionHeading } from '@/components/layout/section-heading';
import { Button } from '@/components/ui/button';
import { Tag } from '@/components/ui/tag';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { ContactForm } from '@/components/contact/contact-form';
import { siteConfig } from '@/lib/site-config';
import { fadeUp, staggerContainer } from '@/lib/animations';

const contactCards = [
  {
    icon: Mail,
    label: 'Email',
    value: siteConfig.author.email,
    href: `mailto:${siteConfig.author.email}`,
    note: 'Response time: Usually within 24 hours',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'Connect professionally',
    href: '#',
    note: 'Send a connection request',
  },
  {
    icon: Twitter,
    label: 'X (Twitter)',
    value: 'Let\'s talk about startups, operations and technology',
    href: '#',
    note: 'Open to DMs',
  },
];

const trustCards = [
  { icon: Briefcase, title: 'Ownership', description: 'I take responsibility for projects from planning to execution.' },
  { icon: FileText, title: 'Documentation', description: 'I create clear documentation that helps teams work efficiently.' },
  { icon: Layers, title: 'Systems Thinking', description: 'I focus on repeatable processes instead of one-time solutions.' },
  { icon: MessageSquare, title: 'Communication', description: 'I prioritize clarity, collaboration and transparency.' },
  { icon: GraduationCap, title: 'Continuous Learning', description: 'I constantly improve my skills and adapt to new tools.' },
  { icon: Zap, title: 'Execution', description: 'I enjoy turning ideas into measurable outcomes.' },
];

const impactMetrics = [
  { value: '30 → 190', label: 'Verrsa iOS Downloads', description: 'Grew iOS downloads in one week through a coordinated launch strategy.' },
  { value: '20', label: 'Writers Coordinated', description: 'Onboarded and managed 20 writers into a repeatable content system.' },
  { value: '6', label: 'Community Events', description: 'Organized 6 events for Blockchain FUOYE with consistent attendance.' },
  { value: '2,000+', label: 'Students Reached', description: 'Reached over 2,000 attendees across community events.' },
  { value: '50 → 200+', label: 'Blockchain FUOYE Growth', description: 'Grew the student community from 50 to over 200 members.' },
  { value: '700 → 1,700+', label: 'Community Growth', description: 'Grew an online community from 700 to over 1,700 members.' },
];

const events = [
  { title: 'Blockchain FUOYE Events', description: 'Organized events that brought blockchain education to FUOYE students.', date: 'Date coming soon' },
  { title: 'LaunchMyNFT Event', description: 'Supported event operations and community engagement.', date: 'Date coming soon' },
  { title: 'Peaq Network Workshop', description: 'Facilitated a workshop on Web3 and blockchain technology.', date: 'Date coming soon' },
  { title: 'Community Meetups', description: 'Coordinated regular meetups for student and developer communities.', date: 'Date coming soon' },
  { title: 'Educational Sessions', description: 'Led educational content sessions for community members.', date: 'Date coming soon' },
];

const documents = [
  { title: 'Verrsa Launch Strategy', summary: 'The launch strategy document that coordinated Verrsa\'s product launch.', category: 'Operations' },
  { title: 'Verrsa Social Media Manager Guide', summary: 'A documented playbook for social media managers at Verrsa.', category: 'Documentation' },
  { title: 'Blockchain FUOYE Partnership Proposal', summary: 'A proposal outlining partnership opportunities for the community.', category: 'Community' },
  { title: 'Blockchain FUOYE Project Proposal', summary: 'A project proposal for community initiatives and events.', category: 'Community' },
];

const socialLinks = [
  { icon: Globe, label: 'Portfolio', value: siteConfig.url, href: '/' },
  { icon: Github, label: 'GitHub', value: 'Coming Soon', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', value: 'Connect', href: '#' },
  { icon: Twitter, label: 'X', value: 'Follow', href: '#' },
  { icon: Mail, label: 'Email', value: siteConfig.author.email, href: `mailto:${siteConfig.author.email}` },
];

const faqs = [
  { q: 'What type of roles are you looking for?', a: 'I\'m focused on Digital Operations, Project Coordination, Community Management, and Content Operations roles — anything where I can help teams build systems and ship work.' },
  { q: 'Are you available for remote work?', a: 'Yes. I\'m fully open to remote opportunities and have worked with distributed teams across different projects.' },
  { q: 'What industries interest you?', a: 'Startups, Web3, AI, education, and community-driven products. I\'m most useful where operations and content meet growth.' },
  { q: 'Can you work with startups?', a: 'Absolutely. Most of my experience has been with early-stage teams where ownership, documentation, and execution matter most.' },
  { q: 'Can you work across time zones?', a: 'Yes. I\'m comfortable working across time zones and have coordinated teams and communities in different regions.' },
];

export function ContactClient() {
  return (
    <PageWrapper>
      <Container className="space-y-24">
        {/* Hero */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.span
            variants={fadeUp}
            className="text-xs font-medium uppercase tracking-widest text-primary"
          >
            Contact
          </motion.span>
          <motion.h1
            variants={fadeUp}
            className="max-w-3xl text-3xl font-semibold tracking-tighter text-balance md:text-5xl"
          >
            Let&apos;s Build Something Great Together
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="max-w-2xl text-base text-muted-foreground text-pretty md:text-lg"
          >
            Whether you&apos;re hiring for a remote role, looking for project support, or want to collaborate on something meaningful, I&apos;d love to hear from you.
          </motion.p>
        </motion.div>

        {/* Contact Cards */}
        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          animate="visible"
          className="grid gap-5 sm:grid-cols-3"
        >
          {contactCards.map((card) => (
            <motion.a
              key={card.label}
              href={card.href}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
            >
              <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                <card.icon className="h-5 w-5" />
              </span>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {card.label}
              </p>
              <p className="text-sm font-medium text-foreground text-pretty">
                {card.value}
              </p>
              <p className="text-xs text-muted-foreground">{card.note}</p>
            </motion.a>
          ))}
        </motion.div>

        {/* Contact Form */}
        <section className="grid gap-12 lg:grid-cols-5 lg:items-start">
          <div className="space-y-4 lg:col-span-2">
            <SectionHeading
              eyebrow="Get in touch"
              title="Send a Message"
              description="Fill out the form and I'll get back to you as soon as possible."
            />
            <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Usually responds within 24 hours
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
              <ContactForm />
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Why Me"
            title="Why People Work With Me"
            description="The principles that guide how I work with teams and projects."
          />
          <motion.div
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {trustCards.map((card) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <card.icon className="h-5 w-5" />
                </span>
                <h3 className="text-base font-semibold tracking-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Featured Impact */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Impact"
            title="Featured Impact"
            description="Measurable outcomes from roles and projects I've contributed to."
          />
          <motion.div
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {impactMetrics.map((m) => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <p className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                  {m.value}
                </p>
                <p className="text-sm font-semibold tracking-tight">{m.label}</p>
                <p className="text-sm text-muted-foreground text-pretty">
                  {m.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Events & Community */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Appearances"
            title="Events & Community"
            description="Events, workshops, and community sessions I've been part of."
          />
          <motion.div
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {events.map((event) => (
              <motion.div
                key={event.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="relative aspect-video overflow-hidden border-b border-border bg-secondary/30">
                  <div className="absolute inset-0 surface-gradient" />
                  <div className="absolute inset-0 grid-bg bg-grid-pattern bg-grid-32 opacity-20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                      Photo coming soon
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </div>
                  <h3 className="text-base font-semibold tracking-tight">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Selected Work / Documents */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Documents"
            title="Selected Work"
            description="Key documents and guides created across roles."
          />
          <motion.div
            variants={staggerContainer(0.07)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid gap-5 sm:grid-cols-2"
          >
            {documents.map((doc) => (
              <motion.div
                key={doc.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative flex h-32 items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-secondary/20">
                  <div className="absolute inset-0 surface-gradient" />
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground">
                    <FileBadge className="h-5 w-5" />
                  </span>
                </div>
                <div className="space-y-2">
                  <Tag>{doc.category}</Tag>
                  <h3 className="text-base font-semibold tracking-tight">
                    {doc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {doc.summary}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="mt-auto" disabled>
                  View Document
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Social Links */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Connect"
            title="Social Links"
            description="Find me across the platforms I use."
          />
          <motion.div
            variants={staggerContainer(0.06)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border border-border bg-card p-5 text-center shadow-soft transition-colors hover:border-primary/40"
              >
                <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary/60 text-primary transition-colors group-hover:border-primary/40 group-hover:bg-primary/10">
                  <link.icon className="h-5 w-5" />
                </span>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold tracking-tight">
                    {link.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{link.value}</p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </section>

        {/* FAQ */}
        <section className="space-y-8">
          <SectionHeading
            eyebrow="Questions"
            title="FAQ"
            description="Common questions about working with me."
          />
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="rounded-xl border border-border bg-card p-6 shadow-soft md:p-8"
          >
            <Accordion type="single" collapsible className="space-y-0">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left text-base font-medium">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground text-pretty md:text-base">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </section>

        {/* Final CTA */}
        <motion.section
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-10 shadow-soft md:p-16"
        >
          <div className="pointer-events-none absolute inset-0 surface-gradient" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative flex flex-col items-start gap-6 md:items-center md:text-center">
            <motion.h2
              variants={fadeUp}
              className="max-w-2xl text-3xl font-semibold tracking-tighter text-balance md:text-4xl"
            >
              Let&apos;s Build Something Meaningful
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="max-w-xl text-base text-muted-foreground text-pretty md:text-lg"
            >
              I&apos;m always interested in opportunities where I can help teams improve operations, documentation, project execution and digital growth.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Button asChild size="lg">
                <a href={`mailto:${siteConfig.author.email}`}>
                  <Mail className="mr-1.5 h-4 w-4" />
                  Contact Me
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/resume">
                  <Download className="mr-1.5 h-4 w-4" />
                  Download Resume
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </Container>
    </PageWrapper>
  );
}
