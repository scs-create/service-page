// "What happens next" in three steps: every v2 template ends with it (strategy §7, 05-SITE-SPEC.md §3).
export type Step = { title: string; text?: string };

export default function WhatHappensNext({ steps, title = "Three steps from here.", children }: { steps: Step[]; title?: string; children?: React.ReactNode }) {
  return (
    <section aria-labelledby="next-title" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:px-6 md:py-20 lg:px-8">
        <p className="type-eyebrow mb-3 text-primary">What happens next</p>
        <h2 id="next-title" className="type-h2 mb-8 text-text">{title}</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="border-t border-border pt-4">
              <span className="tabular text-[28px] font-semibold text-primary">{i + 1}</span>
              <p className="mt-2 font-semibold text-text">{s.title}</p>
              {s.text && <p className="mt-1 text-sm text-muted">{s.text}</p>}
            </li>
          ))}
        </ol>
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
