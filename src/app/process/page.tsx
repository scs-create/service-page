import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import WhatHappensNext from "@/components/v2/WhatHappensNext";
import { SIX_STEPS, WE_DO, WE_DO_NOT } from "@/content/v2/pages";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our process",
  description: "How every SCS engagement runs, in six steps: enquiry, understanding the need, a written proposal, agreement, delivery with management review, and handover.",
  alternates: { canonical: "/process" },
};

// Process (05-SITE-SPEC.md §1): the six steps from Drive "02 How Work Runs", plus "What we do and do not do".
export default function ProcessPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Process" }]}
        eyebrow="Our process"
        title="Every engagement follows the same six steps."
        intro="Nothing starts until the scope is agreed in writing, and nothing reaches you before our management team has reviewed it. The steps are the same for a single filing and for a long-term partnership."
      />

      <section aria-labelledby="steps-title" className="dark-surface border-t-4 border-accent bg-secondary text-white">
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
          <h2 id="steps-title" className="type-h2 text-white">The six steps</h2>
          <span aria-hidden="true" className="mb-10 mt-4 block h-1 w-14 rounded-sm bg-accent" />
          <ol className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SIX_STEPS.map((s, i) => (
              <li key={s.title} className="border-t-2 border-accent pt-4">
                <span className="tabular text-sm font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-xl font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-white/85">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="do-title">
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
          <h2 id="do-title" className="type-h2 text-text">What we do and do not do</h2>
          <span aria-hidden="true" className="mb-10 mt-4 block h-1 w-14 rounded-sm bg-accent" />
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-sm border border-border border-t-4 border-t-accent p-7">
              <h3 className="text-xl font-semibold text-text">We do</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5">{WE_DO.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
            <div className="rounded-sm border border-border border-t-4 border-t-primary p-7">
              <h3 className="text-xl font-semibold text-text">We do not</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5">{WE_DO_NOT.map((t) => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
          <p className="mt-8 text-muted">
            The standards behind each step, from how we vet specialists to how we handle complaints, are set out in{" "}
            <Link href="/about/standards" className="font-medium text-primary hover:underline">Our standards →</Link>
          </p>
        </div>
      </section>

      <WhatHappensNext
        title="Start with step one."
        steps={[
          { title: "You get in touch", text: `Book a Discovery Call or send an enquiry. ${SITE.responsePromise}` },
          { title: "We understand the need", text: "A conversation about your organisation and what you need." },
          { title: "You receive a proposal", text: "Scope, deliverables and what is not included, in writing." },
        ]}
      >
        <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" data-location="process" className="inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-medium text-white hover:bg-secondary">
          Book a Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span>
        </a>
      </WhatHappensNext>
    </>
  );
}
