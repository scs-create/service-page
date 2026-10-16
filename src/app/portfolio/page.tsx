import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CTAButton from "@/components/ui/CTAButton";
import PortfolioGrid from "@/components/sections/PortfolioGrid";
import { portfolio } from "@/content/portfolio/data";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected SCS engagements since 2025 across healthcare, real estate, technology, logistics, hospitality, agribusiness, non-profit and manufacturing — each with its CAC RC number.",
};

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Selected work delivered"
        title="Businesses We Have Helped Build"
        intro="A selection of engagements completed since 2025, one business, one problem, one intervention at a time. Confidential commercial details are withheld in line with client confidentiality; the structure, services and nature of the work are presented as delivered."
      />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <PortfolioGrid entries={portfolio} />
        <div className="mt-14 rounded-md bg-surface border border-border p-6 flex flex-wrap items-center gap-4">
          <p className="font-medium text-text">Want to check a registration number yourself?</p>
          <CTAButton href="/verification" label="Go to the Trust Hub" variant="secondary" />
          <CTAButton booking label="Book a Discovery Call" />
        </div>
      </div>
    </>
  );
}
