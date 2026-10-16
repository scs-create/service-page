import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import NetlifyForm, { CONSENT_FIELD, FormField } from "@/components/sections/NetlifyForm";

const portfolioFields: FormField[] = [
  { name: "name", label: "Full Name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "organisation", label: "Organisation", type: "text", autoComplete: "organization" },
  CONSENT_FIELD,
];

// Lighter first steps beside the consultation form: the free assessment tool, and the portfolio request.
export default function LeadCapture() {
  const card = "bg-surface border border-border border-t-4 border-t-accent rounded-md p-6";
  return (
    <section className="py-16 md:py-20" aria-label="Lighter first steps">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeading eyebrow="A lighter first step" title="Not ready for a full consultation?" intro="Pick the smaller step that fits. Both go straight to our team." />
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className={card}>
            <h3 className="text-xl font-semibold text-text">Assess your Business</h3>
            <p className="mt-2 mb-5 text-sm text-muted">Twelve quick questions, a scored result and clear next steps: where the issue is, what to do, how, and how SCS can help.</p>
            <Link href="/assess" data-track="Lead: Assess" className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-7 py-3 text-lg font-medium text-white hover:bg-secondary">Start the assessment</Link>
          </div>
          <div className={card}>
            <h3 className="text-xl font-semibold text-text">Request the Company Growth Portfolio</h3>
            <p className="mt-2 mb-5 text-sm text-muted">Our 2026 portfolio of service lines, deliverables and the systems behind them, sent to you directly by our team.</p>
            <NetlifyForm formName="enquiry" requestType="growth-portfolio" sourcePage="/" fields={portfolioFields} submitLabel="Request the Portfolio" successTitle="Request received." successMessage="Thank you — we will send the portfolio to your email." />
          </div>
        </div>
      </div>
    </section>
  );
}
