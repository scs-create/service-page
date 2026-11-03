import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CTAButton from "@/components/ui/CTAButton";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import { portfolio } from "@/content/portfolio/data";

export const metadata: Metadata = {
  title: "Portfolio",
  alternates: { canonical: "/portfolio" },
  description: "Selected SCS engagements across healthcare, finance and investment, education, construction, real estate, technology, logistics, hospitality, agribusiness, non-profit and manufacturing, with CAC registration numbers you can verify.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Case studies" }]}
        eyebrow="Selected work delivered"
        title={`${portfolio.length} engagements you can check`}
        intro="A selection of engagements completed by SCS, one business, one problem, one intervention at a time. Confidential commercial details are withheld in line with client confidentiality; the structure, services and nature of the work are presented as delivered."
      />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <PortfolioGrid entries={portfolio} />
        <div className="mt-14 rounded-sm bg-surface border border-border p-6 flex flex-wrap items-center gap-4">
          <p className="font-medium text-text">Want to check a registration number yourself?</p>
          <CTAButton href="/verification" label="Verify our clients" variant="secondary" />
          <CTAButton booking label="Book a Discovery Call" />
        </div>
      </div>
    </>
  );
}
