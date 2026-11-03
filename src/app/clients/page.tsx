import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { START_HERE } from "@/content/v2/pages";

export const metadata: Metadata = {
  title: "Clients",
  description: "Who SCS works with: founders and SMEs, growing companies, NGOs and institutions, companies entering Nigeria from abroad, and international firms needing an operations partner.",
  alternates: { canonical: "/clients" },
};

// Clients ("Who we help" in v1; owner decision c). The same Start-here paths as the home page, with descriptions.
export default function ClientsPage() {
  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Clients" }]}
        eyebrow="Clients"
        title="Who we work with."
        intro="Organisations in Nigeria and abroad, at every stage from first registration to long-term partnership. Choose the description that fits you best."
      />
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
        <ul className="grid gap-5 md:grid-cols-2">
          {START_HERE.map((s) => (
            <li key={s.href}>
              <Link href={s.href} className="lift block h-full rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6 hover:border-primary">
                <span className="block text-lg font-semibold text-text">{s.title} →</span>
                <span className="mt-2 block text-muted">{s.text}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-muted">
          Looking for your sector? <Link href="/industries" className="font-medium text-primary hover:underline">Industries we serve →</Link>
        </p>
      </div>
    </>
  );
}
