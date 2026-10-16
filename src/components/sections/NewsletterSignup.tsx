import NetlifyForm, { CONSENT_FIELD, FormField } from "@/components/sections/NetlifyForm";

const fields: FormField[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { ...CONSENT_FIELD, label: "I agree that SCS may email me Corporate School updates. I can unsubscribe at any time." },
];

export default function NewsletterSignup({ sourcePage }: { sourcePage: string }) {
  return (
    <section className="rounded-md border border-border border-t-4 border-t-accent bg-surface p-6">
      <h2 className="text-xl font-semibold text-text">Get Corporate School updates</h2>
      <p className="mt-2 mb-5 text-sm text-muted">Practical business and compliance learning from SCS, sent to your inbox.</p>
      <NetlifyForm formName="enquiry" requestType="newsletter" sourcePage={sourcePage} fields={fields} submitLabel="Subscribe" successTitle="You are on the list." successMessage="Thank you — we will send Corporate School updates to your email." />
    </section>
  );
}
