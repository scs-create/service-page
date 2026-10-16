"use client";

import { useEffect, useState, useSyncExternalStore, FormEvent } from "react";
import { MAX_FILE_BYTES, submitToNetlify } from "@/lib/forms";
import { allFieldNames, FormName } from "@/lib/formFields";
import { track } from "@/lib/track";

export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "url" | "select" | "textarea" | "checkbox" | "file";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
  rows?: number;
  autoComplete?: string;
  maxLength?: number;
  accept?: string; // file inputs
  showWhen?: { field: string; equals: string }; // only shown when another select has this value (all shown without JS)
};

type Props = {
  formName: FormName; // "enquiry" (all leads) or "career-application"
  fields: FormField[];
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  requestType?: string; // hidden request_type — how SCS tells enquiry-bucket submissions apart
  sourcePage?: string; // hidden source_page
  extraHidden?: Record<string, string>; // e.g. assessment_score
  onSuccess?: () => void;
};

// Form engine for every SCS form. Posts to /__forms.html (Netlify skeleton generated from
// src/lib/formFields.ts). Limits below are CLIENT-SIDE convenience only — they are not server enforcement.
export const CONSENT_FIELD: FormField = {
  name: "consent_contact",
  label: "I agree that SCS may contact me about this request using the details I have provided.",
  hint: "Tick this box to give your permission. We can only follow up with you if you do.",
  type: "checkbox",
  required: true,
};
const DEFAULT_MAX = { text: 200, email: 254, tel: 25, url: 300, textarea: 2000 } as const;
const INPUT = "w-full min-h-11 border border-border rounded-sm px-3 py-2 text-base";
const noopSubscribe = () => () => {};

export function FormSuccess({ title, message }: { title: string; message: string }) {
  return (
    <div role="status" tabIndex={-1} ref={(el) => el?.focus()} className="border border-success border-l-4 rounded-md p-6 bg-surface text-text">
      <p className="font-semibold text-success mb-1">{title}</p>
      <p className="text-sm text-muted">{message}</p>
    </div>
  );
}

export function FormError({ message }: { message: string }) {
  return (
    <p role="alert" className="text-sm text-error border-l-4 border-error pl-3">
      {message}
    </p>
  );
}

export const SUBMIT_ERROR = "We couldn't submit your form. Please try again, or contact us directly by phone or email.";

