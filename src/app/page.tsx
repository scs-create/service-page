import Link from "next/link";
import HeroSkyline from "@/components/sections/HeroSkyline";
import TowerMark from "@/components/brand/TowerMark";
import { getPortfolioBySlug, portfolio } from "@/content/portfolio/data";
import { getAllPosts } from "@/lib/posts";
import { registrationLabel } from "@/lib/types";
import { SITE } from "@/lib/site";
import { FIGURES, HOME_HERO, PARTNER_RECEIVES, SIX_STEPS, START_HERE } from "@/content/v2/pages";

// H: Home, Direction B (docs/v2/05-SITE-SPEC.md §3, design/Main.dc.html). Sections in order: hero with the tower and
// the registration record, figures, Start here, process, partnership, selected work, Corporate School, closing.
// Mobile keeps every section but condenses it: carousels (.snap-row), <details> panels, a 2×2 figure grid.
const WRAP = "mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8";
const SELECTED_WORK = ["premier-pharmaceuticals-ltd", "verihomes-ltd", "light-bearers-education-empowerment-foundation"];
const date = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function Rule({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block h-1 w-14 rounded-sm bg-accent ${className}`} />;
}

const Check = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.25" className="mt-1 flex-none">
    <path d="M5 12l5 5L20 7" />
  </svg>
);

export default function Home() {
  const work = SELECTED_WORK.map(getPortfolioBySlug).filter((p) => !!p);
  const guides = getAllPosts().slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="hero-title" data-location="hero" className="border-b border-border">
        <div className={`${WRAP} grid items-center gap-5 py-6 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-14 md:py-20`}>
          <div>
            {/* The tower is the SCS symbol and stays in the hero on every screen (docs/v2/02-DECISIONS.md §4):
                on mobile a 116px mark over a gold rule beside the tagline, from md up the full skyline. */}
            <div className="mb-5 flex items-end gap-4 md:hidden">
              <TowerMark height={116} rule className="flex-none" />
              <p className="type-eyebrow pb-3 text-primary">{SITE.tagline}</p>
            </div>
            <p className="type-eyebrow mb-4 text-primary">{HOME_HERO.eyebrow}</p>
            <h1 id="hero-title" className="type-h1 max-w-[18ch] text-text">{HOME_HERO.title}</h1>
            <Rule className="my-5 md:my-6" />
            <p className="type-lead max-w-[60ch] text-muted">{HOME_HERO.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" data-location="hero" className="inline-flex min-h-12 items-center rounded-md bg-primary px-6 font-medium text-white transition-colors hover:bg-secondary">
                Book a Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span>
              </a>
              <Link href="/process" className="font-medium text-primary hover:underline">See our process →</Link>
            </div>
            <p className="mt-4 text-sm text-muted">{HOME_HERO.note}</p>
          </div>

          <div className="hidden md:block">
            <HeroSkyline className="mx-auto h-auto w-full max-w-[340px]" />
            <aside aria-label="Registration record" className="mt-8 rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6">
              <dl className="space-y-3 text-sm">
                <div><dt className="text-muted">Company</dt><dd className="font-medium text-text">{SITE.titleName}</dd></div>
                <div><dt className="text-muted">RC number</dt><dd className="tabular font-medium text-text">{SITE.rc} · Corporate Affairs Commission (CAC)</dd></div>
                <div><dt className="text-muted">Office</dt><dd className="font-medium text-text">SD20 Belham Estate, Karsana, FCT, Abuja</dd></div>
              </dl>
              <Link href="/verification" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">Verify our registration →</Link>
            </aside>
          </div>

          <details className="rounded-sm border border-border bg-bg md:hidden">
            <summary className="flex min-h-12 cursor-pointer items-center px-4 text-sm font-medium text-text">Registered with the CAC · RC {SITE.rc}</summary>
            <div className="space-y-1 px-4 pb-4 text-sm text-muted">
              <p className="text-text">{SITE.titleName}</p>
              <p>SD20 Belham Estate, Karsana, FCT, Abuja</p>
              <Link href="/verification" className="inline-block pt-1 font-medium text-primary hover:underline">Verify our registration →</Link>
            </div>
          </details>
        </div>
      </section>

      {/* FIGURES: definitions only, no "as at" dates (owner decision 2) */}
      <section aria-label={`${SITE.titleName} in figures`} className="border-b border-border">
        <div className={`${WRAP} grid grid-cols-2 gap-x-4 gap-y-5 py-6 md:grid-cols-4 md:gap-8 md:py-10`}>
          {FIGURES.map((f) => (
            <div key={f.value}>
              <p className="tabular text-[28px] font-semibold text-primary md:text-[40px]">{f.value}</p>
              <p className="mt-1 text-sm text-muted">{f.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* START HERE: descriptions hidden on mobile */}
      <section aria-labelledby="start-title">
        <div className={`${WRAP} py-11 md:py-24`}>
          <p className="type-eyebrow mb-3 text-primary">Start here</p>
          <h2 id="start-title" className="type-h2 text-text">Where would you like to begin?</h2>
          <Rule className="mb-6 mt-4 md:mb-9" />
          <ul className="grid border-t border-border md:grid-cols-2 md:gap-x-10">
            {START_HERE.map((s) => (
              <li key={s.href} className="border-b border-border">
                <Link href={s.href} className="group block py-3.5 md:py-5 md:pr-6">
                  <span className="block font-medium text-text group-hover:text-primary md:text-lg">{s.title} →</span>
                  <span className="mt-1 hidden text-sm text-muted md:block">{s.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROCESS: navy band, six steps; a carousel on mobile */}
      <section aria-labelledby="how-title" className="dark-surface border-t-4 border-accent bg-secondary text-white">
        <div className={`${WRAP} py-11 md:py-24`}>
          <p className="type-eyebrow mb-3 text-accent">Our process</p>
          <h2 id="how-title" className="type-h2 max-w-[24ch] text-white">Every engagement follows the same six steps.</h2>
          <p className="type-lead mt-4 max-w-[60ch] text-white/85">
            Nothing starts until the scope is agreed in writing, and nothing reaches you before our management team has reviewed it.
          </p>
          <ol tabIndex={0} aria-label="The six steps (scroll sideways on small screens)" className="snap-row mt-8 md:grid-cols-6 md:gap-6">
            {SIX_STEPS.map((s, i) => (
              <li key={s.title} className="border-t-2 border-accent pt-4">
                <span className="tabular text-sm font-semibold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-2 block font-semibold text-white">{s.title}</span>
                <span className="mt-1 block text-sm text-white/85">{s.text}</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-white/85 md:hidden">Swipe to see all six steps →</p>
          <Link href="/process" className="mt-8 inline-block font-medium text-white hover:text-accent hover:underline">What we do and do not do →</Link>
        </div>
      </section>

      {/* PARTNERSHIP IN BRIEF */}
      <section aria-labelledby="partner-title" className="bg-surface">
        <div className={`${WRAP} grid gap-8 py-11 md:grid-cols-2 md:gap-14 md:py-24`}>
          <div>
            <p className="type-eyebrow mb-3 text-primary">SCS Partnership</p>
            <h2 id="partner-title" className="type-h2 text-text">A retainership plan agreed with each partner.</h2>
            <Rule className="my-5" />
            <p className="text-muted">
              For organisations with recurring corporate, filing, documentation and operational needs. We first check that we are right for each other, then
              build the plan around your organisation.
            </p>
            <Link href="/partnership" className="mt-6 inline-block font-medium text-primary hover:underline">Start a partnership conversation →</Link>
          </div>
          <div className="hidden rounded-sm border border-border border-t-4 border-t-accent bg-bg p-7 md:block">
            <h3 className="text-lg font-semibold text-text">What partners receive</h3>
            <ul className="mt-3">
              {[...PARTNER_RECEIVES.map((p) => p.title), "Management quality review before anything is delivered"].map((t) => (
                <li key={t} className="flex gap-3 border-t border-border py-3">{<Check />}<span>{t}</span></li>
              ))}
            </ul>
          </div>
          <details className="rounded-sm border border-border bg-bg md:hidden">
            <summary className="flex min-h-12 cursor-pointer items-center px-4 font-medium text-text">What partners receive (5)</summary>
            <ul className="list-disc space-y-1.5 px-4 pb-4 pl-9 text-sm text-text">
              {[...PARTNER_RECEIVES.map((p) => p.title), "Management quality review before anything is delivered"].map((t) => <li key={t}>{t}</li>)}
            </ul>
          </details>
        </div>
      </section>

      {/* SELECTED WORK: a carousel on mobile */}
      <section aria-labelledby="work-title">
        <div className={`${WRAP} py-11 md:py-24`}>
          <p className="type-eyebrow mb-3 text-primary">Selected work</p>
          <h2 id="work-title" className="type-h2 text-text">Engagements you can check on the public register.</h2>
          <Rule className="mb-8 mt-4" />
          <div tabIndex={0} role="region" aria-label="Selected case studies (scroll sideways on small screens)" className="snap-row md:grid-cols-3 md:gap-6">
            {work.map((p) => (
              <article key={p!.slug} className="flex flex-col rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-muted">{p!.sector}</p>
                <h3 className="mt-2 text-lg font-semibold text-text">{p!.client}</h3>
                {registrationLabel(p!) && <p className="tabular text-sm text-muted">{registrationLabel(p!)}</p>}
                <ul className="mt-4 flex-1 list-disc space-y-1.5 pl-5 text-sm text-text">
                  {p!.delivered.slice(0, 2).map((d) => <li key={d}>{d}</li>)}
                </ul>
                <Link href={`/portfolio/${p!.slug}`} className="mt-5 text-sm font-medium text-primary hover:underline">Read the case study →</Link>
              </article>
            ))}
          </div>
          <Link href="/portfolio" className="mt-8 inline-block font-medium text-primary hover:underline">All {portfolio.length} case studies →</Link>
        </div>
      </section>

      {/* CORPORATE SCHOOL: latest three guides, a carousel on mobile */}
      <section aria-labelledby="guides-title" className="border-t border-border">
        <div className={`${WRAP} py-11 md:py-24`}>
          <p className="type-eyebrow mb-3 text-primary">Corporate School</p>
          <h2 id="guides-title" className="type-h2 text-text">Practical guides, dated and sourced.</h2>
          <Rule className="mb-8 mt-4" />
          <div tabIndex={0} role="region" aria-label="Latest guides (scroll sideways on small screens)" className="snap-row md:grid-cols-3 md:gap-6">
            {guides.map((g) => (
              <Link key={g.slug} href={`/corporate-college/corporate-school/${g.slug}`} className="block rounded-sm border border-border p-6 hover:border-primary">
                <span className="block text-xs text-muted">Guide{g.category ? ` · ${g.category}` : ""} · {date(g.date)}</span>
                <span className="mt-2 block font-semibold text-text">{g.title}</span>
              </Link>
            ))}
          </div>
          <Link href="/corporate-college/corporate-school" className="mt-8 inline-block font-medium text-primary hover:underline">All guides →</Link>
        </div>
      </section>

      {/* CLOSING */}
      <section aria-labelledby="close-title" className="border-t border-border bg-surface">
        <div className={`${WRAP} flex flex-col gap-6 py-11 md:flex-row md:items-center md:justify-between md:py-20`}>
          <div>
            <h2 id="close-title" className="type-h2 text-text">Not sure where to start?</h2>
            <p className="mt-3 max-w-[60ch] text-muted">A 30-minute Discovery Call is the simplest first step. If we are not the right fit for a need, we will say so.</p>
          </div>
          <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" data-location="closing" className="inline-flex min-h-12 flex-none items-center justify-center rounded-md bg-primary px-6 font-medium text-white transition-colors hover:bg-secondary">
            Book a Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span>
          </a>
        </div>
      </section>
    </>
  );
}
