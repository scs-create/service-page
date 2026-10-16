import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import OutcomeQuiz from "@/components/sections/OutcomeQuiz";
import { finderQuiz, SUPPORT_PACKAGES } from "@/content/loaders";
import { services } from "@/content/services/data";
import { CLUSTERS } from "@/lib/types";

export const metadata: Metadata = {
  title: "Find My Service",
  description: "Three quick questions to find the SCS areas of support and managed package that fit your business.",
};

export default function FinderPage() {
  // Outcomes: the six service areas + packages A–F (built from live CMS data) + the quiz's own (Corporate College).
  const outcomes = {
    ...Object.fromEntries(CLUSTERS.map((c) => [c.slug, { title: c.name, description: `Includes ${services.filter((s) => s.cluster === c.slug).map((s) => s.title).join(", ")}.`, href: `/services#${c.slug}`, ctaLabel: `Explore ${c.name}` }])),
    ...Object.fromEntries(SUPPORT_PACKAGES.map((p) => [`pkg-${p.id}`, { title: `Package ${p.id}: ${p.name}`, description: `${p.audience}. ${p.includes}.`, href: "/services#packages", ctaLabel: "See the packages" }])),
    ...finderQuiz.outcomes,
  };
  return (
    <>
      <PageHero eyebrow="Free tool" title={finderQuiz.title} intro={finderQuiz.intro} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-[760px]">
          <noscript><p className="rounded-md border border-border bg-surface p-4 text-text">This tool needs JavaScript. <Link href="/services" className="text-primary underline">Browse all services</Link> or <Link href="/contact#enquiry" className="text-primary underline">book a consultation</Link>.</p></noscript>
          <OutcomeQuiz quiz={finderQuiz} outcomes={outcomes} toolId="finder" resultField="finder_result" requestType="find-my-service" sourcePage="/find-my-service" />
        </div>
      </div>
    </>
  );
}
