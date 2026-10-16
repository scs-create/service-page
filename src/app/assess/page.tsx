import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { SITE } from "@/lib/site";
import AssessmentTool from "@/components/sections/AssessmentTool";
import { assessment, industries, partnership, regulatorName } from "@/content/loaders";
import { services } from "@/content/services/data";

export const metadata: Metadata = {
  title: "Assess your Business",
  description: "Free business assessment: twelve quick questions across registration, compliance, tax, contracts, people, data protection, brand, operations and growth, with a scored result and clear next steps.",
};

export default function AssessPage() {
  const sectorNotes = Object.fromEntries(industries.map((i) => [i.name, { needs: i.needs, regulators: i.regulators.map(regulatorName) }]));
  const serviceTitles = Object.fromEntries(services.map((s) => [s.slug, s.title]));
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Free Tools", href: "/tools" }, { label: "Assess your Business" }]} eyebrow="Free tool" title="Assess your Business" intro="Twelve quick questions. A scored result, where the issues are, what to do, how to do it and how SCS can help." />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-[760px]">
          <noscript><p className="rounded-md border border-border bg-surface p-4 text-text">This assessment needs JavaScript. You can <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" className="text-primary underline">book a Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span> ↗</a> instead and we will walk through the same questions with you.</p></noscript>
          <AssessmentTool assessment={assessment} sectors={industries.map((i) => i.name)} sectorNotes={sectorNotes} serviceTitles={serviceTitles} partnershipNote={partnership.visitorAssessmentNote} />
        </div>
      </div>
    </>
  );
}
