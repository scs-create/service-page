import Link from "next/link";
import type { Post } from "@/lib/posts";
import type { PortfolioEntry } from "@/lib/types";
import { registrationLabel } from "@/lib/types";

const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

// Related guide(s) and case study cards (docs/v2/design/Service.dc.html "Related").
export default function RelatedCards({ guides, caseStudies, title = "Related" }: { guides: Post[]; caseStudies: PortfolioEntry[]; title?: string }) {
  if (guides.length + caseStudies.length === 0) return null;
  const card = "block rounded-sm border border-border p-5 text-text hover:border-primary";
  return (
    <section aria-labelledby="related-title">
      <h2 id="related-title" className="mb-4 text-[24px] font-semibold leading-tight text-text md:text-[28px]">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <Link key={g.slug} href={`/corporate-college/corporate-school/${g.slug}`} className={card}>
            <span className="block text-xs text-muted">Guide · {date(g.date)}</span>
            <span className="mt-1.5 block font-semibold">{g.title} →</span>
          </Link>
        ))}
        {caseStudies.map((c) => (
          <Link key={c.slug} href={`/portfolio/${c.slug}`} className={card}>
            <span className="block text-xs text-muted">Case study{registrationLabel(c) ? ` · ${registrationLabel(c)}` : ""}</span>
            <span className="mt-1.5 block font-semibold">{c.client} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
