import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import NetlifyForm, { CONSENT_FIELD, FormField } from "@/components/sections/NetlifyForm";
import { services } from "@/content/services/data";

export const metadata: Metadata = {
  title: "Career",
  description: "Join SCS as staff or partner with us. Apply with your CV and cover letter, or share your profile and proposal.",
};

const fields: FormField[] = [
  { name: "name", label: "Full Name", type: "text", required: true, autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", required: true, autoComplete: "tel" },
  { name: "applying_as", label: "I am applying as", type: "select", required: true, options: ["Staff position", "Partner"] },
  { name: "area", label: "Area of interest", type: "select", required: true, options: [...services.map((s) => s.title), "Other / Not sure"], showWhen: { field: "applying_as", equals: "Staff position" } },
  { name: "cv", label: "CV / resume", type: "file", required: true, hint: "PDF or Word, up to 3 MB.", showWhen: { field: "applying_as", equals: "Staff position" } },
  { name: "cover_letter", label: "Cover letter", type: "file", hint: "PDF or Word, up to 3 MB.", showWhen: { field: "applying_as", equals: "Staff position" } },
  { name: "profile_url", label: "LinkedIn profile or website", type: "url", required: true, placeholder: "https://", showWhen: { field: "applying_as", equals: "Partner" } },
  { name: "proposal", label: "Partnership proposal", type: "file", hint: "PDF or Word, up to 3 MB.", showWhen: { field: "applying_as", equals: "Partner" } },
  { name: "message", label: "Tell us about yourself", type: "textarea", rows: 5, placeholder: "Relevant experience, the role or service area you're interested in, and how you would like to work with SCS." },
  { ...CONSENT_FIELD, label: "Yes, I agree — SCS may use my details and documents to review my application and contact me about it.", hint: "Tick this box to give your permission, then click Submit Application. We cannot review your application without it." },
];

export default function CareerPage() {
  return (
    <>
      <PageHero eyebrow="Career" title="Work with SCS" intro="Interested in joining SCS or partnering with us? Choose how you would like to work with us, tell us a bit about yourself, and we will follow up directly." />
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-[640px]">
          <NetlifyForm formName="career-application" sourcePage="/career" fields={fields} submitLabel="Submit Application" successTitle="Application received." successMessage="Thank you for your interest in SCS — we'll be in touch." />
        </div>
      </div>
    </>
  );
}
