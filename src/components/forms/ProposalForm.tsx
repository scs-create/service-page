"use client";

import { useSyncExternalStore } from "react";
import SiteForm from "@/components/sections/SiteForm";
import { CONSENT_FIELD, type FormField } from "@/lib/formSchema";

// The Contact enquiry and Proposal forms take their defaults from the URL (/contact?topic=partnership,
// /contact/proposal?service=CR-01). The pages are static, so the query is read in the browser and the form remounts
// once with those defaults.
const noopSubscribe = () => () => {};
const useQuery = (name: string) => useSyncExternalStore(noopSubscribe, () => new URLSearchParams(window.location.search).get(name) ?? "", () => "");

export default function ProposalForm({ services }: { services: { id: string; name: string; path: string }[] }) {
  const id = useQuery("service");
  const chosen = services.find((s) => s.id === id);
  const fields: FormField[] = [
    { name: "organisation", label: "Organisation", type: "text", required: true, autoComplete: "organization" },
    { name: "name", label: "Contact name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
    { name: "country", label: "Country", type: "text", required: true, autoComplete: "country-name" },
    { name: "service", label: "Service", type: "select", options: [...services.map((s) => s.name), "Not sure yet"] },
    { name: "brief", label: "Your brief", type: "textarea", required: true, rows: 6, maxLength: 4000, hint: "What you need, any deadlines, and who will decide." },
    { name: "brief_file", label: "Brief or tender document", type: "file", accept: ".pdf", hint: "PDF, up to 3 MB." },
    { ...CONSENT_FIELD, label: "I agree that Stephen Corporate Services - SCS Ltd may use these details and any document I upload to prepare a proposal and contact me about it." },
  ];
  return (
    <SiteForm
      key={chosen?.id ?? "none"}
      form="proposal"
      requestType="proposal"
      sourcePage="/contact/proposal"
      fields={fields}
      defaults={chosen ? { service: chosen.name } : undefined}
      extraHidden={chosen ? { service_id: chosen.id } : undefined}
      submitLabel="Request a proposal"
      successTitle="Proposal request received."
      successMessage="Thank you. We will review your brief, confirm the scope with you and then send a written proposal."
      explore={chosen ? [{ href: chosen.path, label: chosen.name }, { href: "/process", label: "Our process" }] : [{ href: "/process", label: "Our process" }, { href: "/partnership", label: "SCS Partnership" }]}
    />
  );
}
