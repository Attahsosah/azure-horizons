import { notFound } from "next/navigation";

import { Section, SectionHeading } from "@/components/layout/section";
import { Reveal } from "@/components/motion";
import { PackageCard } from "@/features/packages/package-card";
import { getContentRepository } from "@/lib/data/repository";
import { pick } from "@/lib/data/types";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { resolveText } from "@/lib/i18n/resolve";

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const repo = getContentRepository();
  const [packages, dict] = await Promise.all([
    repo.getPackages(),
    getDictionary(locale),
  ]);
  const fromLabel = resolveText(dict, "sections.labels.from");
  const nightsLabel = resolveText(dict, "sections.labels.nights");
  const ctaLabel = resolveText(dict, "sections.packages.cta");

  return (
    <Section className="pt-32">
      <SectionHeading
        align="left"
        eyebrow={resolveText(dict, "detail.packagesEyebrow")}
        title={resolveText(dict, "detail.packagesTitle")}
        description={resolveText(dict, "detail.packagesDescription")}
      />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.map((p, i) => (
          <Reveal key={p.id} delay={0.05 * i}>
            <PackageCard
              href={`/${locale}/packages/${p.slug}`}
              title={pick(p.title, locale)}
              tierLabel={resolveText(dict, `tiers.${p.tier}`)}
              nights={p.nights}
              nightsLabel={nightsLabel}
              priceFrom={p.priceFrom}
              currency={p.currency}
              fromLabel={fromLabel}
              ctaLabel={ctaLabel}
              image={p.image}
              inclusions={pick(p.inclusions, locale)}
              locale={locale}
            />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
