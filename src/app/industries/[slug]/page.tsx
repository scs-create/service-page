import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { regulatorName } from "@/content/loaders";
import { INDUSTRIES, getIndustry } from "@/content/v2/industries";
import PageHero from "@/components/ui/PageHero";
import DiscussPanel from "@/components/v2/DiscussPanel";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";
import { PH } from "@/lib/placeholders";

// v2 industry page: one of the 6 merged industries (strategy §6). The 15 v1 industry URLs 301 here.
export function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const i = getIndustry((await params).slug);
  return i ? { title: `${i.name}`, description: `${i.summary} Typical needs and the agencies to review in Nigeria.`, alternates: { canonical: i.path } } : {};
}

const H2 = "mb-4 text-[24px] font-semibold leading-tight text-text md:text-[28px]";

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const industry = getIndustry((await params).slug);
  if (!industry) notFound();

  return (
    <>
      <PageHero breadcrumbs={[{ label: "Industries", href: "/industries" }, { label: industry.name }]} eyebrow="Industries" title={industry.name} intro={industry.summary} meta={`Includes: ${industry.includes.join(" · ")}`} />
      <div className="mx-auto grid max-w-[1280px] items-start gap-14 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="flex min-w-0 flex-col gap-12">
          <section aria-labelledby="needs">
            <h2 id="needs" className={H2}>Typical needs to review</h2>
            <ul className="list-disc space-y-2 pl-6">{industry.needs.map((n) => <li key={n}>{n}</li>)}</ul>
          </section>
          <section aria-labelledby="agencies">
            <h2 id="agencies" className={H2}>Agencies to review</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {industry.regulators.map((r) => <li key={r} className="rounded-sm border border-border bg-surface px-3 py-2 text-sm">{regulatorName(r)}</li>)}
            </ul>
            {industry.notes.map((n) => <p key={n} className="mt-4 text-sm text-muted">{n}</p>)}
            <p className="mt-4 text-sm text-muted">This list is indicative. Requirements vary by activity and regulatory status, and SCS confirms what applies to your organisation.</p>
            <p className="mt-2"><ClientPlaceholder text={PH.taxonomy} /></p>
          </section>
          {industry.services.length > 0 && (
            <section aria-labelledby="help">
              <h2 id="help" className={H2}>How SCS can help</h2>
              <ul className="border-t border-border">
                {industry.services.map((s) => (
                  <li key={s.href} className="border-b border-border">
                    <Link href={s.href} className="group block py-4">
                      <span className="block font-medium text-text group-hover:text-primary">{s.label} →</span>
                      <span className="mt-1 block text-sm text-muted">{s.summary}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div>
          <DiscussPanel title="Talk to us about your sector" text="Tell us what your organisation does. We will confirm what applies and which services fit." cta="Book a Discovery Call" />
        </div>
      </div>
    </>
  );
}
