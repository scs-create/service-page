"use client";

import { useState } from "react";
import Link from "next/link";
import NetlifyForm from "@/components/sections/NetlifyForm";
import { CONSENT_FIELD, type FormField } from "@/lib/formSchema";
import { Answer, Assessment, scoreAssessment } from "@/lib/assessment";
import { track } from "@/lib/track";

type SectorNote = { regulators: string[]; needs: string[] };
type Props = {
  assessment: Assessment;
  sectors: string[];
  sectorNotes: Record<string, SectorNote>;
  serviceTitles: Record<string, string>;
  partnershipNote: string;
};

const ANSWERS: { label: string; value: Answer }[] = [
  { label: "Yes, fully in place", value: 2 },
  { label: "Partly", value: 1 },
  { label: "No, or not sure", value: 0 },
];
const STATUS = {
  0: { text: "Needs attention", cls: "border-error text-error" },
  1: { text: "Developing", cls: "border-accent bg-accent/25 text-secondary" },
  2: { text: "In place", cls: "border-success text-success" },
} as const;
const leadFields: FormField[] = [
  { name: "name", label: "Full Name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  { name: "organisation", label: "Organisation", type: "text", autoComplete: "organization" },
  CONSENT_FIELD,
];
const OPTION = "flex min-h-11 items-center gap-3 rounded-md border border-border px-3 text-text hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5";

// "Assess your Business": 3 profile questions + one scored question per area. Scoring is fixed rules, no AI.
export default function AssessmentTool({ assessment, sectors, sectorNotes, serviceTitles, partnershipNote }: Props) {
  const [step, setStep] = useState(0);
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [size, setSize] = useState("");
  const [scores, setScores] = useState<Record<string, Answer>>({});

  const total = 3 + assessment.domains.length;
  const done = step >= total;
  const stageLabel = assessment.stages.find((s) => s.id === stage)?.label ?? "";
  const result = scoreAssessment(assessment, stage, scores);
  const note = sectorNotes[sector];

  function renderOptions(name: string, options: { label: string; value: string }[], selected: string, onPick: (v: string) => void) {
    return (
      <div className="space-y-2">
        {options.map((o) => (
          <label key={o.value} className={OPTION}>
            <input type="radio" name={name} value={o.value} checked={selected === o.value} onChange={() => onPick(o.value)} className="h-5 w-5" />
            {o.label}
          </label>
        ))}
      </div>
    );
  }

  if (!done) {
    const dIdx = step - 3;
    const domain = dIdx >= 0 ? assessment.domains[dIdx] : null;
    const ready = step === 0 ? !!sector : step === 1 ? !!stage : step === 2 ? !!size : scores[domain!.id] !== undefined;
    const title = step === 0 ? "Which sector is your business in?" : step === 1 ? "Where is your business right now?" : step === 2 ? "How big is your team?" : domain!.question;
    const next = () => {
      if (step + 1 >= total) track("tool_completed", { tool_name: "assessment", result_band: scoreAssessment(assessment, stage, scores).band });
      setStep(step + 1);
    };
    return (
      <div>
        <p className="text-sm font-medium text-secondary" aria-live="polite">Question {step + 1} of {total}</p>
        <div role="progressbar" aria-label="Assessment progress" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step + 1} className="mt-2 mb-6 h-2 rounded-full bg-surface">
          <div className="h-2 rounded-full bg-accent transition-[width]" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <fieldset>
          <legend className="mb-4 text-xl font-semibold text-text">{title}</legend>
          {step === 0 && renderOptions("sector", [...sectors, "Other"].map((s) => ({ label: s, value: s })), sector, setSector)}
          {step === 1 && renderOptions("stage", assessment.stages.map((s) => ({ label: s.label, value: s.id })), stage, setStage)}
          {step === 2 && renderOptions("size", assessment.sizes.map((s) => ({ label: s, value: s })), size, setSize)}
          {domain && renderOptions(domain.id, ANSWERS.map((a) => ({ label: a.label, value: String(a.value) })), scores[domain.id] === undefined ? "" : String(scores[domain.id]), (v) => setScores((s) => ({ ...s, [domain.id]: Number(v) as Answer })))}
        </fieldset>
        <div className="mt-6 flex gap-3">
          {step > 0 && <button type="button" onClick={() => setStep(step - 1)} className="min-h-11 rounded-md border border-primary px-6 py-3 font-medium text-primary hover:bg-primary/5">Back</button>}
          <button type="button" disabled={!ready} onClick={next} className="min-h-11 rounded-md bg-primary px-7 py-3 text-lg font-medium text-white hover:bg-secondary disabled:opacity-50">
            {step + 1 >= total ? "See my result" : "Next"}
          </button>
        </div>
      </div>
    );
  }

  const top = result.gaps.slice(0, 5);
  const rest = result.gaps.slice(5);
  return (
    <div>
      <div className="print-area">
        <div className="rounded-md bg-secondary p-6 text-white dark-surface">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Your result</p>
          <p className="mt-1 text-5xl font-semibold tabular-nums">{result.percent}%</p>
          <p className="mt-1 text-lg">{result.band}</p>
          <p className="mt-2 text-sm text-white/85">{[sector, stageLabel, size].filter(Boolean).join(" · ")}</p>
        </div>

        <h2 className="mt-8 mb-3 text-xl font-semibold text-text">Area by area</h2>
        <ul className="space-y-3">
          {result.domains.map((d) => (
            <li key={d.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-text">{d.label}</span>
                <span className={`rounded-sm border px-2 py-0.5 text-xs font-semibold ${STATUS[d.score].cls}`}>{STATUS[d.score].text}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-surface" role="img" aria-label={`${d.label}: ${STATUS[d.score].text}`}>
                <div className="h-2 rounded-full bg-primary" style={{ width: `${(d.score / 2) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>

        {top.length > 0 && <h2 className="mt-10 mb-3 text-xl font-semibold text-text">What to do first</h2>}
        <div className="space-y-5">
          {top.map((d) => (
            <article key={d.id} className="rounded-md border border-border border-l-4 border-l-accent bg-bg p-5">
              <h3 className="text-lg font-semibold text-text">{d.label} <span className={`ml-2 rounded-sm border px-2 py-0.5 align-middle text-xs font-semibold ${STATUS[d.score].cls}`}>{STATUS[d.score].text}</span></h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div><dt className="font-semibold text-secondary">Where the issue is</dt><dd className="text-muted">{d.issue}</dd></div>
                <div><dt className="font-semibold text-secondary">What to do</dt><dd className="text-muted">{d.action}</dd></div>
                <div><dt className="font-semibold text-secondary">How to do it</dt><dd className="text-muted">{d.how}</dd></div>
                <div><dt className="font-semibold text-secondary">How SCS can help</dt><dd className="text-muted">{d.help}</dd></div>
              </dl>
              <p className="mt-3 text-sm">
                <Link href={`/services/${d.serviceSlug}`} className="font-medium text-primary hover:underline">{serviceTitles[d.serviceSlug] ?? "View service"} →</Link>
                {d.related.length > 0 && (
                  <span className="text-muted"> · Related: {d.related.map((r, i) => (<span key={r}>{i > 0 && ", "}<Link href={`/services/${r}`} className="text-primary hover:underline">{serviceTitles[r] ?? r}</Link></span>))}</span>
                )}
              </p>
            </article>
          ))}
        </div>
        {rest.length > 0 && <p className="mt-4 text-sm text-muted">Also worth reviewing: {rest.map((d) => d.label).join(", ")}.</p>}
        {top.length === 0 && <p className="mt-6 text-text">Every area is in place. Keep reviewing it regularly as the business grows.</p>}

        {note && (
          <div className="mt-8 rounded-md bg-surface p-5 text-sm">
            <h3 className="font-semibold text-secondary">For {sector} businesses</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">{note.needs.map((n) => <li key={n}>{n}</li>)}</ul>
            <p className="mt-2 text-muted"><span className="font-medium text-text">Agencies to review:</span> {note.regulators.join("; ")}.</p>
          </div>
        )}
        <p className="mt-6 text-xs text-muted">This assessment is a general guide, not legal, tax or financial advice. It reflects only the answers you gave.</p>
      </div>

      <p className="no-print mt-6 rounded-md border border-border bg-surface p-4 text-sm text-muted">{partnershipNote}</p>
      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={() => window.print()} className="min-h-11 rounded-md border border-primary px-6 py-3 font-medium text-primary hover:bg-primary/5">Print or save as PDF</button>
        <button type="button" onClick={() => { setStep(0); setScores({}); }} className="min-h-11 rounded-md border border-border px-6 py-3 font-medium text-text hover:border-primary">Start again</button>
      </div>

      <section className="no-print mt-10 rounded-md border border-border border-t-4 border-t-accent bg-surface p-6">
        <h2 className="text-xl font-semibold text-text">Want us to walk you through your results?</h2>
        <p className="mt-2 mb-5 text-sm text-muted">If you send your details, SCS can see your answers and results, to prepare for the conversation and to improve our services. We contact you about this only if you tick the consent box.</p>
        <NetlifyForm
          formName="enquiry" requestType="business-assessment" sourcePage="/assess" fields={leadFields} submitLabel="Send my results to SCS"
          successTitle="Thank you." successMessage="Your results have reached our team. We will contact you about them directly."
          extraHidden={{ assessment_score: String(result.percent), assessment_band: result.band, assessment_gaps: result.gaps.map((g) => g.label).join("; "), assessment_answers: JSON.stringify({ sector, stage, size, scores }), sector, business_stage: stageLabel, team_size: size }}
        />
      </section>
    </div>
  );
}
