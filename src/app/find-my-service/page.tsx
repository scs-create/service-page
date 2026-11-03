import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { SITE } from "@/lib/site";
import OutcomeQuiz from "@/components/sections/OutcomeQuiz";
import { finderQuiz, SUPPORT_PACKAGES } from "@/content/loaders";
import { CLUSTERS, servicesInCluster } from "@/content/v2/catalogue";

export const metadata: Metadata = {
  title: "Find My Service",
  description: "Three quick questions to find the SCS services, areas of support and managed package that fit your organisation.",
};

export default function FinderPage() {
  // Outcomes: the 7 v2 service areas (most-requested services named first) + packages A–F + the quiz's own
  // (Corporate College, SCS Partnership).
  const outcomes = {
    ...Object.fromEntries(CLUSTERS.map((c) => [c.slug, { title: c.name, description: `${c.summary} Includes ${servicesInCluster(c.slug).slice(0, 4).map((s) => s.name).join(", ")} and more.`, href: c.path, ctaLabel: `Explore ${c.name}` }])),
    ...Object.fromEntries(SUPPORT_PACKAGES.map((p) => [`pkg-${p.id}`, { title: `Package ${p.id}: ${p.name}`, description: `${p.audience}. ${p.includes}.`, href: "/services#packages", ctaLabel: "See the packages" }])),
    ...finderQuiz.outcomes,
  };
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Analyse your Business", href: "/tools" }, { label: finderQuiz.title }]} eyebrow="Analyse your Business" title={finderQuiz.title} intro={finderQuiz.intro} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-[760px]">
          <noscript><p className="rounded-md border border-border bg-surface p-4 text-text">This tool needs JavaScript. <Link href="/services" className="text-primary underline">Browse all services</Link> or <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" className="text-primary underline">book a Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span> ↗</a>.</p></noscript>
          <OutcomeQuiz quiz={finderQuiz} outcomes={outcomes} resultField="finder_result" requestType="find-my-service" sourcePage="/find-my-service" />
        </div>
      </div>
    </>
  );
}
