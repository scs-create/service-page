import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SiteSearch from "@/components/v2/SiteSearch";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the services, guides, case studies, tools and pages on this site.",
  alternates: { canonical: "/search" },
};

// Search (05-SITE-SPEC.md §1): the static index at /search-index.json, searched in the browser.
export default function SearchPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Search" }]} eyebrow="Search" title="Search this site" intro="Services, guides, case studies, tools and pages." />
      <div className="mx-auto max-w-[760px] px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <SiteSearch />
        <noscript>
          <p className="mt-6 rounded-sm border border-border bg-surface p-4">
            Search needs JavaScript. Browse <Link href="/services" className="text-primary underline">all services</Link> or the{" "}
            <Link href="/corporate-college/corporate-school" className="text-primary underline">Corporate School guides</Link> instead.
          </p>
        </noscript>
      </div>
    </>
  );
}
