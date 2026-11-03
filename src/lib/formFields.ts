// SINGLE SOURCE OF TRUTH for every form the site posts (docs/v2/06-TECH-SPEC.md §3). The browser form engine
// (SiteForm) and the Worker (/api/forms/:form) both read it, so a field can never be sent that the server does
// not accept. Pure data and helpers only: no DOM, no Node, no "@/" imports (the Worker bundles this file).
//
// Forms (D1 `form` column):
//   enquiry  every lead, told apart by the hidden request_type (consultation, partnership, training, newsletter,
//            business-assessment, compliance-checklist, compliance-reminders, find-my-service, …)
//   proposal requests for a written proposal, with an optional brief (PDF)
//   career   staff and partner applications (CVs: kept apart, private R2, 6-month retention)
//   expert   expert-network applications
export const FORM_NAMES = ["enquiry", "proposal", "career", "expert"] as const;
export type FormName = (typeof FORM_NAMES)[number];

export type FileRule = { name: string; required?: boolean; kinds: ("pdf" | "doc" | "docx")[] };
export type FormDefinition = {
  text: readonly string[]; // every text field the form may send
  required: readonly string[]; // always required on the server (conditional fields are checked in the browser)
  files: readonly FileRule[];
};

// Sent with every form; never shown as inputs.
export const META_FIELDS = [
  "request_type", "source_page", "service_id", "audience", "lead_id",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
] as const;
export const HONEYPOT_FIELD = "company_website"; // off-screen, aria-hidden, tabindex -1 (05-SITE-SPEC.md §2)
export const TURNSTILE_FIELD = "cf-turnstile-response";
export const CONSENT_NAME = "consent_contact";

export const FORMS: Record<FormName, FormDefinition> = {
  enquiry: {
    text: [
      "name", "email", "phone", "organisation", "topic", "message", CONSENT_NAME,
      "need", "business_stage", "sector", "team_size", "interest", "service", "details",
      "assessment_score", "assessment_band", "assessment_gaps", "assessment_answers",
      "checklist_type", "checklist_sector", "calendar_area", "structure_result", "finder_result",
    ],
    required: ["name", "email", CONSENT_NAME],
    files: [],
  },
  proposal: {
    text: ["organisation", "name", "email", "phone", "country", "service", "brief", CONSENT_NAME],
    required: ["organisation", "name", "email", "country", "brief", CONSENT_NAME],
    files: [{ name: "brief_file", kinds: ["pdf"] }],
  },
  career: {
    text: ["name", "email", "phone", "applying_as", "area", "profile_url", "message", CONSENT_NAME],
    required: ["name", "email", "applying_as", CONSENT_NAME],
    files: [
      { name: "cv", kinds: ["pdf", "doc", "docx"] },
      { name: "cover_letter", kinds: ["pdf", "doc", "docx"] },
      { name: "proposal", kinds: ["pdf", "doc", "docx"] },
    ],
  },
  expert: {
    text: ["name", "email", "phone", "expertise", "profile_url", "location", "message", CONSENT_NAME],
    required: ["name", "email", "expertise", "profile_url", CONSENT_NAME],
    files: [{ name: "cv", kinds: ["pdf", "doc", "docx"] }],
  },
};

export const MAX_FILE_BYTES = 3 * 1024 * 1024; // each upload
export const MAX_BODY_BYTES: Record<FormName, number> = {
  enquiry: 32 * 1024,
  proposal: 3.5 * 1024 * 1024,
  career: 3.5 * 1024 * 1024 * 3, // up to three documents
  expert: 3.5 * 1024 * 1024,
};
export const MAX_LENGTH: Record<string, number> = {
  email: 254, phone: 25, profile_url: 300, message: 2000, brief: 4000, details: 2000, assessment_answers: 4000, assessment_gaps: 2000,
};
export const DEFAULT_MAX_LENGTH = 200;

export const isFormName = (s: string): s is FormName => (FORM_NAMES as readonly string[]).includes(s);
export const allFieldNames = (form: FormName): string[] => [...FORMS[form].text, ...META_FIELDS, ...FORMS[form].files.map((f) => f.name)];

// Internal notification routing (06-TECH-SPEC.md §3 step 8): sales@ for enquiries and proposals, contact@ for applications.
export const NOTIFY: Record<FormName, "sales" | "contact"> = { enquiry: "sales", proposal: "sales", career: "contact", expert: "contact" };
