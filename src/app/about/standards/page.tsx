import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { EMAILS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our standards",
  description: `How ${SITE.titleName} vets specialists, reviews every deliverable, protects personal data, handles conflicts of interest and resolves complaints.`,
  alternates: { canonical: "/about/standards" },
};

// About › Our standards (05-SITE-SPEC.md §1: expert vetting, management quality review, data protection, conflicts,
// complaints; strategy §2). DRAFT copy for owner approval. The v1 standards sentence on /about is kept as it is
// (legal-rule item 2, owner decision).
const STANDARDS = [
  {
    id: "vetting",
    title: "Vetted specialists, each with a backup",
    points: [
      "Specialists join our network only after we check their qualifications, registrations and past work.",
      "Each engagement has a named specialist and a named backup, so work continues if someone is unavailable.",
      "Specialists work to the scope agreed with you and to our confidentiality and data-handling rules.",
    ],
  },
  {
    id: "review",
    title: "Management review before delivery",
    points: [
      "Every deliverable is reviewed by a member of the SCS management team before it is sent to you.",
      "The review checks the work against the agreed scope and for accuracy and completeness.",
      "You accept the work in writing at handover.",
    ],
  },
  {
    id: "scope",
    title: "Scope agreed in writing",
    points: [
      "No engagement starts until the scope, deliverables, exclusions, milestones and acceptance are agreed in writing.",
      "Changes to the scope are agreed in writing before the extra work starts.",
      "We commit to the work we control, not to decisions made by others, such as approvals, grants, investment or sales.",
    ],
  },
  {
    id: "data",
    title: "Data protection",
    points: [
      "We handle personal data in line with the Nigeria Data Protection Act 2023 (NDPA) and our Privacy notice.",
      "Access to client files is limited to the people working on the engagement.",
      "At the end of an engagement, files are handed over and access is removed.",
    ],
  },
  {
    id: "conflicts",
    title: "Conflicts of interest",
    points: [
      "Before we accept work, we check whether it conflicts with work for another client or with a team member's interests.",
      "Where there is a conflict, we tell you and either agree how it is managed or decline the work.",
    ],
  },
  {
    id: "complaints",
    title: "Complaints",
    points: [
      `Send a complaint to ${EMAILS.info}, or raise it with your coordinator.`,
      "We acknowledge it, a member of the management team who was not involved in the work reviews it, and we reply in writing.",
      "We record every complaint and what we changed as a result.",
    ],
  },
];

export default function StandardsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "About", href: "/about" }, { label: "Our standards" }]}
        eyebrow="About"
        title="Our standards"
        intro="What you can expect from us on every engagement, whatever its size: how specialists are chosen, how work is checked, how your data is protected and what happens if something goes wrong."
      />
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
        <nav aria-label="On this page" className="mb-12 flex flex-wrap gap-2">
          {STANDARDS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="inline-flex min-h-11 items-center rounded-sm border border-border bg-surface px-4 text-sm font-medium text-text hover:border-primary hover:text-primary">{s.title}</a>
          ))}
        </nav>
        <div className="grid gap-6 md:grid-cols-2">
          {STANDARDS.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="rounded-sm border border-border border-t-4 border-t-accent p-7">
              <h2 id={`${s.id}-title`} className="text-[24px] font-semibold leading-tight text-text">{s.title}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5">{s.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </section>
          ))}
        </div>
        <p className="mt-10 text-muted">
          How these standards shape each engagement: <Link href="/process" className="font-medium text-primary hover:underline">Our process →</Link>
        </p>
      </div>
    </>
  );
}
