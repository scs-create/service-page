import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/ui/Breadcrumbs";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  breadcrumbs?: Crumb[]; // trail after "Home"; the last item is this page
  meta?: string; // small line under the intro (e.g. an article's date and reading time)
  children?: ReactNode; // CTAs etc.
};

// Page opener on every inner page (one H1 per page). Direction B (docs/v2/design/Service.dc.html): a light
// `surface` band with a hairline under it, a serif H1, the 56×4px gold rule and a muted lead. Navy is kept for the
// few bands the spec names (process, "Are we a fit?", footer).
export default function PageHero({ eyebrow, title, intro, breadcrumbs, meta, children }: PageHeroProps) {
  return (
    <section data-location="page_hero" className="border-b border-border bg-surface">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-16">
        {breadcrumbs && <div className="mb-6"><Breadcrumbs items={breadcrumbs} /></div>}
        {eyebrow && <p className="type-eyebrow mb-2 text-primary">{eyebrow}</p>}
        <h1 className="type-h1 max-w-[20ch] text-text">{title}</h1>
        <span aria-hidden="true" className="my-6 block h-1 w-14 rounded-sm bg-accent" />
        {intro && <p className="type-lead max-w-[62ch] text-muted">{intro}</p>}
        {meta && <p className="mt-4 text-sm text-muted">{meta}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
