import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import JsonLd from "@/components/ui/JsonLd";
import CTAButton from "@/components/ui/CTAButton";
import { faqs } from "@/content/loaders";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about working with Stephen Corporate Services: what we do, how fees are agreed, how to verify our work, and how your data is handled.",
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }} />
      <PageHero breadcrumbs={[{ label: "FAQ" }]} eyebrow="FAQ" title="Questions we are often asked" intro="Straight answers about working with SCS." />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-[80ch] space-y-3">
          {faqs.map((f) => (
            <details key={f.order} className="group rounded-md border border-border bg-bg p-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-text">
                {f.question}
                <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-180">▼</span>
              </summary>
              <p className="mt-3 text-muted">{f.answer}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-4 rounded-md border border-border bg-surface p-6">
          <p className="font-medium text-text">Still have a question?</p>
          <CTAButton booking label="Book a Discovery Call" />
        </div>
      </div>
    </>
  );
}
