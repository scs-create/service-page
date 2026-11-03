// Server-side validation for /api/forms/:form (06-TECH-SPEC.md §3 step 5), shared with the tests. Pure: the Worker
// bundles it, so it uses relative imports only. The browser checks the same rules first, but only this is trusted.
import { z } from "zod";
import { CONSENT_NAME, DEFAULT_MAX_LENGTH, FORMS, MAX_LENGTH, META_FIELDS, type FileRule, type FormName } from "./formFields";

export type Fields = Record<string, string>;
export type ValidationResult = { ok: true; data: Fields } | { ok: false; errors: Record<string, string> };

const email = z.string().trim().max(254).email("Enter a valid email address.");
const url = z.string().trim().max(300).regex(/^https?:\/\/\S+$/i, "Enter a full web address starting with https://");

// Builds the zod schema for one form: only known fields, each trimmed and length-limited; unknown keys are dropped.
function schemaFor(form: FormName) {
  const def = FORMS[form];
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const name of [...def.text, ...META_FIELDS]) {
    const max = MAX_LENGTH[name] ?? DEFAULT_MAX_LENGTH;
    let field: z.ZodTypeAny = z.string().trim().max(max, `Keep this under ${max} characters.`);
    if (name === "email") field = email;
    if (name === "profile_url") field = url;
    if (name === CONSENT_NAME) field = z.literal("yes", { message: "Tick the box to give your permission." });
    shape[name] = def.required.includes(name) ? field.refine((v) => typeof v === "string" && v.length > 0, "This field is required.") : field.optional().or(z.literal(""));
  }
  return z.object(shape);
}

export function validateFields(form: FormName, input: Fields): ValidationResult {
  const parsed = schemaFor(form).safeParse(input);
  if (parsed.success) {
    const data = Object.fromEntries(Object.entries(parsed.data as Fields).filter(([, v]) => typeof v === "string" && v !== ""));
    return { ok: true, data };
  }
  const errors: Record<string, string> = {};
  for (const issue of parsed.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.code === "invalid_type" ? "This field is required." : issue.message;
  }
  return { ok: false, errors };
}

// File checks: the extension AND the first bytes must agree (a renamed .exe is rejected).
const SIGNATURES: Record<FileRule["kinds"][number], { ext: string; mime: string; magic: number[] }> = {
  pdf: { ext: "pdf", mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46, 0x2d] }, // %PDF-
  doc: { ext: "doc", mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] }, // OLE2
  docx: { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", magic: [0x50, 0x4b, 0x03, 0x04] }, // ZIP
};

export function detectFile(rule: FileRule, fileName: string, head: Uint8Array): { ext: string; mime: string } | null {
  const ext = fileName.toLowerCase().split(".").pop() ?? "";
  for (const kind of rule.kinds) {
    const sig = SIGNATURES[kind];
    if (ext === sig.ext && sig.magic.every((b, i) => head[i] === b)) return { ext: sig.ext, mime: sig.mime };
  }
  return null;
}

// Human reference, e.g. SCS-2611-7F3K: year and month, then 4 characters without look-alikes (0/O, 1/I/L).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export function makeRef(now: Date, random: (n: number) => Uint8Array): string {
  const yymm = `${String(now.getUTCFullYear()).slice(2)}${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const tail = [...random(4)].map((b) => ALPHABET[b % ALPHABET.length]).join("");
  return `SCS-${yymm}-${tail}`;
}
export const REF_PATTERN = /^SCS-\d{4}-[2-9A-HJKMNP-Z]{4}$/;

// R2 key for an upload: <folder>/<yyyy>/<ref>-<field>.<ext> (CVs under cv/, as the spec sets out).
export function uploadKey(form: FormName, field: string, ref: string, ext: string, now: Date): string {
  const folder = field === "cv" ? "cv" : form;
  return `${folder}/${now.getUTCFullYear()}/${ref}-${field}.${ext}`;
}

// Six-month retention (owner decision 6): rows created before this instant are deleted with their files.
export function retentionCutoff(now: Date): string {
  const d = new Date(now);
  d.setUTCMonth(d.getUTCMonth() - 6);
  return d.toISOString();
}
