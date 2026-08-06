import { Hero } from '@/components/home/hero';
import { Statistics } from '@/components/home/statistics';
import { WhatIDo } from '@/components/home/what-i-do';
import { FeaturedExperience } from '@/components/home/featured-experience';
import { FeaturedCaseStudies } from '@/components/home/featured-case-studies';
import { FeaturedWriting } from '@/components/home/featured-writing';
import { AboutPreview } from '@/components/home/about-preview';
import { ContactCta } from '@/components/home/contact-cta';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Statistics />
      <WhatIDo />
      <FeaturedExperience />
      <FeaturedCaseStudies />
      <FeaturedWriting />
      <AboutPreview />
      <ContactCta />
    </>
  );
}
