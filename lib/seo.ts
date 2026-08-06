import type { Metadata } from 'next';
import { siteConfig } from './site-config';

interface MetadataInput {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
}

export function createMetadata({
  title,
  description = siteConfig.description,
  path = '',
  image = siteConfig.ogImage,
}: MetadataInput = {}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const resolvedTitle = title ? `${title} · ${siteConfig.author.name}` : `${siteConfig.author.name} · ${siteConfig.author.role}`;
  const ogImage = image.startsWith('http') ? image : `${siteConfig.url}${image}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: resolvedTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: resolvedTitle,
      description,
      siteName: siteConfig.author.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: resolvedTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description,
      images: [ogImage],
    },
  };
}
