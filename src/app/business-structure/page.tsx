import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { SITE } from "@/lib/site";
import OutcomeQuiz from "@/components/sections/OutcomeQuiz";
import { structureQuiz } from "@/content/loaders";

export const metadata: Metadata = {
  title: "Business Structure Chooser",
  description: "Business name, limited company or incorporated trustees? Four short questions and plain-language guidance on the most common business structures in Nigeria.",
};

export default function StructurePage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Free Tools", href: "/tools" }, { label: structureQuiz.title }]} eyebrow="Free tool" title={structureQuiz.title} intro={structureQuiz.intro} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-[760px]">
          <noscript><p className="rounded-md border border-border bg-surface p-4 text-text">This tool needs JavaScript. <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" className="text-primary underline">Book a Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span> ↗</a> and we will advise on the right structure.</p></noscript>
          <OutcomeQuiz quiz={structureQuiz} outcomes={structureQuiz.outcomes} resultField="structure_result" requestType="business-structure" sourcePage="/business-structure" />
        </div>
      </div>
    </>
  );
}
