import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { services, getServiceBySlug } from "@/content/services/data";
import { getPortfolioForService } from "@/content/portfolio/data";
import ServiceCategory from "@/components/sections/ServiceCategory";
import CaseStudyCard from "@/components/ui/CaseStudyCard";
import { IpShowcase } from "@/components/sections/ServicesExtras";
import { ipVisible } from "@/content/loaders";
import PageHero from "@/components/ui/PageHero";
import CTAButton from "@/components/ui/CTAButton";
import JsonLd from "@/components/ui/JsonLd";
import TrackServiceView from "@/components/ui/TrackServiceView";
import { CLUSTERS } from "@/lib/types";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return {};
  return { title: service.title, description: service.framingSentence };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const clusterName = CLUSTERS.find((c) => c.slug === service.cluster)?.name;
  const related = services.filter((s) => s.cluster === service.cluster && s.slug !== service.slug).slice(0, 3);
  const work = getPortfolioForService(service.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.framingSentence,
          provider: { "@type": "ProfessionalService", name: SITE.legalName, url: SITE.url },
          areaServed: "Nigeria",
        }}
      />
      <TrackServiceView serviceName={service.title} />
      <PageHero breadcrumbs={[{ label: "Services", href: "/services" }, { label: service.title }]} eyebrow={clusterName} title={service.title} intro={service.framingSentence} />

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 items-start">
        <div>
          <ServiceCategory mode="full" showHeader={false} data={service} />

          {service.slug === "intellectual-property-and-brand-asset-management" && <IpShowcase items={ipVisible} />}

          {work.length > 0 && (
            <section className="mt-14 pt-10 border-t border-border">
              <h2 className="text-xl font-semibold text-text mb-6">Selected work in this area</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {work.map((e) => (
                  <CaseStudyCard key={e.slug} entry={e} variant="compact" />
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-14 pt-10 border-t border-border">
              <h2 className="text-xl font-semibold text-text mb-6">Related services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map((s) => (
                  <ServiceCategory key={s.slug} mode="condensed" data={s} headingLevel="h3" />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="dark-surface bg-secondary text-white rounded-md border-t-4 border-accent p-6 lg:sticky lg:top-28">
          <h2 className="text-xl font-semibold">Discuss this service</h2>
          <p className="mt-2 text-sm text-white/85">Speak with our team about how this applies to your business.</p>
          <div className="mt-5 flex flex-col gap-3">
            <CTAButton booking label="Book a Discovery Call" variant="accent" />
            <CTAButton href="/contact" label="Get in Touch" variant="outlineLight" />
          </div>
          <p className="mt-5 text-sm text-white/85 space-y-1">
            <a href={`tel:${SITE.phoneHref}`} className="block underline hover:text-accent">{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="block underline hover:text-accent break-all">{SITE.email}</a>
          </p>
        </aside>
      </div>
    </>
  );
}
