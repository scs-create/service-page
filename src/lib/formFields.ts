// SINGLE SOURCE OF TRUTH for every Netlify form field. scripts/gen-forms.ts generates
// public/__forms.html from this, so the skeleton can never drift from what the site posts.
//
// Two forms only (easier to analyse):
//   "enquiry"            — every lead, sorted by the hidden `request_type` field
//                          (consultation, assessment, checklist, newsletter, training, …)
//   "career-application" — job / partner applications (CVs: kept apart for retention + privacy)
export const FORM_FIELDS = {
  enquiry: {
    text: [
      "request_type", "source_page", "consent_contact", "name", "email", "phone", "organisation",
      "need", "business_stage", "sector", "team_size", "interest", "service", "message",
      "audience", "topic", "details",
      "assessment_score", "assessment_band", "assessment_gaps", "assessment_answers",
      "checklist_type", "checklist_sector", "calendar_area", "structure_result", "finder_result",
      "lead_id", // anonymous analytics ID, only present when the visitor accepted analytics
    ],
    files: [] as string[],
  },
  "career-application": {
    text: ["source_page", "applying_as", "name", "email", "phone", "area", "profile_url", "message", "consent_contact", "lead_id"],
    files: ["cv", "cover_letter", "proposal"],
  },
} as const;

export type FormName = keyof typeof FORM_FIELDS;
export const allFieldNames = (form: FormName): string[] => [...FORM_FIELDS[form].text, ...FORM_FIELDS[form].files];
