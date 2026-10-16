import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { TOOLS } from "@/content/toolsList";

export const metadata: Metadata = {
  title: "Free Tools",
  description: "Free tools from SCS: assess your business, build a compliance starter checklist, choose a business structure, find the right service and track compliance obligations.",
};

export default function ToolsPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Free Tools" }]} eyebrow="Free tools" title="Practical first steps, no commitment" intro="Quick tools to show where your business stands and what to do next. Your answers stay on your device unless you choose to send them to us." />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <Link href={t.href} data-track={`Tool: ${t.title}`} className="lift reveal block h-full rounded-md border border-border border-t-4 border-t-accent bg-bg p-6">
                <h2 className="text-lg font-semibold text-text">{t.title}</h2>
                <p className="mt-2 text-sm text-muted">{t.text}</p>
                <span className="mt-4 inline-block text-sm font-medium text-primary">Open →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
