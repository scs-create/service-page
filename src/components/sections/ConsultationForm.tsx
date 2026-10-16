"use client";

import { useEffect, useRef, useState, useSyncExternalStore, FormEvent } from "react";
import { submitToNetlify } from "@/lib/forms";
import { track } from "@/lib/track";
import { FormError, FormSuccess, SUBMIT_ERROR } from "@/components/sections/NetlifyForm";

const NEEDS = [
  "Registering or structuring a business", "Licences, permits and compliance", "Tax, accounting and finance", "HR, recruitment and staff",
  "Contracts and legal documentation", "Data protection and privacy", "Operations and outsourcing", "Marketing, brand and growth",
  "Training (Corporate College)", "Something else / not sure",
];
const STAGES = ["Just an idea", "Starting up (first year)", "Operating (1–3 years)", "Established (3+ years)"];
const SIZES = ["Just me", "2–10 people", "11–50 people", "More than 50"];
const STEPS = ["What you need", "Your business", "Your details"];
const noopSubscribe = () => () => {};
const INPUT = "w-full min-h-11 border border-border rounded-sm px-3 py-2 text-base";
const LABEL = "block text-sm font-medium text-text mb-1.5";

// Three steps (need → business stage → details) posting to the "enquiry" bucket as request_type=consultation.
// Without JavaScript all three steps show at once and the form posts natively.
export default function ConsultationForm({ sectors }: { sectors: string[] }) {
  const js = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const fieldsets = useRef<(HTMLFieldSetElement | null)[]>([]);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);

  useEffect(() => {
    if (step > 0) headings.current[step]?.focus();
  }, [step]);

  function next() {
    const controls = fieldsets.current[step]?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input,select,textarea") ?? [];
    for (const c of controls) if (!c.reportValidity()) return;
    track("Form Step", { form: "consultation", step: step + 1 });
    setStep((s) => s + 1);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await submitToNetlify(e.currentTarget);
      track("Form Submit", { form: "consultation" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") return <FormSuccess title="Consultation request received." message="Thank you — a member of our team will contact you directly." />;

  const show = (i: number) => !js || step === i;
  return (
    <form name="enquiry" method="POST" action="/__forms.html" onSubmit={onSubmit} className="space-y-6">
      <input type="hidden" name="form-name" value="enquiry" />
      <input type="hidden" name="request_type" value="consultation" />
      <input type="hidden" name="source_page" value="/contact" />
      <p className="hidden"><label>Don&apos;t fill this out if you&apos;re human: <input name="bot-field" /></label></p>

      {js && (
        <div>
          <p className="text-sm font-medium text-secondary" aria-live="polite">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
          <div role="progressbar" aria-label="Form progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} className="mt-2 h-2 rounded-full bg-surface">
            <div className="h-2 rounded-full bg-accent transition-[width]" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>
      )}

      <fieldset ref={(el) => { fieldsets.current[0] = el; }} className={show(0) ? "space-y-2" : "hidden"}>
        <legend className="mb-2 text-lg font-semibold text-text"><h3 ref={(el) => { headings.current[0] = el; }} tabIndex={-1}>What do you need help with?</h3></legend>
        {NEEDS.map((n) => (
          <label key={n} className="flex min-h-11 items-center gap-3 rounded-md border border-border px-3 text-sm text-text hover:border-primary">
            <input type="radio" name="need" value={n} required className="h-5 w-5" />
            {n}
          </label>
        ))}
      </fieldset>

      <fieldset ref={(el) => { fieldsets.current[1] = el; }} className={show(1) ? "space-y-5" : "hidden"}>
        <legend className="mb-2 text-lg font-semibold text-text"><h3 ref={(el) => { headings.current[1] = el; }} tabIndex={-1}>Tell us about your business</h3></legend>
        <div>
          <label htmlFor="c-stage" className={LABEL}>Business stage <span aria-hidden="true" className="text-error">*</span></label>
          <select id="c-stage" name="business_stage" required defaultValue="" className={`${INPUT} bg-bg`}>
            <option value="" disabled>Select one</option>
            {STAGES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="c-sector" className={LABEL}>Sector <span aria-hidden="true" className="text-error">*</span></label>
          <select id="c-sector" name="sector" required defaultValue="" className={`${INPUT} bg-bg`}>
            <option value="" disabled>Select one</option>
            {[...sectors, "Other"].map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="c-size" className={LABEL}>Team size <span className="font-normal text-muted">(optional)</span></label>
          <select id="c-size" name="team_size" defaultValue="" className={`${INPUT} bg-bg`}>
            <option value="">Prefer not to say</option>
            {SIZES.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      </fieldset>

      <fieldset ref={(el) => { fieldsets.current[2] = el; }} className={show(2) ? "space-y-5" : "hidden"}>
        <legend className="mb-2 text-lg font-semibold text-text"><h3 ref={(el) => { headings.current[2] = el; }} tabIndex={-1}>How can we reach you?</h3></legend>
        <p className="text-sm text-muted"><span aria-hidden="true" className="text-error">*</span> Required field</p>
        <div>
          <label htmlFor="c-name" className={LABEL}>Full Name <span aria-hidden="true" className="text-error">*</span></label>
          <input id="c-name" name="name" type="text" required maxLength={200} autoComplete="name" className={INPUT} />
        </div>
        <div>
          <label htmlFor="c-email" className={LABEL}>Email <span aria-hidden="true" className="text-error">*</span></label>
          <input id="c-email" name="email" type="email" required maxLength={254} autoComplete="email" className={INPUT} />
        </div>
        <div>
          <label htmlFor="c-phone" className={LABEL}>Phone <span className="font-normal text-muted">(optional)</span></label>
          <input id="c-phone" name="phone" type="tel" maxLength={25} autoComplete="tel" className={INPUT} />
        </div>
        <div>
          <label htmlFor="c-org" className={LABEL}>Organisation <span className="font-normal text-muted">(optional)</span></label>
          <input id="c-org" name="organisation" type="text" maxLength={200} autoComplete="organization" className={INPUT} />
        </div>
        <div>
          <label htmlFor="c-msg" className={LABEL}>Anything else we should know? <span className="font-normal text-muted">(optional)</span></label>
          <textarea id="c-msg" name="message" rows={4} maxLength={2000} className="w-full border border-border rounded-sm px-3 py-2 text-base" />
        </div>
        <label htmlFor="c-consent" className="flex items-start gap-3 text-sm text-text">
          <input id="c-consent" name="consent_contact" type="checkbox" value="yes" required className="mt-1 h-5 w-5 shrink-0" />
          <span>I agree that SCS may contact me about this request using the details I have provided. <span aria-hidden="true" className="text-error">*</span></span>
        </label>
        <p className="-mt-3 pl-8 text-xs text-muted">Tick this box to give your permission, then click Request Consultation. We can only follow up with you if you do.</p>
      </fieldset>

      {status === "error" && <FormError message={SUBMIT_ERROR} />}

      <div className="flex flex-wrap gap-3">
        {js && step > 0 && (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="min-h-11 rounded-md border border-primary px-6 py-3 font-medium text-primary hover:bg-primary/5">Back</button>
        )}
        {js && step < STEPS.length - 1 ? (
          <button type="button" onClick={next} className="min-h-11 rounded-md bg-primary px-7 py-3 text-lg font-medium text-white hover:bg-secondary">Next</button>
        ) : (
          <button type="submit" disabled={status === "submitting"} className="min-h-11 rounded-md bg-primary px-7 py-3 text-lg font-medium text-white hover:bg-secondary disabled:opacity-50">
            {status === "submitting" ? "Submitting…" : "Request Consultation"}
          </button>
        )}
      </div>
    </form>
  );
}
