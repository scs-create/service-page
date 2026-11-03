import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import WhatHappensNext from "@/components/v2/WhatHappensNext";
import ProposalForm from "@/components/forms/ProposalForm";
import { SERVICES } from "@/content/v2/catalogue";
import { EMAILS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Request a proposal",
  description: `Request a written proposal from ${SITE.titleName}: scope, deliverables and what is not included. ${SITE.responsePromise}`,
  alternates: { canonical: "/contact/proposal" },
};

// F: Request a proposal (05-SITE-SPEC.md §1, §3): the proposal form (Worker, Turnstile, D1, an optional PDF brief in R2),
// with email and the booking link as alternatives. ?service=<ID> pre-selects the service. DRAFT copy.
const INCLUDE = [
  "Your organisation's name and, if registered, its RC, BN or IT number",
  "What you need, in a few lines, or the brief or tender document",
  "Any deadlines you are working to",
  "Who will decide, and the best person to contact",
];

export default function ProposalPage() {
  const subject = encodeURIComponent("Proposal request");
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Contact", href: "/contact" }, { label: "Request a proposal" }]}
        eyebrow="Contact"
        title="Request a proposal"
        intro="For organisations with a formal brief or tender, or a clear idea of what they need. Every proposal sets out the scope, deliverables and what is not included, in writing."
      />
      <div className="mx-auto grid max-w-[1280px] items-start gap-12 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <section aria-labelledby="include">
          <h2 id="include" className="type-h2 text-text">What to send us</h2>
          <span aria-hidden="true" className="mb-6 mt-4 block h-1 w-14 rounded-sm bg-accent" />
          <ul className="list-disc space-y-2 pl-5">{INCLUDE.map((t) => <li key={t}>{t}</li>)}</ul>
          <p className="mt-6 text-muted">Fees are set out in the proposal itself, once we understand the scope.</p>
          <div className="mt-10 max-w-[640px]">
            <ProposalForm services={SERVICES.map((s) => ({ id: s.id, name: s.name, path: s.path }))} />
          </div>
        </section>
        <aside aria-label="Other ways to send your request" className="rounded-sm border border-border border-t-4 border-t-accent bg-bg p-7 lg:sticky lg:top-28">
          <h2 className="font-sans text-xl font-semibold text-text">Prefer email or a call?</h2>
          <p className="mb-5 mt-2 text-[15px] text-muted">Email your brief instead, or book a call and talk it through.</p>
          <a href={`mailto:${EMAILS.sales}?subject=${subject}`} data-track="Proposal email" className="flex min-h-12 items-center justify-center rounded-md bg-primary px-5 font-medium text-white hover:bg-secondary">
            Email your brief
          </a>
          <p className="mt-2 break-all text-center text-sm text-muted">{EMAILS.sales}</p>
          <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" data-location="proposal" className="mt-4 block text-center text-[15px] font-medium text-primary hover:underline">
            Book a Discovery Call instead →<span className="sr-only"> (opens Cal.com in a new tab)</span>
          </a>
          <p className="mt-5 border-t border-border pt-4 text-[13px] text-muted">{SITE.responsePromise}</p>
        </aside>
      </div>
      <WhatHappensNext
        steps={[
          { title: "We review your request", text: "The right person at SCS reads your brief." },
          { title: "We confirm the scope", text: "We ask what we need to know, usually on a short call." },
          { title: "You receive a proposal", text: "Scope, deliverables, exclusions and fees, in writing." },
        ]}
      >
        <Link href="/process" className="font-medium text-primary hover:underline">How every engagement runs →</Link>
      </WhatHappensNext>
    </>
  );
}
