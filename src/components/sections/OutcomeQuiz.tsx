"use client";

import { useState } from "react";
import Link from "next/link";
import NetlifyForm, { CONSENT_FIELD, FormField } from "@/components/sections/NetlifyForm";
import { Quiz, rankOutcomes } from "@/lib/quiz";
import { toSnake, track } from "@/lib/track";

type Outcome = { title: string; description: string; href?: string; ctaLabel?: string };
type Props = { quiz: Quiz; outcomes: Record<string, Outcome>; resultField: "finder_result" | "structure_result"; requestType: string; sourcePage: string };

const fields: FormField[] = [
  { name: "name", label: "Full Name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  CONSENT_FIELD,
];

// Shared by "Find my service" and the "Business structure chooser": weighted answers → ranked outcomes.
export default function OutcomeQuiz({ quiz, outcomes, resultField, requestType, sourcePage }: Props) {
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [shown, setShown] = useState(false);
  const complete = quiz.questions.every((q) => picks[q.id] !== undefined);
  const ranked = rankOutcomes(quiz, picks).filter((r) => outcomes[r.id]).slice(0, quiz.topN);

  if (shown) {
    return (
      <div>
        <h2 className="text-2xl font-semibold text-text">{ranked.length > 1 ? "Your best matches" : "Your best match"}</h2>
        <ul className="mt-4 space-y-4">
          {ranked.map((r, i) => {
            const o = outcomes[r.id];
            return (
              <li key={r.id} className="rounded-md border border-border border-l-4 border-l-accent bg-bg p-5">
                {i === 0 && <p className="text-xs font-semibold uppercase tracking-wider text-primary">Best fit</p>}
                <h3 className="text-lg font-semibold text-text">{o.title}</h3>
                <p className="mt-1 text-sm text-muted">{o.description}</p>
                {o.href && <Link href={o.href} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">{o.ctaLabel ?? "Learn more"} →</Link>}
              </li>
            );
          })}
        </ul>
        {ranked.length === 0 && <p className="mt-4 text-muted">We could not match a single area — a short conversation with our team is the quickest way to find the right fit.</p>}
        {quiz.disclaimer && <p className="mt-4 text-xs text-muted">{quiz.disclaimer}</p>}
        <div className="mt-6"><button type="button" onClick={() => { setShown(false); setPicks({}); }} className="min-h-11 rounded-md border border-border px-6 py-3 font-medium text-text hover:border-primary">Start again</button></div>
        <section className="mt-10 rounded-md border border-border border-t-4 border-t-accent bg-surface p-6">
          <h2 className="text-xl font-semibold text-text">Talk to SCS about this</h2>
          <p className="mt-2 mb-5 text-sm text-muted">Share your details and we will follow up. We contact you only if you tick the consent box.</p>
          <NetlifyForm formName="enquiry" requestType={requestType} sourcePage={sourcePage} fields={fields} submitLabel="Contact me" successTitle="Thank you." successMessage="Our team will be in touch." extraHidden={{ [resultField]: ranked.map((r) => outcomes[r.id].title).join("; ") }} />
        </section>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); track("tool_completed", { tool_name: toSnake(requestType) }); setShown(true); }} className="space-y-8">
      {quiz.questions.map((q, qi) => (
        <fieldset key={q.id}>
          <legend className="mb-3 text-lg font-semibold text-text">{qi + 1}. {q.text}</legend>
          <div className="space-y-2">
            {q.options.map((o, oi) => (
              <label key={o.label} className="flex min-h-11 items-center gap-3 rounded-md border border-border px-3 text-text hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <input type="radio" name={q.id} required checked={picks[q.id] === oi} onChange={() => setPicks((p) => ({ ...p, [q.id]: oi }))} className="h-5 w-5" />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
      <button type="submit" disabled={!complete} className="min-h-11 rounded-md bg-primary px-7 py-3 text-lg font-medium text-white hover:bg-secondary disabled:opacity-50">See my result</button>
    </form>
  );
}
