import { FIT_WE_LOOK_FOR, FIT_YOU_CAN_EXPECT } from "@/content/v2/pages";

// "Are we a fit?" navy band (design/Partnership.dc.html), shared by Partnership and the audience pages.
export default function FitBand({ title = "A partnership works when it works for both sides." }: { title?: string }) {
  return (
    <section id="fit" aria-labelledby="fit-title" className="dark-surface border-t-4 border-accent bg-secondary text-white">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
        <p className="type-eyebrow mb-3 text-accent">Are we a fit?</p>
        <h2 id="fit-title" className="type-h2 mb-10 max-w-[26ch] text-white">{title}</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="border-t border-white/25 pt-5">
            <h3 className="mb-3 text-lg font-semibold">What we look for</h3>
            <ul className="list-disc space-y-2 pl-5 text-white/85">{FIT_WE_LOOK_FOR.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
          <div className="border-t border-white/25 pt-5">
            <h3 className="mb-3 text-lg font-semibold">What you can expect from us</h3>
            <ul className="list-disc space-y-2 pl-5 text-white/85">{FIT_YOU_CAN_EXPECT.map((t) => <li key={t}>{t}</li>)}</ul>
          </div>
        </div>
        <p className="type-lead mt-10 text-white">If we are not the right fit for a need, we will say so.</p>
      </div>
    </section>
  );
}
