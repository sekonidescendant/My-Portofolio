import type { Metadata } from 'next';
import { ContactClient } from '@/components/contact/contact-client';
import { createMetadata } from '@/lib/seo';

export const metadata: Metadata = createMetadata({
  title: 'Contact',
  description:
    "Whether you're hiring for a remote role, looking for project support, or want to collaborate on something meaningful, I'd love to hear from you.",
  path: '/contact',
});

export default function ContactPage() {
  return <ContactClient />;
}
