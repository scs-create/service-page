import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SiteForm from "@/components/sections/SiteForm";
import { CONSENT_FIELD, type FormField } from "@/lib/formSchema";
import { CLUSTERS } from "@/content/v2/catalogue";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Join the expert network",
  description: `Apply to join the ${SITE.titleName} expert network: specialists engaged, vetted and reviewed as each engagement requires.`,
  alternates: { canonical: "/career/expert-network" },
};

// Join us › Expert network (05-SITE-SPEC.md §1). The criteria follow Our standards (specialist vetting). DRAFT copy.
const CRITERIA = [
  "Recognised qualifications or registrations in your field, which we check",
  "Experience you can evidence, with references or examples of past work",
  "Willingness to work to a written scope, our confidentiality and data-handling rules, and a management review before delivery",
  "Availability to act as the named specialist or the backup on an engagement",
];

const fields: FormField[] = [
  { name: "name", label: "Full name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "expertise", label: "Main area of expertise", type: "select", required: true, options: [...CLUSTERS.map((c) => c.name), "Other"] },
  { name: "profile_url", label: "LinkedIn profile or website", type: "url", required: true, placeholder: "https://" },
  { name: "location", label: "Where you are based", type: "text", autoComplete: "address-level1" },
  { name: "cv", label: "CV", type: "file", hint: "PDF or Word, up to 3 MB." },
  { name: "message", label: "Qualifications and experience", type: "textarea", rows: 5 },
  { ...CONSENT_FIELD, label: "I agree that Stephen Corporate Services - SCS Ltd may use my details and documents to review my application and contact me about it." },
];

export default function ExpertNetworkPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Career", href: "/career" }, { label: "Expert network" }]}
        eyebrow="Join us"
        title="Join the expert network"
        intro="SCS engages specialists as each engagement requires. Every specialist is vetted, works to a written scope and has their work reviewed by our management team before it reaches a client."
      />
      <div className="mx-auto grid max-w-[1280px] items-start gap-12 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8">
        <section aria-labelledby="apply">
          <h2 id="apply" className="type-h2 text-text">Apply</h2>
          <span aria-hidden="true" className="mb-6 mt-4 block h-1 w-14 rounded-sm bg-accent" />
          <div className="max-w-[640px]">
            <SiteForm
              form="expert"
              requestType="expert-network"
              sourcePage="/career/expert-network"
              fields={fields}
              submitLabel="Send application"
              successTitle="Application received."
              successMessage="Thank you. We review every application against our criteria and will contact you if there is a fit."
              explore={[{ href: "/about/standards", label: "Our standards" }, { href: "/process", label: "Our process" }]}
            />
          </div>
        </section>
        <aside aria-label="What we look for" className="rounded-sm border border-border border-t-4 border-t-accent bg-bg p-7">
          <h2 className="font-sans text-xl font-semibold text-text">What we look for</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">{CRITERIA.map((c) => <li key={c}>{c}</li>)}</ul>
          <Link href="/career" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">Looking for a staff role? →</Link>
        </aside>
      </div>
    </>
  );
}
