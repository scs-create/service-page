import Link from "next/link";
import JsonLd from "@/components/ui/JsonLd";
import { SITE } from "@/lib/site";

export type Crumb = { label: string; href?: string };

// Visible trail ("Home > Section > Page") plus BreadcrumbList structured data built from the SAME items,
// so the markup always matches what visitors see. "Home" is added automatically; the last item is the
// current page (no link). Navy PageHero by default; tone="light" for pages without a hero.
export default function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const link = tone === "dark" ? "text-white/85 underline-offset-4 hover:text-accent hover:underline" : "text-primary hover:underline";
  const current = tone === "dark" ? "text-white" : "text-text";
  const sep = tone === "dark" ? "text-white/85" : "text-muted";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.label,
            ...(c.href && i < trail.length - 1 ? { item: `${SITE.url}${c.href === "/" ? "" : c.href}` } : {}),
          })),
        }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {trail.map((c, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={`${c.label}-${i}`} className="flex items-center gap-2">
                {last || !c.href ? (
                  <span aria-current={last ? "page" : undefined} className={current}>{c.label}</span>
                ) : (
                  <Link href={c.href} className={`inline-flex min-h-6 items-center ${link}`}>{c.label}</Link>
                )}
                {!last && <span aria-hidden="true" className={sep}>&gt;</span>}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
