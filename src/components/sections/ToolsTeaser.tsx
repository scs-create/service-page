import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { TOOLS } from "@/content/toolsList";

export default function ToolsTeaser({ limit = 3 }: { limit?: number }) {
  return (
    <section data-location="tools_teaser" className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeading eyebrow="Free tools" title="Start with a quick, useful first step" intro="No commitment. Find out where your business stands and what to do next." />
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TOOLS.slice(0, limit).map((t) => (
            <li key={t.href}>
              <Link href={t.href} data-track={`Tool: ${t.title}`} className="lift reveal block h-full rounded-md border border-border border-t-4 border-t-accent bg-bg p-6">
                <h3 className="text-lg font-semibold text-text">{t.title}</h3>
                <p className="mt-2 text-sm text-muted">{t.text}</p>
                <span className="mt-4 inline-block text-sm font-medium text-primary">Start →</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8"><Link href="/tools" className="text-sm font-medium text-primary hover:underline">See all free tools →</Link></div>
      </div>
    </section>
  );
}
