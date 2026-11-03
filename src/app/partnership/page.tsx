import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import FitBand from "@/components/v2/FitBand";
import WhatHappensNext from "@/components/v2/WhatHappensNext";
import { PARTNER_RECEIVES, PARTNER_SUITS, PARTNERSHIP_AGREED, PARTNERSHIP_CTA, REMOTE_OPS_SCOPE } from "@/content/v2/pages";

export const metadata: Metadata = {
  title: "SCS Partnership",
  description: "An SCS Partnership is a retainership plan agreed with each partner: one accountable coordinator for recurring corporate, filing, documentation and operational support.",
  alternates: { canonical: "/partnership" },
};


const H2 = "type-h2 text-text";
const Rule = () => <span aria-hidden="true" className="mb-8 mt-4 block h-1 w-14 rounded-sm bg-accent" />;

// P: Partnership (05-SITE-SPEC.md §3, design/Partnership.dc.html, strategy §8). No fees, plan prices or "from" prices.
export default function PartnershipPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Partnership" }]}
        eyebrow="SCS Partnership"
        title="One accountable coordinator for your organisation."
        intro="An SCS Partnership is a retainership plan agreed with each partner. It covers your recurring corporate, filing, documentation and operational support, with projects added as they are diagnosed and agreed."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href={PARTNERSHIP_CTA} data-track="partnership_cta" className="inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-medium text-white hover:bg-secondary">
            Start a partnership conversation
          </Link>
          <a href="#fit" className="font-medium text-primary hover:underline">Are we a fit? →</a>
        </div>
      </PageHero>

      <section aria-labelledby="receive-title">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:px-8">
          <div>
            <h2 id="receive-title" className={H2}>What partners receive</h2>
            <Rule />
            <p className="max-w-[48ch] text-muted">Every plan is built around the partner. These come with every partnership.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {PARTNER_RECEIVES.map((p) => (
              <div key={p.title} className="rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6">
                <h3 className="text-lg font-semibold text-text">{p.title}</h3>
                <p className="mt-2 text-sm text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="suits-title" className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
          <h2 id="suits-title" className={H2}>Who it suits</h2>
          <Rule />
          <ul className="grid border-t border-border sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4">
            {PARTNER_SUITS.map((s) => (
              <li key={s.title} className="border-b border-border py-5">
                <p className="font-semibold text-text">{s.title}</p>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FitBand />

      <section aria-labelledby="agreed-title">
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
          <h2 id="agreed-title" className={H2}>How a partnership is agreed</h2>
          <Rule />
          <ol className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {PARTNERSHIP_AGREED.map((s, i) => (
              <li key={s} className="border-t-2 border-primary pt-3.5">
                <span className="tabular text-sm font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-1.5 font-semibold text-text">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="remote-title" className="border-t border-border">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="type-eyebrow mb-3 text-primary">For international firms</p>
            <h2 id="remote-title" className={H2}>A remote operations partner in Nigeria.</h2>
            <Rule />
            <p className="max-w-[56ch] text-muted">
              The same partnership model, agreed with your firm. We work on West Africa Time (UTC+1), which overlaps with the UK and European working day and
              with the North American morning.
            </p>
            <Link href="/partnership/remote-operations" className="mt-5 inline-block font-medium text-primary hover:underline">Remote operations partnership →</Link>
          </div>
          <ul className="border-t border-border">{REMOTE_OPS_SCOPE.map((s) => <li key={s} className="border-b border-border py-3.5">{s}</li>)}</ul>
        </div>
      </section>

      <WhatHappensNext
        title="What happens next"
        steps={[{ title: "You request a conversation" }, { title: "We respond within 24 hours" }, { title: "A Discovery Call and, if there is a fit, a proposal" }]}
      >
        <Link href={PARTNERSHIP_CTA} data-track="partnership_cta" className="inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-medium text-white hover:bg-secondary">
          Start a partnership conversation
        </Link>
      </WhatHappensNext>
    </>
  );
}
