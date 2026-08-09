'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { fadeUp, staggerContainer } from '@/lib/animations';
import { contactSchema, type ContactFormValues } from '@/lib/validations';
import { submitContactMessage } from '@/lib/actions/contact-actions';
import { siteConfig } from '@/lib/site-config';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formRenderedAt] = useState(() => Date.now());

  const [honeypot, setHoneypot] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      role: '',
      message: '',
      jobOpportunity: false,
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitError(null);
    const result = await submitContactMessage({
      name: values.name,
      email: values.email,
      company: values.company || undefined,
      role: values.role || undefined,
      message: values.message,
      job_opportunity: values.jobOpportunity ?? false,
      honeypot,
      formRenderedAt,
    });
    if (result.success) {
      reset();
      setSubmitted(true);
    } else {
      setSubmitError(result.error ?? 'Failed to send message.');
    }
  };

  if (submitted) {
    return (
      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center gap-4 py-12 text-center"
      >
        <motion.span
          variants={fadeUp}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary"
        >
          <CheckCircle2 className="h-8 w-8" />
        </motion.span>
        <motion.h3 variants={fadeUp} className="text-xl font-semibold tracking-tight">
          Message Sent
        </motion.h3>
        <motion.p
          variants={fadeUp}
          className="max-w-md text-sm text-muted-foreground text-pretty"
        >
          Thanks for reaching out. I typically respond within 24 hours.
        </motion.p>
        <motion.div variants={fadeUp}>
          <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
            Send Another Message
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.form
      variants={staggerContainer(0.06)}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      noValidate
    >
      {/* Honeypot: hidden from real visitors, bots that auto-fill every field trip it. */}
      <div style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <motion.div variants={fadeUp} className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" {...register('name')} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </motion.div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <motion.div variants={fadeUp} className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Company or team" {...register('company')} />
        </motion.div>

        <motion.div variants={fadeUp} className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" placeholder="Your role" {...register('role')} />
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Tell me about the role or project..."
          {...register('message')}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </motion.div>

      <motion.div variants={fadeUp} className="flex items-center gap-2.5">
        <Checkbox id="jobOpportunity" {...register('jobOpportunity')} />
        <Label htmlFor="jobOpportunity" className="text-sm text-muted-foreground">
          I&apos;m interested in discussing a job opportunity.
        </Label>
      </motion.div>

      {submitError && (
        <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {submitError}
        </p>
      )}

      <motion.div variants={fadeUp} className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
        <Button type="button" size="lg" variant="outline">
          <Calendar className="mr-1.5 h-4 w-4" />
          Schedule a Conversation
        </Button>
      </motion.div>

      <p className="text-xs text-muted-foreground">
        Or email directly at{' '}
        <a
          href={`mailto:${siteConfig.author.email}`}
          className="text-foreground underline underline-offset-4"
        >
          {siteConfig.author.email}
        </a>
      </p>
    </motion.form>
  );
}
