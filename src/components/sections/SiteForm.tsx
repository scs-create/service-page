"use client";

import { useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { HONEYPOT_FIELD, MAX_FILE_BYTES, type FormName } from "@/lib/formFields";
import { type FormField } from "@/lib/formSchema";
import { useFormAnalytics } from "@/lib/useFormAnalytics";
import { readUtm } from "@/lib/utm";
import { SITE } from "@/lib/site";
import Turnstile, { TURNSTILE_SITE_KEY, type TurnstileHandle } from "@/components/forms/Turnstile";
import SuccessPanel, { type ExploreLink, type NextStep } from "@/components/forms/SuccessPanel";

type Props = {
  form: FormName;
  fields: FormField[];
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  requestType?: string; // hidden request_type: how enquiries are told apart
  sourcePage?: string;
  extraHidden?: Record<string, string>; // e.g. assessment_score
  defaults?: Record<string, string>; // initial values, e.g. the topic chosen on another page
  explore?: ExploreLink[]; // "Continue exploring" links on the success panel
  onSuccess?: () => void;
};

// Form engine for every SCS form (v2). Posts to the Worker at /api/forms/<form>: JSON, or multipart when a file is
// attached. The server checks everything again (worker/forms.ts); limits here are a convenience for the visitor.
const DEFAULT_MAX = { text: 200, email: 254, tel: 25, url: 300, textarea: 2000 } as const;
const INPUT = "w-full min-h-11 rounded-sm border px-3 py-2 text-base";
const noopSubscribe = () => () => {};
const DEFAULT_EXPLORE: ExploreLink[] = [
  { href: "/services", label: "All services" },
  { href: "/process", label: "How every engagement runs" },
  { href: "/corporate-college/corporate-school", label: "Corporate School guides" },
];

export const SUBMIT_ERROR = "We couldn't send your form. Please try again, or contact us directly by phone or email.";

export function FormError({ message }: { message: string }) {
  return <p role="alert" className="border-l-4 border-error pl-3 text-sm text-error">{message}</p>;
}

type Done = { ref: string; next: NextStep; name?: string; email?: string };

export default function SiteForm({ form, fields, submitLabel, successTitle, successMessage, requestType, sourcePage, extraHidden, defaults, explore, onSuccess }: Props) {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [message, setMessage] = useState(SUBMIT_ERROR);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Done | null>(null);
  const [watched, setWatched] = useState<Record<string, string>>(() => ({ ...(defaults ?? {}) }));
  const turnstile = useRef<TurnstileHandle>(null);
  const watchedNames = new Set(fields.flatMap((f) => (f.showWhen ? [f.showWhen.field] : [])));
  const hasFile = fields.some((f) => f.type === "file");
  // Conditional fields are only mandatory when JS can show/hide them (otherwise no-JS visitors could never submit).
  const isRequired = (f: FormField) => !!f.required && (!f.showWhen || hydrated);
  const { attach, onFocus, beforeSubmit, submitted, failed } = useFormAnalytics(requestType ?? form);
  const idBase = `${form}-${requestType ?? "x"}`;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const el = e.currentTarget;
    for (const input of el.querySelectorAll<HTMLInputElement>('input[type="file"]')) {
      const big = Array.from(input.files ?? []).some((f) => f.size > MAX_FILE_BYTES);
      input.setCustomValidity(big ? "Each file must be 3 MB or smaller." : "");
      if (big) {
        input.reportValidity();
        return;
      }
    }
    setStatus("submitting");
    setFieldErrors({});
    beforeSubmit(el);
    const data = new FormData(el);
    for (const [k, v] of Object.entries(readUtm())) data.set(k, v);
    const withFile = Array.from(el.querySelectorAll<HTMLInputElement>('input[type="file"]')).some((i) => (i.files?.length ?? 0) > 0);
    try {
      const res = await fetch(`/api/forms/${form}`, withFile
        ? { method: "POST", body: data }
        : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries([...data.entries()].filter(([, v]) => typeof v === "string"))) });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; ref?: string; nextStep?: NextStep; message?: string; fields?: Record<string, string> };
      if (!res.ok || !body.ok || !body.ref) {
        setFieldErrors(body.fields ?? {});
        setMessage(body.message ?? SUBMIT_ERROR);
        setStatus("error");
        turnstile.current?.reset(); // a token is single-use
        failed();
        return;
      }
      submitted(el);
      setDone({ ref: body.ref, next: body.nextStep ?? "book_call", name: String(data.get("name") ?? ""), email: String(data.get("email") ?? "") });
      onSuccess?.();
    } catch {
      setMessage(SUBMIT_ERROR);
      setStatus("error");
      turnstile.current?.reset();
      failed();
    }
  }

  if (done) {
    return <SuccessPanel title={successTitle} message={successMessage} reference={done.ref} next={done.next} name={done.name} email={done.email} explore={explore ?? DEFAULT_EXPLORE} />;
  }

  return (
    <form method="POST" action={`/api/forms/${form}`} encType={hasFile ? "multipart/form-data" : undefined} onSubmit={handleSubmit} ref={attach} onFocus={onFocus} className="space-y-5">
      {requestType && <input type="hidden" name="request_type" value={requestType} />}
      {sourcePage && <input type="hidden" name="source_page" value={sourcePage} />}
      {Object.entries(extraHidden ?? {}).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      {/* Honeypot: off-screen, hidden from assistive technology and skipped by the keyboard (05-SITE-SPEC.md §2). */}
      <div className="offscreen" aria-hidden="true">
        <label htmlFor={`${idBase}-${HONEYPOT_FIELD}`}>Leave this empty</label>
        <input id={`${idBase}-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <noscript>
        <p className="rounded-sm border border-border bg-surface p-4 text-sm">
          This form needs JavaScript for its security check. You can email <a href={`mailto:${SITE.email}`} className="text-primary underline">{SITE.email}</a> or
          call {SITE.phone} instead.
        </p>
      </noscript>
      <p className="text-sm text-muted"><span aria-hidden="true" className="text-error">*</span> Required</p>

      {fields.map((f) => {
        if (hydrated && f.showWhen && watched[f.showWhen.field] !== f.showWhen.equals) return null;
        const id = `${idBase}-${f.name}`;
        const err = fieldErrors[f.name];
        const describedBy = [f.hint ? `${id}-hint` : "", err ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
        const max = f.maxLength ?? (f.type === "select" || f.type === "checkbox" || f.type === "file" ? undefined : DEFAULT_MAX[f.type]);
        const errorLine = err && <p id={`${id}-err`} className="mt-1 text-sm text-error">{err}</p>;
        const initial = defaults?.[f.name];

        if (f.type === "checkbox") {
          return (
            <div key={f.name}>
              <label htmlFor={id} className="flex items-start gap-3 text-sm text-text">
                <input id={id} name={f.name} type="checkbox" value="yes" required={isRequired(f)} aria-describedby={describedBy} aria-invalid={err ? true : undefined} className="mt-1 h-5 w-5 shrink-0" />
                <span>{f.label}{f.required && <span aria-hidden="true" className="text-error"> *</span>}</span>
              </label>
              {f.hint && <p id={`${id}-hint`} className="mt-1 pl-8 text-xs text-muted">{f.hint}</p>}
              {errorLine}
            </div>
          );
        }
        return (
          <div key={f.name}>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-text">
              {f.label}
              {f.required ? <span aria-hidden="true" className="text-error"> *</span> : <span className="font-normal text-muted"> (optional)</span>}
            </label>
            {f.type === "select" ? (
              <select
                id={id} name={f.name} required={isRequired(f)} defaultValue={initial ?? ""} aria-describedby={describedBy} aria-invalid={err ? true : undefined} className={`${INPUT} bg-bg`}
                onChange={watchedNames.has(f.name) ? (e) => setWatched((w) => ({ ...w, [f.name]: e.target.value })) : undefined}
              >
                <option value="" disabled>Choose one</option>
                {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === "textarea" ? (
              <textarea id={id} name={f.name} required={isRequired(f)} rows={f.rows ?? 4} maxLength={max} placeholder={f.placeholder} defaultValue={initial} aria-describedby={describedBy} aria-invalid={err ? true : undefined} className="w-full rounded-sm border px-3 py-2 text-base" />
            ) : f.type === "file" ? (
              <input id={id} name={f.name} type="file" required={isRequired(f)} accept={f.accept ?? ".pdf,.doc,.docx"} aria-describedby={describedBy} aria-invalid={err ? true : undefined} className={`${INPUT} py-1.5`} />
            ) : (
              <input id={id} name={f.name} type={f.type} required={isRequired(f)} autoComplete={f.autoComplete} maxLength={max} placeholder={f.placeholder} defaultValue={initial} aria-describedby={describedBy} aria-invalid={err ? true : undefined} className={INPUT} />
            )}
            {f.hint && <p id={`${id}-hint`} className="mt-1 text-xs text-muted">{f.hint}</p>}
            {errorLine}
          </div>
        );
      })}

      <Turnstile ref={turnstile} />
      {!TURNSTILE_SITE_KEY && <FormError message="This form is not available right now. Please contact us by phone or email." />}
      {status === "error" && <FormError message={message} />}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-7 font-medium text-white hover:bg-secondary disabled:opacity-50">
          {status === "submitting" ? "Sending…" : submitLabel}
        </button>
        <span className="text-sm text-muted">We respond within 24 hours.</span>
      </div>
    </form>
  );
}
