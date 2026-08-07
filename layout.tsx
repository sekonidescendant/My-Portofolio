import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/components/providers/providers';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/lib/site-config';
import { createMetadata } from '@/lib/seo';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = createMetadata();

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  jobTitle: siteConfig.author.role,
  url: siteConfig.url,
  email: `mailto:${siteConfig.author.email}`,
  address: {
    '@type': 'Place',
    name: siteConfig.author.location,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster position="bottom-right" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
