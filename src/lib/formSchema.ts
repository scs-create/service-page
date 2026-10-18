// Form field definitions shared by server-rendered pages and the client form engine (NetlifyForm).
// They MUST live in a plain module: a server component that imports a value from a "use client" file
// receives an empty client reference, not the object, which silently turned the consent checkbox into an
// unnamed text box on the Career, Compliance Calendar, Corporate College, home and newsletter forms.
export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "url" | "select" | "textarea" | "checkbox" | "file";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  hint?: string;
  rows?: number;
  autoComplete?: string;
  maxLength?: number;
  accept?: string; // file inputs
  showWhen?: { field: string; equals: string }; // only shown when another select has this value (all shown without JS)
};

export const CONSENT_FIELD: FormField = {
  name: "consent_contact",
  label: "I agree that SCS may contact me about this request using the details I have provided.",
  hint: "Tick this box to give your permission. We can only follow up with you if you do.",
  type: "checkbox",
  required: true,
};
