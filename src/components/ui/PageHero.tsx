import type { ReactNode } from "react";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: ReactNode; // breadcrumb, CTAs etc.
};

// Navy page-opener band used on every inner page (one H1 per page).
export default function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section className="dark-surface bg-secondary border-b-4 border-accent">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {children && <div className="mb-6">{children}</div>}
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-2">{eyebrow}</p>
        )}
        <h1 className="text-3xl md:text-5xl font-semibold text-white max-w-[24ch] md:max-w-[28ch]">{title}</h1>
        {intro && <p className="mt-4 text-base md:text-lg text-white/85 max-w-[65ch]">{intro}</p>}
      </div>
    </section>
  );
}