export default function NetlifyForm({ formName, fields, submitLabel, successTitle, successMessage, requestType, sourcePage, extraHidden, onSuccess }: Props) {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [watched, setWatched] = useState<Record<string, string>>({});
  const watchedNames = new Set(fields.flatMap((f) => (f.showWhen ? [f.showWhen.field] : [])));
  const hasFile = fields.some((f) => f.type === "file");
  // Conditional fields are only mandatory when JS can show/hide them (otherwise no-JS visitors could never submit).
  const isRequired = (f: FormField) => !!f.required && (!f.showWhen || hydrated);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const known = new Set(allFieldNames(formName));
    const extra = [...fields.map((f) => f.name), ...Object.keys(extraHidden ?? {}), ...(requestType ? ["request_type"] : []), ...(sourcePage ? ["source_page"] : [])];
    const unknown = extra.filter((n) => !known.has(n));
    if (unknown.length) console.error(`[NetlifyForm] fields not in src/lib/formFields.ts for "${formName}": ${unknown.join(", ")}`);
  }, [formName, fields, extraHidden, requestType, sourcePage]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    for (const input of form.querySelectorAll<HTMLInputElement>('input[type="file"]')) {
      const big = Array.from(input.files ?? []).some((f) => f.size > MAX_FILE_BYTES);
      input.setCustomValidity(big ? "Each file must be 3 MB or smaller." : "");
      if (big) {
        input.reportValidity();
        return;
      }
    }
    setStatus("submitting");
    try {
      await submitToNetlify(form);
      track("Form Submit", { form: requestType ?? formName });
      setStatus("success");
      onSuccess?.();
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") return <FormSuccess title={successTitle} message={successMessage} />;

  return (
    <form name={formName} method="POST" action="/__forms.html" encType={hasFile ? "multipart/form-data" : undefined} onSubmit={handleSubmit} className="space-y-5">
      <input type="hidden" name="form-name" value={formName} />
      {requestType && <input type="hidden" name="request_type" value={requestType} />}
      {sourcePage && <input type="hidden" name="source_page" value={sourcePage} />}
      {Object.entries(extraHidden ?? {}).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      {/* Honeypot spam trap — invisible to people, bots fill it in */}
      <p className="hidden">
        <label>
          Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
        </label>
      </p>

      <p className="text-sm text-muted">
        <span aria-hidden="true" className="text-error">*</span> Required field
      </p>

      {fields.map((f) => {
        if (hydrated && f.showWhen && watched[f.showWhen.field] !== f.showWhen.equals) return null;
        const id = `${formName}-${requestType ?? "x"}-${f.name}`;
        const hintId = f.hint ? `${id}-hint` : undefined;
        const max = f.maxLength ?? (f.type === "select" || f.type === "checkbox" || f.type === "file" ? undefined : DEFAULT_MAX[f.type]);

        if (f.type === "checkbox") {
          return (
            <div key={f.name}>
              <label htmlFor={id} className="flex items-start gap-3 text-sm text-text">
                <input id={id} name={f.name} type="checkbox" value="yes" required={isRequired(f)} aria-describedby={hintId} className="mt-1 h-5 w-5 shrink-0" />
                <span>{f.label}{f.required && <span aria-hidden="true" className="text-error"> *</span>}</span>
              </label>
              {f.hint && <p id={hintId} className="mt-1 pl-8 text-xs text-muted">{f.hint}</p>}
            </div>
          );
        }
        return (
          <div key={f.name}>
            <label htmlFor={id} className="block text-sm font-medium text-text mb-1.5">
              {f.label}
              {f.required ? <span aria-hidden="true" className="text-error"> *</span> : <span className="text-muted font-normal"> (optional)</span>}
            </label>
            {f.type === "select" ? (
              <select
                id={id} name={f.name} required={isRequired(f)} defaultValue="" aria-describedby={hintId} className={`${INPUT} bg-bg`}
                onChange={watchedNames.has(f.name) ? (e) => setWatched((w) => ({ ...w, [f.name]: e.target.value })) : undefined}
              >
                <option value="" disabled>Select one</option>
                {f.options?.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : f.type === "textarea" ? (
              <textarea id={id} name={f.name} required={isRequired(f)} rows={f.rows ?? 4} maxLength={max} placeholder={f.placeholder} aria-describedby={hintId} className="w-full border border-border rounded-sm px-3 py-2 text-base" />
            ) : f.type === "file" ? (
              <input id={id} name={f.name} type="file" required={isRequired(f)} accept={f.accept ?? ".pdf,.doc,.docx"} aria-describedby={hintId} className={`${INPUT} py-1.5`} />
            ) : (
              <input id={id} name={f.name} type={f.type} required={isRequired(f)} autoComplete={f.autoComplete} maxLength={max} placeholder={f.placeholder} aria-describedby={hintId} className={INPUT} />
            )}
            {f.hint && <p id={hintId} className="mt-1 text-xs text-muted">{f.hint}</p>}
          </div>
        );
      })}

      {status === "error" && <FormError message={SUBMIT_ERROR} />}

      <button type="submit" disabled={status === "submitting"} className="inline-flex items-center justify-center font-medium rounded-md bg-primary text-white px-7 py-3.5 text-lg min-h-11 hover:bg-secondary disabled:opacity-50">
        {status === "submitting" ? "Submitting…" : submitLabel}
      </button>
    </form>
  );
}
