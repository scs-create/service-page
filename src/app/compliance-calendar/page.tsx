import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import NetlifyForm, { CONSENT_FIELD, FormField } from "@/components/sections/NetlifyForm";
import { calendar, regulatorName } from "@/content/loaders";

export const metadata: Metadata = {
  title: "Compliance Calendar",
  description: "The recurring compliance obligations most Nigerian businesses should keep on their radar, with a sign-up for reminders from SCS.",
};

const fields: FormField[] = [
  { name: "name", label: "Full Name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "organisation", label: "Organisation", type: "text", autoComplete: "organization" },
  { name: "calendar_area", label: "Area that matters most", type: "select", required: true, options: [...calendar.areas.map((a) => a.label), "All areas"] },
  { ...CONSENT_FIELD, label: "I agree that SCS may email me compliance reminders. I can unsubscribe at any time." },
];

export default function CalendarPage() {
  return (
    <>
      <PageHero eyebrow="Free tool" title="Compliance Calendar" intro={calendar.intro} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 grid lg:grid-cols-[minmax(0,1fr)_420px] gap-10 items-start">
        <ul className="space-y-4">
          {calendar.areas.map((a) => (
            <li key={a.label} className="rounded-md border border-border border-l-4 border-l-accent bg-bg p-5">
              <h2 className="text-lg font-semibold text-text">{a.label}</h2>
              <p className="mt-1 text-sm text-muted">{a.note}</p>
              <p className="mt-2 text-sm text-muted"><span className="font-medium text-secondary">Agencies:</span> {a.regulators.map(regulatorName).join("; ")}</p>
            </li>
          ))}
          <li className="text-sm text-muted">{calendar.disclaimer}</li>
        </ul>
        <section className="rounded-md border border-border border-t-4 border-t-accent bg-surface p-6 lg:sticky lg:top-28">
          <h2 className="text-xl font-semibold text-text">Get reminders</h2>
          <p className="mt-2 mb-5 text-sm text-muted">Join the list and we will let you know when reminders are available for your business type.</p>
          <NetlifyForm formName="enquiry" requestType="compliance-reminders" sourcePage="/compliance-calendar" fields={fields} submitLabel="Join the reminder list" successTitle="You are on the list." successMessage="Thank you — we will be in touch when reminders are available." />
        </section>
      </div>
    </>
  );
}
