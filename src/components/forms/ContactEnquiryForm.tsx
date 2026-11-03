"use client";

import { useSyncExternalStore } from "react";
import SiteForm from "@/components/sections/SiteForm";
import { CONSENT_FIELD, type FormField } from "@/lib/formSchema";

// The Contact enquiry and Proposal forms take their defaults from the URL (/contact?topic=partnership,
// /contact/proposal?service=CR-01). The pages are static, so the query is read in the browser and the form remounts
// once with those defaults.
const noopSubscribe = () => () => {};
const useQuery = (name: string) => useSyncExternalStore(noopSubscribe, () => new URLSearchParams(window.location.search).get(name) ?? "", () => "");

const TOPIC_FROM_QUERY: Record<string, string> = { partnership: "SCS Partnership", training: "Training (Corporate College)" };

// Enquiry fields as in design/Contact.dc.html: the fewest needed (06-TECH-SPEC.md §3 step 5).
export default function ContactEnquiryForm({ topics }: { topics: string[] }) {
  const q = useQuery("topic");
  const topic = TOPIC_FROM_QUERY[q] ?? "";
  const fields: FormField[] = [
    { name: "name", label: "Your name", type: "text", required: true, autoComplete: "name" },
    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { name: "organisation", label: "Organisation", type: "text", autoComplete: "organization" },
    { name: "topic", label: "What can we help with?", type: "select", required: true, options: topics },
    { name: "message", label: "Your message", type: "textarea", required: true, rows: 5 },
    { ...CONSENT_FIELD, label: "I agree that Stephen Corporate Services - SCS Ltd may use these details to reply to my enquiry, as described in the Privacy notice." },
  ];
  return (
    <SiteForm
      key={topic || "none"}
      form="enquiry"
      requestType={topic === "SCS Partnership" ? "partnership" : topic.startsWith("Training") ? "training-request" : "consultation"}
      sourcePage="/contact"
      fields={fields}
      defaults={topic ? { topic } : undefined}
      submitLabel="Send enquiry"
      successTitle="Enquiry received."
      successMessage="Thank you. The right person at SCS will review it and reply within 24 hours."
      explore={topic === "SCS Partnership" ? [{ href: "/partnership", label: "SCS Partnership" }, { href: "/process", label: "Our process" }] : undefined}
    />
  );
}
