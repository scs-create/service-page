import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import ChecklistTool from "@/components/sections/ChecklistTool";
import { checklist, regulators } from "@/content/loaders";

export const metadata: Metadata = {
  title: "Compliance Starter Checklist",
  description: "A free compliance starter checklist by business type and sector, listing the Nigerian agencies to review. Save it as a PDF.",
};

export default function ChecklistPage() {
  return (
    <>
      <PageHero eyebrow="Free tool" title="Compliance Starter Checklist" intro="Choose your business type and sector for a starter checklist and the agencies to review." />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-[760px]">
          <noscript><p className="rounded-md border border-border bg-surface p-4 text-text">This tool needs JavaScript. <Link href="/contact#enquiry" className="text-primary underline">Contact us</Link> and we will prepare a checklist for your business.</p></noscript>
          <ChecklistTool types={checklist.types} sectors={checklist.sectors} regulatorNames={Object.fromEntries(regulators.map((r) => [r.code, r.name]))} disclaimer={checklist.disclaimer} />
        </div>
      </div>
    </>
  );
}
