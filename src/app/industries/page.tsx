import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";
import { INDUSTRIES } from "@/content/v2/industries";
import { PH } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "Industries",
  description: `Sector needs and the agencies to review, in ${INDUSTRIES.length} groups: ${INDUSTRIES.map((i) => i.name).join(", ")}.`,
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Industries" }]} eyebrow="Industries" title="Support that understands your sector" intro="Every sector has its own agencies and documents. See the typical needs and the agencies to review for yours." />
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((i) => (
            <li key={i.slug}>
              <Link href={i.path} className="lift block h-full rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6 hover:border-primary">
                <h2 className="font-sans text-lg font-semibold text-text">{i.name}</h2>
                <p className="mt-2 text-sm text-muted">{i.summary}</p>
                <p className="mt-3 text-xs text-muted">Includes {i.includes.join(", ")}</p>
                <span className="mt-3 inline-block text-sm font-medium text-primary">See sector needs →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[75ch] text-sm text-muted">Agency lists are indicative. Requirements vary by industry, activity and regulatory status, and SCS confirms what applies to your organisation.</p>
        <p className="mt-2"><ClientPlaceholder text={PH.taxonomy} /></p>
      </div>
    </>
  );
}
