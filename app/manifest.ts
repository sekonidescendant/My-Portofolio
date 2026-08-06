import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.author.name} · Portfolio`,
    short_name: siteConfig.author.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0f0d',
    theme_color: '#10b981',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
