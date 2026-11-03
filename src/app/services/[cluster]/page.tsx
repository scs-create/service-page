import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import DiscussPanel from "@/components/v2/DiscussPanel";
import RelatedCards from "@/components/v2/RelatedCards";
import WhatHappensNext from "@/components/v2/WhatHappensNext";
import { CLUSTERS, getCluster, servicesInCluster } from "@/content/v2/catalogue";
import hubs from "@/content/v2/clusters.json";
import { caseStudiesFor, guidesFor } from "@/lib/serviceRelated";
import { SERVICE_FINDER_HREF } from "@/lib/nav";

// C: Cluster hub (docs/v2/05-SITE-SPEC.md §3): what it covers → most-requested first → all services → related guides →
// related case study → What happens next → "Discuss your needs".
type Params = { cluster: string };
const COPY = hubs.clusters as Record<string, { status: string; covers: string }>;

export function generateStaticParams(): Params[] {
  return CLUSTERS.map((c) => ({ cluster: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const c = getCluster((await params).cluster);
  return c ? { title: `${c.name} services`, description: c.summary, alternates: { canonical: c.path } } : {};
}

export default async function ClusterPage({ params }: { params: Promise<Params> }) {
  const c = getCluster((await params).cluster);
  if (!c) notFound();
  const services = servicesInCluster(c.slug);
  const popular = services.filter((s) => s.mostRequested);
  const guides = guidesFor(services, 3);
  const caseStudies = caseStudiesFor(services, 1);

  return (
    <>
      <PageHero breadcrumbs={[{ label: "Services", href: "/services" }, { label: c.name }]} eyebrow="Services" title={c.name} intro={c.summary} />

      <div className="mx-auto grid max-w-[1280px] gap-14 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="flex min-w-0 flex-col gap-12">
          <section aria-labelledby="covers">
            <h2 id="covers" className="type-h2 mb-4 text-text">What this covers</h2>
            <p className="max-w-[65ch] text-text">{COPY[c.slug]?.covers}</p>
          </section>

          {popular.length > 0 && (
            <section aria-labelledby="popular">
              <h2 id="popular" className="mb-4 text-[24px] font-semibold leading-tight text-text md:text-[28px]">Most requested</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {popular.map((s) => (
                  <li key={s.id}>
                    <Link href={s.path} className="lift block h-full rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6 hover:border-primary">
                      <span className="block text-lg font-semibold text-text">{s.name} →</span>
                      <span className="mt-2 block text-sm text-muted">{s.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section aria-labelledby="all">
            <h2 id="all" className="mb-4 text-[24px] font-semibold leading-tight text-text md:text-[28px]">All {c.name} services ({services.length})</h2>
            <ul className="border-t border-border">
              {services.map((s) => (
                <li key={s.id} className="border-b border-border">
                  <Link href={s.path} className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                    <span className="font-medium text-text group-hover:text-primary">{s.name}</span>
                    <span className="text-sm text-muted sm:max-w-[48ch] sm:text-right">{s.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Not sure which one you need? <Link href={SERVICE_FINDER_HREF} className="font-medium text-primary hover:underline">Use the Service Finder →</Link>
            </p>
          </section>

          <RelatedCards guides={guides} caseStudies={caseStudies} title="Guides and work in this area" />
        </div>

        <div>
          <DiscussPanel title="Discuss your needs" text="Tell us what your organisation needs. We will confirm which services fit and send a proposal." cta="Discuss your needs" />
        </div>
      </div>

      <WhatHappensNext
        steps={[
          { title: "You get in touch", text: "Book a call or send an enquiry." },
          { title: "We understand the need", text: "We confirm which services fit your situation." },
          { title: "You receive a proposal", text: "Scope, deliverables and what is not included, in writing." },
        ]}
      />
    </>
  );
}
