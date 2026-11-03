import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import DiscussPanel from "@/components/v2/DiscussPanel";
import { TOPICS, TOPICS_REVIEWED, getTopic } from "@/content/v2/topics";
import { getServiceById } from "@/content/v2/catalogue";
import { getPostBySlug } from "@/lib/posts";

// Corporate School topic hub (05-SITE-SPEC.md §1). Regulators are linked to their official websites with the date
// they were checked; requirements that change are left for the regulator to confirm.
type Params = { topic: string };
const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export function generateStaticParams(): Params[] {
  return TOPICS.map((t) => ({ topic: t.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const t = getTopic((await params).topic);
  return t ? { title: `${t.name}: guides`, description: t.intro, alternates: { canonical: `/corporate-college/corporate-school/topics/${t.slug}` } } : {};
}

const H2 = "mb-4 text-[24px] font-semibold leading-tight text-text md:text-[28px]";

export default async function TopicPage({ params }: { params: Promise<Params> }) {
  const t = getTopic((await params).topic);
  if (!t) notFound();
  const guides = t.guides.map(getPostBySlug).filter((p) => !!p);
  const services = t.services.map(getServiceById).filter((s) => !!s);

  return (
    <>
      <PageHero
        breadcrumbs={[{ label: "Corporate College", href: "/corporate-college" }, { label: "Corporate School", href: "/corporate-college/corporate-school" }, { label: t.name }]}
        eyebrow="Corporate School · Topic"
        title={t.name}
        intro={t.intro}
        meta={`Last reviewed ${date(TOPICS_REVIEWED)} · For general information only`}
      />
      <div className="mx-auto grid max-w-[1280px] items-start gap-14 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <div className="flex min-w-0 flex-col gap-12">
          <section aria-labelledby="covers">
            <h2 id="covers" className={H2}>What this topic covers</h2>
            <ul className="list-disc space-y-2 pl-6">{t.points.map((p) => <li key={p}>{p}</li>)}</ul>
          </section>

          {guides.length > 0 && (
            <section aria-labelledby="guides">
              <h2 id="guides" className={H2}>Guides</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {guides.map((g) => (
                  <li key={g!.slug}>
                    <Link href={`/corporate-college/corporate-school/${g!.slug}`} className="block h-full rounded-sm border border-border p-5 hover:border-primary">
                      <span className="block text-xs text-muted">Guide · {date(g!.date)}</span>
                      <span className="mt-1.5 block font-semibold text-text">{g!.title} →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {t.sources.length > 0 && (
            <section aria-labelledby="sources">
              <h2 id="sources" className={H2}>Official sources</h2>
              <ul className="space-y-2">
                {t.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                      {s.title}<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in new tab)</span>
                    </a>
                    <span className="text-sm text-muted"> · retrieved {date(TOPICS_REVIEWED)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-muted">Requirements change. Confirm the current position with the regulator, or ask us, before you act.</p>
            </section>
          )}

          <section aria-labelledby="help">
            <h2 id="help" className={H2}>How SCS can help</h2>
            <ul className="border-t border-border">
              {services.map((s) => (
                <li key={s!.id} className="border-b border-border">
                  <Link href={s!.path} className="group block py-4">
                    <span className="block font-medium text-text group-hover:text-primary">{s!.name} →</span>
                    <span className="mt-1 block text-sm text-muted">{s!.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
        <div>
          <DiscussPanel title="Ask a question" text="Tell us about your situation and we will tell you what applies and what to do first." cta="Book a Discovery Call" />
        </div>
      </div>
    </>
  );
}
