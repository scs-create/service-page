import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import FitBand from "@/components/v2/FitBand";
import RelatedCards from "@/components/v2/RelatedCards";
import WhatHappensNext from "@/components/v2/WhatHappensNext";
import { AUDIENCES, PARTNERSHIP_CTA, audience, type AudienceAction } from "@/content/v2/pages";
import { getServiceById } from "@/content/v2/catalogue";
import { getPortfolioBySlug } from "@/content/portfolio/data";
import { PROPOSAL_HREF } from "@/lib/nav";
import { SITE } from "@/lib/site";

// A: Audience page (05-SITE-SPEC.md §3): who this is for → what usually comes first → how SCS helps → Are we a fit?
// → case study → What happens next → one button, as set per audience.
type Params = { audience: string };

export function generateStaticParams(): Params[] {
  return AUDIENCES.map((a) => ({ audience: a.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const a = audience((await params).audience);
  return a ? { title: a.name, description: a.lead, alternates: { canonical: `/clients/${a.slug}` } } : {};
}

const BTN = "inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-medium text-white transition-colors hover:bg-secondary";
function PrimaryAction({ action, location }: { action: AudienceAction; location: string }) {
  if (action === "partnership")
    return <Link href={PARTNERSHIP_CTA} data-track="partnership_cta" className={BTN}>Start a partnership conversation</Link>;
  if (action === "proposal") return <Link href={PROPOSAL_HREF} data-track="Request a proposal" className={BTN}>Request a proposal</Link>;
  return (
    <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" data-location={location} className={BTN}>
      Book a Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span>
    </a>
  );
}

export default async function AudiencePage({ params }: { params: Promise<Params> }) {
  const a = audience((await params).audience);
  if (!a) notFound();
  const services = a.services.map(getServiceById).filter((s) => !!s);
  const caseStudy = getPortfolioBySlug(a.caseStudy);

  return (
    <div data-audience={a.slug}>
      <PageHero breadcrumbs={[{ label: "Clients", href: "/clients" }, { label: a.name }]} eyebrow={a.name} title={a.title} intro={a.lead}>
        <PrimaryAction action={a.action} location="audience_hero" />
      </PageHero>

      <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-2 lg:px-8">
        <section aria-labelledby="who">
          <h2 id="who" className="type-h2 text-text">Who this is for</h2>
          <span aria-hidden="true" className="mb-6 mt-4 block h-1 w-14 rounded-sm bg-accent" />
          <ul className="list-disc space-y-2 pl-5">{a.whoFor.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>
        <section aria-labelledby="first">
          <h2 id="first" className="type-h2 text-text">What usually comes first</h2>
          <span aria-hidden="true" className="mb-6 mt-4 block h-1 w-14 rounded-sm bg-accent" />
          <ol className="space-y-5">
            {a.firstSteps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="tabular w-7 flex-none text-lg font-semibold text-primary">{i + 1}</span>
                <span><span className="block font-semibold text-text">{s.title}</span><span className="mt-1 block text-sm text-muted">{s.text}</span></span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section aria-labelledby="helps" className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
          <h2 id="helps" className="type-h2 text-text">How SCS helps</h2>
          <span aria-hidden="true" className="mb-8 mt-4 block h-1 w-14 rounded-sm bg-accent" />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s!.id}>
                <Link href={s!.path} data-service-id={s!.id} className="block h-full rounded-sm border border-border bg-bg p-5 hover:border-primary">
                  <span className="block font-semibold text-text">{s!.name} →</span>
                  <span className="mt-1.5 block text-sm text-muted">{s!.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FitBand title="Working together works when it works for both sides." />

      {caseStudy && (
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
          <RelatedCards guides={[]} caseStudies={[caseStudy]} title="Work in practice" />
        </div>
      )}

      <WhatHappensNext
        steps={[
          { title: "You get in touch", text: `Book a call or send an enquiry. ${SITE.responsePromise}` },
          { title: "We understand the need", text: "We confirm what your organisation needs first." },
          { title: "You receive a proposal", text: "Scope, deliverables and what is not included, in writing." },
        ]}
      >
        <PrimaryAction action={a.action} location="audience_next" />
      </WhatHappensNext>
    </div>
  );
}
