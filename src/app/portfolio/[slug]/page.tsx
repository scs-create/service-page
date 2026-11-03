import { registrationLabel } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPortfolioBySlug, portfolio } from "@/content/portfolio/data";
import { SERVICE_LINE_TO_SLUG } from "@/content/portfolio/serviceLines";
import { v2LinkForV1 } from "@/content/v2/catalogue";
import PageHero from "@/components/ui/PageHero";
import CopyButton from "@/components/ui/CopyButton";
import WhatHappensNext from "@/components/v2/WhatHappensNext";
import { SITE } from "@/lib/site";

// K: Case study (05-SITE-SPEC.md §3): client and RC → sector → challenge → what SCS did → outcome, stated factually →
// related service → "Discuss similar work". All 23 are approved and consented (owner decision 5). The case studies
// carry no engagement date, so none is shown rather than one being invented.
export function generateStaticParams() {
  return portfolio.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPortfolioBySlug((await params).slug);
  return p ? { title: `${p.client}: case study`, description: `${p.headline} ${p.impact}`.slice(0, 160), alternates: { canonical: `/portfolio/${p.slug}` } } : {};
}

const H2 = "mb-4 text-[24px] font-semibold leading-tight text-text md:text-[28px]";
const Check = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.25" className="mt-1 flex-none">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const entry = getPortfolioBySlug((await params).slug);
  if (!entry) notFound();
  const reg = registrationLabel(entry);
  const relatedSlugs = [...new Set(entry.serviceLines.map((l) => SERVICE_LINE_TO_SLUG[l]).filter(Boolean))];
  const related = [...new Map(relatedSlugs.map(v2LinkForV1).filter((s) => !!s).map((s) => [s.href, s])).values()];

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Case studies", href: "/portfolio" }, { label: entry.client }]}
        eyebrow={entry.sector}
        title={entry.client}
        intro={entry.headline}
        meta={reg ? `${reg} · Corporate Affairs Commission (CAC)` : "Registration number to be added"}
      />
      <div className="mx-auto grid max-w-[1280px] items-start gap-14 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="flex min-w-0 flex-col gap-12">
          <section aria-labelledby="challenge">
            <h2 id="challenge" className={H2}>The challenge</h2>
            <p className="max-w-[70ch]">{entry.challenge}</p>
          </section>
          <section aria-labelledby="did" className="rounded-sm border border-border border-t-4 border-t-accent p-7">
            <h2 id="did" className={H2}>What SCS did</h2>
            <ul>{entry.delivered.map((d) => <li key={d} className="flex gap-3 border-t border-border py-3"><Check /><span>{d}</span></li>)}</ul>
          </section>
          <section aria-labelledby="outcome">
            <h2 id="outcome" className={H2}>The outcome</h2>
            <p className="max-w-[70ch]">{entry.impact}</p>
            <p className="mt-3 text-sm text-muted">Confidential commercial details are withheld in line with client confidentiality.</p>
          </section>
          {related.length > 0 && (
            <section aria-labelledby="related">
              <h2 id="related" className={H2}>Related services</h2>
              <ul className="border-t border-border">
                {related.map((s) => (
                  <li key={s.href} className="border-b border-border">
                    <Link href={s.href} className="group block py-4">
                      <span className="block font-medium text-text group-hover:text-primary">{s.label} →</span>
                      <span className="mt-1 block text-sm text-muted">{s.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
          <section aria-labelledby="verify" className="rounded-sm border border-border border-t-4 border-t-success bg-bg p-6">
            <h2 id="verify" className="font-sans text-lg font-semibold text-text">Verify this client</h2>
            {entry.rc ? (
              <p className="mt-2 text-sm text-muted">{reg}. Copy the number, open the CAC website, then use its Public Search to compare the registered name.</p>
            ) : (
              <p className="mt-2 text-sm text-muted">The CAC registration number for this client will be added shortly. You can already search the registered name on the CAC website.</p>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {entry.rc && <CopyButton text={entry.rc} label={entry.client} />}
              <a href={SITE.cacUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">CAC website<span className="sr-only"> (opens in new tab)</span> ↗</a>
            </div>
            <Link href="/verification" className="mt-3 inline-block text-sm text-primary hover:underline">All verifiable clients →</Link>
          </section>
          <section aria-labelledby="similar" className="rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6">
            <h2 id="similar" className="font-sans text-lg font-semibold text-text">Discuss similar work</h2>
            <p className="mb-4 mt-1 text-sm text-muted">Tell us about your organisation and what you need.</p>
            <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" data-location="case_study" className="flex min-h-12 items-center justify-center rounded-md bg-primary px-5 font-medium text-white hover:bg-secondary">
              Discuss similar work<span className="sr-only"> (opens Cal.com in a new tab)</span>
            </a>
            <p className="mt-4 text-[13px] text-muted">{SITE.responsePromise}</p>
          </section>
        </aside>
      </div>
      <WhatHappensNext
        steps={[
          { title: "You get in touch", text: "Book a call or send an enquiry." },
          { title: "We understand the need", text: "We look at your situation and agree the scope." },
          { title: "You receive a proposal", text: "Scope, deliverables and what is not included, in writing." },
        ]}
      />
    </>
  );
}
