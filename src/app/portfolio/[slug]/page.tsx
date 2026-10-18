import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getPortfolioBySlug, portfolio } from "@/content/portfolio/data";
import { SERVICE_LINE_TO_SLUG } from "@/content/portfolio/serviceLines";
import { getServiceBySlug } from "@/content/services/data";
import CaseStudyCard from "@/components/ui/CaseStudyCard";
import PageHero from "@/components/ui/PageHero";
import CopyButton from "@/components/ui/CopyButton";
import CTAButton from "@/components/ui/CTAButton";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return portfolio.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPortfolioBySlug(slug);
  return p ? { title: `${p.client}: case study`, description: `${p.headline} ${p.impact}`.slice(0, 160) } : {};
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getPortfolioBySlug(slug);
  if (!entry) notFound();

  const relatedSlugs = [...new Set(entry.serviceLines.map((l) => SERVICE_LINE_TO_SLUG[l]).filter(Boolean))];
  const related = relatedSlugs.map((s) => getServiceBySlug(s)).filter((s) => !!s);

  return (
    <>
      <PageHero breadcrumbs={[{ label: "Portfolio", href: "/portfolio" }, { label: entry.client }]} eyebrow={entry.sector} title={entry.client} intro={entry.headline} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 grid lg:grid-cols-[minmax(0,1fr)_340px] gap-10 items-start">
        <CaseStudyCard entry={entry} />
        <aside className="space-y-6 lg:sticky lg:top-28">
          <section className="rounded-md border border-border border-t-4 border-t-success bg-bg p-5">
            <h2 className="font-semibold text-text">Verify this client</h2>
            <p className="mt-2 text-sm text-muted">RC {entry.rc}. Copy the number, open the CAC website, then use its Public Search to compare the registered name.</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <CopyButton text={entry.rc} label={entry.client} />
              <a href={SITE.cacUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline">CAC website<span className="sr-only"> (opens in new tab)</span> ↗</a>
            </div>
            <Link href="/verification" className="mt-3 inline-block text-sm text-primary hover:underline">All verifiable clients →</Link>
          </section>
          {related.length > 0 && (
            <section className="rounded-md border border-border bg-surface p-5">
              <h2 className="font-semibold text-text">Related services</h2>
              <ul className="mt-2 space-y-1.5 text-sm">
                {related.map((s) => <li key={s!.slug}><Link href={`/services/${s!.slug}`} className="text-primary hover:underline">{s!.title}</Link></li>)}
              </ul>
            </section>
          )}
          <section className="dark-surface rounded-md border-t-4 border-accent bg-secondary p-5 text-white">
            <h2 className="font-semibold">Similar challenge?</h2>
            <p className="mt-1 text-sm text-white/85">Speak with our team about your business.</p>
            <div className="mt-4"><CTAButton booking label="Book a Discovery Call" variant="accent" /></div>
          </section>
        </aside>
      </div>
    </>
  );
}
