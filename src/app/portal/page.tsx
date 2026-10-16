import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";

// PROTOTYPE ONLY. Invisible to visitors: returns 404 unless NEXT_PUBLIC_ENABLE_PORTAL_PROTOTYPE="true"
// (set automatically for deploy previews / branch deploys in netlify.toml). Not linked anywhere, not in the sitemap,
// noindex. It shows MOCK data only — a real client portal needs real authentication (e.g. Netlify Identity roles)
// and a data store, neither of which exists yet.
export const metadata: Metadata = { title: "Client portal (prototype)", robots: { index: false, follow: false } };

const ENGAGEMENTS = [
  { name: "Sample Ltd — Company incorporation", stage: "Structure", progress: 60 },
  { name: "Sample Ltd — Compliance Desk (Package B)", stage: "Comply", progress: 35 },
];
const REQUESTS = ["Certified ID of directors (mock)", "Signed board resolution (mock)", "Proof of address (mock)"];

export default function PortalPrototype() {
  if (process.env.NEXT_PUBLIC_ENABLE_PORTAL_PROTOTYPE !== "true") notFound();
  return (
    <>
      <PageHero eyebrow="Prototype" title="Client portal" intro="Mock data only. This page demonstrates the idea and is not a live client portal." />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-2">
        <section className="rounded-md border border-border border-t-4 border-t-accent bg-bg p-6">
          <h2 className="text-xl font-semibold text-text">Your engagements</h2>
          <ul className="mt-4 space-y-4">
            {ENGAGEMENTS.map((e) => (
              <li key={e.name}>
                <p className="font-medium text-text">{e.name}</p>
                <p className="text-sm text-muted">Current stage: {e.stage}</p>
                <div className="mt-1 h-2 rounded-full bg-surface" role="img" aria-label={`${e.progress}% complete`}><div className="h-2 rounded-full bg-primary" style={{ width: `${e.progress}%` }} /></div>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-md border border-border border-t-4 border-t-accent bg-bg p-6">
          <h2 className="text-xl font-semibold text-text">Documents we need from you</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">{REQUESTS.map((r) => <li key={r}>{r}</li>)}</ul>
        </section>
      </div>
    </>
  );
}
