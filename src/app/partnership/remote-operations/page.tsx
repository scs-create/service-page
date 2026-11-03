import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import FitBand from "@/components/v2/FitBand";
import WhatHappensNext from "@/components/v2/WhatHappensNext";
import { PARTNERSHIP_CTA, REMOTE_OPS_SCOPE } from "@/content/v2/pages";
import { getServiceById } from "@/content/v2/catalogue";

export const metadata: Metadata = {
  title: "Remote operations partnership",
  description: "A Nigeria operations partner for international firms: client intake, case and file administration, billing administration, research support, back office and customer support, on West Africa Time (UTC+1).",
  alternates: { canonical: "/partnership/remote-operations" },
};

// Remote operations variant of the Partnership (strategy §3 audience 5, §8). Described in administrative terms only.
// DRAFT copy for owner approval.
const HOW = [
  { title: "Defined tasks", text: "The tasks, systems and handover points written down and agreed before work starts." },
  { title: "Service levels", text: "Turnaround standards and reporting agreed in writing, and reviewed each quarter." },
  { title: "Data handling", text: "Your procedures and data-handling rules followed, with access limited to the people who need it." },
  { title: "Quality review", text: "Work checked by SCS management before it reaches you." },
];

export default function RemoteOperationsPage() {
  const service = getServiceById("HO-03");
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Partnership", href: "/partnership" }, { label: "Remote operations" }]}
        eyebrow="For international firms"
        title="A remote operations partner in Nigeria."
        intro="The SCS Partnership model, agreed with your firm: a dedicated team in Abuja for administrative and back-office work, on West Africa Time (UTC+1), which overlaps with the UK and European working day and with the North American morning."
      >
        <Link href={PARTNERSHIP_CTA} data-track="partnership_cta" className="inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-medium text-white hover:bg-secondary">
          Start a partnership conversation
        </Link>
      </PageHero>

      <section aria-labelledby="scope-title">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 id="scope-title" className="type-h2 text-text">What we can take on</h2>
            <span aria-hidden="true" className="mb-6 mt-4 block h-1 w-14 rounded-sm bg-accent" />
            <p className="max-w-[56ch] text-muted">
              Administrative and back-office work only. Tasks that need a licence or professional qualification in your jurisdiction stay with your own staff.
            </p>
            {service && <Link href={service.path} className="mt-5 inline-block font-medium text-primary hover:underline">Service details: {service.name} →</Link>}
          </div>
          <ul className="border-t border-border">{REMOTE_OPS_SCOPE.map((s) => <li key={s} className="border-b border-border py-3.5">{s}</li>)}</ul>
        </div>
      </section>

      <section aria-labelledby="how-title" className="bg-surface">
        <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
          <h2 id="how-title" className="type-h2 text-text">How it is run</h2>
          <span aria-hidden="true" className="mb-8 mt-4 block h-1 w-14 rounded-sm bg-accent" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map((h) => (
              <div key={h.title} className="rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6">
                <h3 className="text-lg font-semibold text-text">{h.title}</h3>
                <p className="mt-2 text-sm text-muted">{h.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FitBand title="A remote partnership works when it works for both sides." />

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
