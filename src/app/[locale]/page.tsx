import { MoveRight } from "lucide-react";
import { notFound } from "next/navigation";

import {
  AnimatedWords,
  MagneticButton,
  Reveal,
  RippleButton,
} from "@/components/motion";
import { TravelCategories } from "@/features/categories/travel-categories";
import { Contact } from "@/features/contact/contact";
import { DestinationExplorer } from "@/features/destinations/destination-explorer";
import { FeaturedDestinations } from "@/features/destinations/featured-destinations";
import { PopularExperiences } from "@/features/experiences/popular-experiences";
import { Faqs } from "@/features/faq/faqs";
import { Gallery } from "@/features/gallery/gallery";
import { Hero } from "@/features/hero-3d/hero";
import { Newsletter } from "@/features/newsletter/newsletter";
import { OurPartners } from "@/features/partners/our-partners";
import { Testimonials } from "@/features/testimonials/testimonials";
import { VacationPackages } from "@/features/packages/vacation-packages";
import { WhyChooseUs } from "@/features/why-choose-us/why-choose-us";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { JsonLd, faqLd, travelAgencyLd } from "@/lib/seo/json-ld";

/**
 * Localized landing. Hero (Phase 4) + marketing sections (Phase 6 Chunk A).
 */
export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const hero = dict.hero as Record<string, string>;

  const repo = getContentRepository();
  const [destinations, faqs] = await Promise.all([
    repo.getDestinations(),
    repo.getFaqs(),
  ]);

  const faqItems = faqs.map((f) => ({
    question: pick(f.question, locale),
    answer: pick(f.answer, locale),
  }));

  return (
    <>
      <JsonLd data={travelAgencyLd()} />
      <JsonLd data={faqLd(faqItems)} />
      <Hero>
        <Reveal direction="up">
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-fluid-sm font-medium text-white">
            {hero.badge}
          </span>
        </Reveal>

        <h1 className="mt-6 font-display text-fluid-display text-white text-balance [text-shadow:0_2px_28px_rgba(10,37,64,0.5)]">
          <AnimatedWords text={hero.title} delay={0.15} />
        </h1>

        <Reveal direction="up" delay={0.16}>
          <p className="mx-auto mt-5 max-w-xl text-fluid-lg text-white/90 text-balance [text-shadow:0_1px_16px_rgba(10,37,64,0.45)]">
            {hero.subtitle}
          </p>
        </Reveal>

        <Reveal direction="up" delay={0.24}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton className="items-center gap-2 rounded-full bg-primary px-6 py-3 text-fluid-sm font-semibold text-primary-foreground shadow-float">
              {hero.ctaPrimary}
              <MoveRight className="size-4" aria-hidden="true" />
            </MagneticButton>

            <RippleButton className="glass rounded-full px-6 py-3 text-fluid-sm font-semibold text-white">
              {hero.ctaSecondary}
            </RippleButton>
          </div>
        </Reveal>
      </Hero>

      <FeaturedDestinations locale={locale} />
      <DestinationExplorer locale={locale} destinations={destinations} />
      <VacationPackages locale={locale} />
      <TravelCategories locale={locale} />
      <PopularExperiences locale={locale} />
      <OurPartners locale={locale} />
      <WhyChooseUs locale={locale} />
      <Testimonials locale={locale} />
      <Gallery locale={locale} />
      <Faqs locale={locale} faqs={faqs} />
      <Contact locale={locale} />
      <Newsletter locale={locale} />
    </>
  );
}
