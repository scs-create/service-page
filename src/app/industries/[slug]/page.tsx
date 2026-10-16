import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { industries, regulatorName } from "@/content/loaders";
import { getServiceBySlug } from "@/content/services/data";
import PageHero from "@/components/ui/PageHero";
import CTAButton from "@/components/ui/CTAButton";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";
import { PH } from "@/lib/placeholders";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const i = industries.find((x) => x.slug === slug);
  return i ? { title: `${i.name} corporate services`, description: `${i.summary} Typical needs and the agencies to review for ${i.name} businesses in Nigeria.` } : {};
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = industries.find((x) => x.slug === slug);
  if (!industry) notFound();
  const related = industry.services.map((s) => getServiceBySlug(s)).filter((s) => !!s);

  return (
    <>
      <PageHero eyebrow="Industries" title={industry.name} intro={industry.summary} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 items-start">
        <div>
          <h2 className="text-2xl font-semibold text-secondary mb-3 pl-3 border-l-4 border-accent">Typical needs to review</h2>
          <ul className="list-disc space-y-2 pl-6 text-text">{industry.needs.map((n) => <li key={n}>{n}</li>)}</ul>

          <h2 className="mt-10 text-2xl font-semibold text-secondary mb-3 pl-3 border-l-4 border-accent">Agencies to review</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {industry.regulators.map((r) => <li key={r} className="rounded-sm border border-border bg-surface px-3 py-2 text-sm text-text">{regulatorName(r)}</li>)}
          </ul>
          {industry.note && <p className="mt-4 text-sm text-muted">{industry.note}</p>}
          <p className="mt-4 text-sm text-muted">This list is indicative. Requirements vary by activity and regulatory status, and SCS confirms what applies to your business.</p>
          <p className="mt-2"><ClientPlaceholder text={PH.taxonomy} /></p>

          {related.length > 0 && (
            <>
              <h2 className="mt-10 text-2xl font-semibold text-secondary mb-3 pl-3 border-l-4 border-accent">How SCS can help</h2>
              <ul className="space-y-2">{related.map((s) => <li key={s!.slug}><Link href={`/services/${s!.slug}`} className="font-medium text-primary hover:underline">{s!.title}</Link><span className="text-sm text-muted"> — {s!.framingSentence}</span></li>)}</ul>
            </>
          )}
        </div>
        <aside className="dark-surface rounded-md border-t-4 border-accent bg-secondary p-6 text-white lg:sticky lg:top-28">
          <h2 className="text-xl font-semibold">Talk to us about your sector</h2>
          <div className="mt-4 flex flex-col gap-3">
            <CTAButton booking label="Book a Discovery Call" variant="accent" />
            <CTAButton href="/compliance-checklist" label="Compliance Starter Checklist" variant="outlineLight" />
          </div>
        </aside>
      </div>
    </>
  );
}
