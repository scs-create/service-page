"use client";

import { useCallback, useMemo, useRef } from "react";
import { identifyLead, newLeadId, toSnake, track } from "@/lib/track";

// Fields whose CHOSEN OPTION describes what the visitor is interested in. Only <select>, radio and checkbox
// values are read (fixed option lists); typed text is never read, so nothing personal can leak.
const INTEREST_FIELDS = ["need", "topic", "applying_as", "interest", "service", "calendar_area", "checklist_type", "audience"];

function interestOf(form: HTMLFormElement): string | undefined {
  for (const name of INTEREST_FIELDS) {
    const els = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>(`[name="${name}"]`));
    for (const el of els) {
      if (el instanceof HTMLSelectElement && el.value) return el.value;
      if (el instanceof HTMLInputElement && (el.type === "radio" || el.type === "checkbox") && el.checked) return el.value;
    }
  }
  return undefined;
}

// form_started (first focus) · form_error (validation or send failure) · form_step_completed · form_submitted
// (+ newsletter_subscribed) and, only for visitors who accepted analytics, an anonymous lead ID saved with the
// enquiry + identify().
export function useFormAnalytics(formKey: string) {
  const form_name = toSnake(formKey);
  const started = useRef(false);
  const lastError = useRef(0);
  const leadId = useRef<string | null>(null);

  // "invalid" does not bubble, so listen in the capture phase on the form itself.
  const onInvalid = useCallback(() => {
    // Every invalid field fires its own event in the same instant: report each submit attempt once.
    const now = Date.now();
    if (now - lastError.current < 1000) return;
    lastError.current = now;
    track("form_error", { form_name, error_type: "validation" });
  }, [form_name]);

  const attach = useCallback(
    (form: HTMLFormElement | null) => {
      if (!form) return;
      form.addEventListener("invalid", onInvalid, true);
      return () => form.removeEventListener("invalid", onInvalid, true);
    },
    [onInvalid]
  );

  const onFocus = useCallback(() => {
    if (started.current) return;
    started.current = true;
    track("form_started", { form_name });
  }, [form_name]);

  // Just before posting: add the hidden lead_id field (only when analytics was accepted).
  const beforeSubmit = useCallback((form: HTMLFormElement) => {
    leadId.current = newLeadId();
    form.querySelector('input[name="lead_id"]')?.remove();
    if (!leadId.current) return;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "lead_id";
    input.value = leadId.current;
    form.appendChild(input);
  }, []);

  const submitted = useCallback(
    (form: HTMLFormElement) => {
      const service_interest = interestOf(form);
      track("form_submitted", { form_name, service_interest });
      if (form_name === "newsletter") track("newsletter_subscribed");
      identifyLead(leadId.current, { service_interest, lead_source: form_name });
    },
    [form_name]
  );

  const failed = useCallback(() => track("form_error", { form_name, error_type: "submit_failed" }), [form_name]);
  const step = useCallback((n: number) => track("form_step_completed", { form_name, step: n }), [form_name]);

  return useMemo(
    () => ({ attach, onFocus, beforeSubmit, submitted, failed, step }),
    [attach, onFocus, beforeSubmit, submitted, failed, step]
  );
}
