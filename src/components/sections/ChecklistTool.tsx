"use client";

import { useState } from "react";
import NetlifyForm, { CONSENT_FIELD, FormField } from "@/components/sections/NetlifyForm";
import { track } from "@/lib/track";

type Item = { text: string; regulators: string[] };
type Props = {
  types: { id: string; label: string; items: Item[] }[];
  sectors: { id: string; label: string; items: Item[] }[];
  regulatorNames: Record<string, string>;
  disclaimer: string;
};
const SELECT = "w-full min-h-11 border border-border rounded-sm px-3 py-2 text-base bg-bg";
const leadFields: FormField[] = [
  { name: "name", label: "Full Name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
  CONSENT_FIELD,
];

// Compliance Starter Checklist: pick business type + sector → checklist + agencies to review.
// "Download PDF" uses the browser's Save-as-PDF (print stylesheet) — no extra library, no data leaves the device.
export default function ChecklistTool({ types, sectors, regulatorNames, disclaimer }: Props) {
  const [typeId, setTypeId] = useState("");
  const [sectorId, setSectorId] = useState("");
  const type = types.find((t) => t.id === typeId);
  const sector = sectors.find((s) => s.id === sectorId);
  const items = [...(type?.items ?? []), ...(sector?.items ?? [])];
  const codes = [...new Set(items.flatMap((i) => i.regulators))];

  return (
    <div>
      <div className="no-print grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="ck-type" className="mb-1.5 block text-sm font-medium text-text">Business type <span aria-hidden="true" className="text-error">*</span></label>
          <select id="ck-type" value={typeId} onChange={(e) => { setTypeId(e.target.value); track("tool_completed", { tool_name: "compliance_checklist" }); }} className={SELECT}>
            <option value="" disabled>Select one</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="ck-sector" className="mb-1.5 block text-sm font-medium text-text">Sector <span className="font-normal text-muted">(optional)</span></label>
          <select id="ck-sector" value={sectorId} onChange={(e) => setSectorId(e.target.value)} className={SELECT}>
            <option value="">Not listed / not sure</option>
            {sectors.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {type && (
        <>
          <div className="print-area mt-8 rounded-md border border-border bg-bg p-6">
            <h2 className="text-2xl font-semibold text-text">Compliance Starter Checklist</h2>
            <p className="mt-1 text-sm text-muted">{type.label}{sector ? ` · ${sector.label}` : ""} · Prepared with Stephen Corporate Services (stephencorporateservices-scs.com)</p>
            <ul className="mt-5 space-y-3">
              {items.map((i) => (
                <li key={i.text}>
                  <label className="flex items-start gap-3 text-text">
                    <input type="checkbox" className="mt-1 h-5 w-5 shrink-0" />
                    <span>{i.text} <span className="text-sm text-muted">({i.regulators.join(", ")})</span></span>
                  </label>
                </li>
              ))}
            </ul>
            <h3 className="mt-6 text-lg font-semibold text-secondary">Agencies to review</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">{codes.map((c) => <li key={c}>{regulatorNames[c] ?? c}</li>)}</ul>
            <p className="mt-6 text-xs text-muted">{disclaimer}</p>
          </div>
          <div className="no-print mt-5">
            <button type="button" onClick={() => window.print()} className="min-h-11 rounded-md bg-primary px-7 py-3 font-medium text-white hover:bg-secondary">Download PDF (print → Save as PDF)</button>
          </div>
          <section className="no-print mt-10 rounded-md border border-border border-t-4 border-t-accent bg-surface p-6">
            <h2 className="text-xl font-semibold text-text">Want help working through this list?</h2>
            <p className="mt-2 mb-5 text-sm text-muted">Share your details and SCS will follow up. We contact you only if you tick the consent box.</p>
            <NetlifyForm formName="enquiry" requestType="compliance-checklist" sourcePage="/compliance-checklist" fields={leadFields} submitLabel="Contact me" successTitle="Thank you." successMessage="Our team will be in touch." extraHidden={{ checklist_type: type.label, checklist_sector: sector?.label ?? "Not specified" }} />
          </section>
        </>
      )}
    </div>
  );
}
