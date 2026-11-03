import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import CTAButton from "@/components/ui/CTAButton";
import PackagesGrid from "@/components/sections/PackagesGrid";
import LeadCapture from "@/components/sections/LeadCapture";
import { PartnershipBand, ProgrammesSection } from "@/components/sections/ServicesExtras";
import { CLUSTERS, SERVICES, servicesInCluster } from "@/content/v2/catalogue";
import { SERVICE_FINDER_HREF } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Services",
  description: `${SERVICES.length} corporate services and business support services in ${CLUSTERS.length} areas: ${CLUSTERS.map((c) => c.name).join(", ")}.`,
  alternates: { canonical: "/services" },
};

// Services index (v2): the Service Finder is the main way in (strategy §4), then the 7 clusters with their
// most-requested services first. The v1 programmes, packages, partnership band and lead capture stay below.
export default function ServicesIndexPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Services" }]}
        eyebrow="Services"
        title="How we help"
        intro={`${SERVICES.length} services in ${CLUSTERS.length} areas, from registering a company to running its operations and growing it. Each one is scoped in writing before work starts.`}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <CTAButton href={SERVICE_FINDER_HREF} label="Find the right service" />
          <CTAButton booking label="Book a Discovery Call" variant="text" />
        </div>
      </PageHero>

      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
        <h2 className="type-h2 text-text">Seven areas of support</h2>
        <span aria-hidden="true" className="mb-10 mt-4 block h-1 w-14 rounded-sm bg-accent" />
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CLUSTERS.map((c) => {
            const list = servicesInCluster(c.slug);
            return (
              <li key={c.slug} className="flex flex-col rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6">
                <h3 className="text-xl font-semibold text-text">
                  <Link href={c.path} className="hover:text-primary">{c.name}</Link>
                </h3>
                <p className="mt-2 text-sm text-muted">{c.summary}</p>
                <ul className="mt-4 flex-1 space-y-1.5 text-sm">
                  {list.slice(0, 3).map((s) => (
                    <li key={s.id}><Link href={s.path} className="text-primary hover:underline">{s.name}</Link></li>
                  ))}
                </ul>
                <Link href={c.path} className="mt-5 text-sm font-medium text-text hover:text-primary hover:underline">
                  All {list.length} services →
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4 rounded-sm border border-border bg-surface p-6">
          <p className="font-medium text-text">Not sure which service fits? Tell us about your organisation.</p>
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
