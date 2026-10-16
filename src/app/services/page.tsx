import type { Metadata } from "next";
import ServiceCategory from "@/components/sections/ServiceCategory";
import PageHero from "@/components/ui/PageHero";
import CTAButton from "@/components/ui/CTAButton";
import PackagesGrid from "@/components/sections/PackagesGrid";
import LeadCapture from "@/components/sections/LeadCapture";
import { PartnershipBand, ProgrammesSection } from "@/components/sections/ServicesExtras";
import { CLUSTERS } from "@/lib/types";
import { services } from "@/content/services/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore SCS's corporate services, organised into six areas: Start & Structure, Compliance & Regulatory, Finance & Tax, People & Operations, Technology & Data, and Growth & Market Presence.",
};

export default function ServicesIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="How We Help"
        intro="Our services are organised into six areas of support. Select a category to see everything it includes."
      />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <nav aria-label="Service areas" className="mb-10 flex flex-wrap gap-2">
          {CLUSTERS.map((c) => (
            <a key={c.slug} href={`#${c.slug}`} className="min-h-11 inline-flex items-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-text hover:border-primary hover:text-primary">
              {c.name}
            </a>
          ))}
        </nav>

        {CLUSTERS.map((cluster) => (
          <section key={cluster.slug} id={cluster.slug} className="mb-12">
            <h2 className="text-2xl font-semibold text-secondary mb-4 pl-4 border-l-4 border-accent">{cluster.name}</h2>
            <div className="space-y-3">
              {services
                .filter((s) => s.cluster === cluster.slug)
                .map((service) => (
                  <ServiceCategory key={service.slug} mode="accordion" headingLevel="h3" data={service} />
                ))}
            </div>
          </section>
        ))}

        <div className="mt-8 rounded-md bg-surface border border-border p-6 flex flex-wrap items-center gap-4">
          <p className="text-text font-medium">Not sure which service fits? Tell us about your business.</p>
          <CTAButton booking label="Book a Discovery Call" />
        </div>
      </div>
      <ProgrammesSection />
      <PackagesGrid />
      <PartnershipBand />
      <LeadCapture />
    </>
  );
}
