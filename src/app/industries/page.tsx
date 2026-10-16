import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";
import { industries } from "@/content/loaders";
import { PH } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "Industries",
  description: "Sector-specific needs and the agencies to review for financial services, technology, energy, real estate, manufacturing, healthcare, retail, agribusiness, professional services, nonprofits, education and media businesses in Nigeria.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Support that understands your sector" intro="Every sector has its own agencies and documents. See the typical needs and the agencies to review for yours." />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((i) => (
            <li key={i.slug}>
              <Link href={`/industries/${i.slug}`} className="lift reveal block h-full rounded-md border border-border border-t-4 border-t-primary bg-bg p-6">
                <h2 className="text-lg font-semibold text-text">{i.name}</h2>
                <p className="mt-2 text-sm text-muted">{i.summary}</p>
                <p className="mt-3 text-xs text-muted">{i.regulators.length} agencies to review</p>
                <span className="mt-3 inline-block text-sm font-medium text-primary">See sector needs →</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[75ch] text-sm text-muted">Agency lists are indicative. Requirements vary by client industry, activity and regulatory status, and SCS confirms what applies to your business.</p>
        <p className="mt-2"><ClientPlaceholder text={PH.taxonomy} /></p>
      </div>
    </>
  );
}
