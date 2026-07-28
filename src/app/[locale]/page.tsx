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
import { ParallaxBand } from "@/components/layout/parallax-band";
import { FlightSequence } from "@/features/flight-sequence/flight-sequence";
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
  const hero = dict.hero as {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  const chapters = dict.chapters as Record<
    "one" | "two" | "three" | "four" | "five",
    { eyebrow: string; title: string; subtitle: string }
  >;
  const flight = dict.flight as {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  const bandImage = (id: string) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`;

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

      <FlightSequence
        eyebrow={flight.eyebrow}
        title={flight.title}
        subtitle={flight.subtitle}
      />

      <DestinationExplorer locale={locale} destinations={destinations} />
      <VacationPackages locale={locale} />

      <ParallaxBand
        src={bandImage("1505228395891-9a51e7e86bf6")}
        alt=""
        eyebrow={chapters.four.eyebrow}
        title={chapters.four.title}
        subtitle={chapters.four.subtitle}
      />

      <TravelCategories locale={locale} />
      <PopularExperiences locale={locale} />

      <ParallaxBand
        src={bandImage("1519046904884-53103b34b206")}
        alt=""
        eyebrow={chapters.two.eyebrow}
        title={chapters.two.title}
        subtitle={chapters.two.subtitle}
      />

      <OurPartners locale={locale} />
      <WhyChooseUs locale={locale} />
      <Testimonials locale={locale} />
      <Gallery locale={locale} />

      <ParallaxBand
        src={bandImage("1439066615861-d1af74d74000")}
        alt=""
        eyebrow={chapters.three.eyebrow}
        title={chapters.three.title}
        subtitle={chapters.three.subtitle}
      />

      <Faqs locale={locale} faqs={faqs} />
      <Contact locale={locale} />

      <ParallaxBand
        src={bandImage("1506929562872-bb421503ef21")}
        alt=""
        eyebrow={chapters.five.eyebrow}
        title={chapters.five.title}
        subtitle={chapters.five.subtitle}
      />

      <Newsletter locale={locale} />
    </>
  );
}
