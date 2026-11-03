import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import JsonLd from "@/components/ui/JsonLd";
import { SITE } from "@/lib/site";
import DiscussPanel from "@/components/v2/DiscussPanel";
import RelatedCards from "@/components/v2/RelatedCards";
import WhatHappensNext from "@/components/v2/WhatHappensNext";
import { SERVICES, getService } from "@/content/v2/catalogue";
import { caseStudiesFor, guidesFor } from "@/lib/serviceRelated";

// S: Service page (docs/v2/05-SITE-SPEC.md §3, design/Service.dc.html). No fees and no delivery timelines.
type Params = { cluster: string; service: string };

export function generateStaticParams(): Params[] {
  return SERVICES.map((s) => ({ cluster: s.cluster, service: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { cluster, service } = await params;
  const s = getService(cluster, service);
  return s ? { title: s.name, description: s.summary, alternates: { canonical: s.path } } : {};
}

const CHECK = (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.25" className="mt-1 flex-none">
    <path d="M5 12l5 5L20 7" />
  </svg>
);
const H2 = "mb-4 text-[24px] font-semibold leading-tight text-text md:text-[28px]";

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { cluster, service } = await params;
  const s = getService(cluster, service);
  if (!s) notFound();
  const { copy } = s;
  const guides = guidesFor([s], 1);
  const caseStudies = caseStudiesFor([s], 1);

  return (
    <article data-service-id={s.id}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: s.name,
          description: s.summary,
          serviceType: s.clusterName,
          url: `${SITE.url}${s.path}`,
          provider: { "@id": `${SITE.url}/#organization` },
          areaServed: ["Nigeria", "Worldwide"],
        }}
      />
      <PageHero
        breadcrumbs={[{ label: "Services", href: "/services" }, { label: s.clusterName, href: `/services/${s.cluster}` }, { label: s.name }]}
        title={s.name}
        intro={s.summary}
        meta={`Service ID ${s.id} · Delivered in person in Abuja or remotely, wherever you are`}
      />

      <div className="mx-auto grid max-w-[1280px] gap-14 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="flex min-w-0 flex-col gap-12">
          <section aria-labelledby="who">
            <h2 id="who" className={H2}>Who it is for</h2>
            <p className="text-text">{copy.whoFor}</p>
          </section>

          <section aria-labelledby="benefits">
            <h2 id="benefits" className={H2}>Why it matters</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {copy.benefits.map((b) => (
                <div key={b.title} className="border-t-2 border-primary pt-3">
                  <p className="font-semibold text-text">{b.title}</p>
                  <p className="mt-1.5 text-sm text-muted">{b.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="receive" className="rounded-sm border border-border border-t-4 border-t-accent p-7">
            {copy.v1Retained ? (
              <>
                <h2 id="receive" className={H2}>What this service covers</h2>
                <p className="mb-3 text-text">{copy.v1Retained.framing}</p>
                <p className="mb-2 text-sm font-medium text-muted">{copy.v1Retained.intro}</p>
                <ul>
                  {copy.v1Retained.lines.map((l) => (
                    <li key={l} className="flex gap-3 border-t border-border py-2.5">{CHECK}<span>{l}</span></li>
                  ))}
                </ul>
                {copy.v1Retained.closing && <p className="mt-3 text-sm text-muted">{copy.v1Retained.closing}</p>}
              </>
            ) : (
              <>
                <h2 id="receive" className={H2}>What you receive</h2>
                <ul>
                  {copy.whatYouReceive.map((l) => (
                    <li key={l} className="flex gap-3 border-t border-border py-3">{CHECK}<span>{l}</span></li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section aria-labelledby="provide">
            <h2 id="provide" className={H2}>What you provide</h2>
            <ol className="flex list-decimal flex-col gap-2 pl-6">{copy.whatYouProvide.map((l) => <li key={l}>{l}</li>)}</ol>
          </section>

          <section aria-labelledby="runs">
            <h2 id="runs" className={H2}>How it runs</h2>
            <p>
              The same six steps as every SCS engagement: enquiry, understanding the need, a written proposal, agreement, delivery with management
              review, and handover. <Link href="/process" className="font-medium text-primary hover:underline">Our process →</Link>
            </p>
          </section>

          <section aria-labelledby="not">
            <h2 id="not" className={H2}>What this service does not include</h2>
            <ul className="flex list-disc flex-col gap-2 pl-6">{copy.doesNotInclude.map((l) => <li key={l}>{l}</li>)}</ul>
          </section>

          <RelatedCards guides={guides} caseStudies={caseStudies} />
        </div>

        <div>
          <DiscussPanel
            title="Discuss this service"
            text="Tell us about your organisation and what you need. We will confirm the scope and send a proposal."
            cta="Discuss this service"
            serviceId={s.id}
          />
        </div>
      </div>

      <WhatHappensNext
        steps={[
          { title: "You get in touch", text: "Book a call or send an enquiry." },
          { title: "We confirm what is needed", text: "We look at your situation and agree the scope." },
          { title: "You receive a proposal", text: "Scope, deliverables and what is not included, in writing." },
        ]}
      />
    </article>
  );
}
