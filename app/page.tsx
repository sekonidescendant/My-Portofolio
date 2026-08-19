import { Hero } from '@/components/home/hero';
import { Statistics } from '@/components/home/statistics';
import { WhatIDo } from '@/components/home/what-i-do';
import { FeaturedExperience } from '@/components/home/featured-experience';
import { FeaturedCaseStudies } from '@/components/home/featured-case-studies';
import { FeaturedWriting } from '@/components/home/featured-writing';
import { AboutPreview } from '@/components/home/about-preview';
import { ContactCta } from '@/components/home/contact-cta';
import { articleService } from '@/lib/services/article-service';
import { toArticleData } from '@/lib/articles-db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const dbArticles = await articleService.getPublished();
  const latestArticles = dbArticles.slice(0, 3).map(toArticleData);

  return (
    <>
      <Hero />
      <Statistics />
      <WhatIDo />
      <FeaturedExperience />
      <FeaturedCaseStudies />
      <FeaturedWriting articles={latestArticles} />
      <AboutPreview />
      <ContactCta />
    </>
  );
}
