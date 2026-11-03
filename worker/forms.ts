// POST /api/forms/:form (docs/v2/06-TECH-SPEC.md §3), in the spec's order:
//   size limit → honeypot (silent success) → Turnstile → rate limit → zod → files (extension + magic bytes)
//   → D1 insert with a ref → R2 (private) → internal email + visitor confirmation (Resend) → { ok, ref, nextStep }.
// Errors return a plain message; the browser keeps what the visitor typed. Personal data is never logged.
import { FORMS, HONEYPOT_FIELD, MAX_BODY_BYTES, MAX_FILE_BYTES, NOTIFY, TURNSTILE_FIELD, isFormName, type FormName } from "../src/lib/formFields";
import { detectFile, makeRef, uploadKey, validateFields } from "../src/lib/formValidation";
import { confirmationMail, internalMail, sendMail } from "./email";
import type { Env } from "./types";

type Json = Record<string, unknown>;
export type Reply = { status: number; body: Json };

const fail = (status: number, error: string, message: string, extra: Json = {}): Reply => ({ status, body: { ok: false, error, message, ...extra } });
const TRY_AGAIN = "Please try again, or contact us by phone or email.";

// What the success panel offers next (05-SITE-SPEC.md §3 F, item 3).
function nextStep(form: FormName, requestType?: string): string {
  if (form === "career" || form === "expert") return "read_process";
  if (requestType === "business-assessment") return "book_call";
  return requestType === "newsletter" ? "take_assessment" : "book_call";
}

async function verifyTurnstile(env: Env, token: string | undefined, ip: string, fetcher: typeof fetch): Promise<boolean> {
  if (!token) return false;
  const res = await fetcher("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return data.success === true;
}

type Parsed = { fields: Record<string, string>; files: { field: string; file: File }[] };
async function parse(request: Request): Promise<Parsed | null> {
  const type = request.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await request.json().catch(() => null)) as Json | null;
    if (!body || typeof body !== "object") return null;
    return { fields: Object.fromEntries(Object.entries(body).filter(([, v]) => typeof v === "string")) as Record<string, string>, files: [] };
  }
  if (type.includes("multipart/form-data")) {
    const data = await request.formData().catch(() => null);
    if (!data) return null;
    const fields: Record<string, string> = {};
    const files: Parsed["files"] = [];
    for (const [k, v] of data.entries()) {
      if (typeof v === "string") fields[k] = v;
      else if (v && typeof v === "object" && (v as File).size > 0) files.push({ field: k, file: v as File });
    }
    return { fields, files };
  }
  return null;
}

export async function handleForm(request: Request, env: Env, formParam: string, deps: { fetcher?: typeof fetch; now?: () => Date; random?: (n: number) => Uint8Array; uuid?: () => string } = {}): Promise<Reply> {
  const fetcher = deps.fetcher ?? fetch;
  const now = (deps.now ?? (() => new Date()))();
  const random = deps.random ?? ((n: number) => crypto.getRandomValues(new Uint8Array(n)));
  const uuid = deps.uuid ?? (() => crypto.randomUUID());

  if (!isFormName(formParam)) return fail(404, "unknown_form", "This form does not exist.");
  const form = formParam;
  const def = FORMS[form];

  // 1. Size limit (the header first; the parsed size is checked again below).
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > MAX_BODY_BYTES[form]) return fail(413, "too_large", "The form is too large. Each file must be 3 MB or smaller.");
  if (!env.DB || !env.TURNSTILE_SECRET) return fail(503, "not_configured", `Forms are not available right now. ${TRY_AGAIN}`);

  const parsed = await parse(request);
  if (!parsed) return fail(400, "bad_request", `We could not read the form. ${TRY_AGAIN}`);

  // 2. Honeypot: a filled trap gets a normal-looking success and nothing is stored or sent.
  if (parsed.fields[HONEYPOT_FIELD]) return { status: 200, body: { ok: true, ref: makeRef(now, random), nextStep: "book_call" } };

  // 3. Turnstile, server-side.
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  if (!(await verifyTurnstile(env, parsed.fields[TURNSTILE_FIELD], ip, fetcher))) {
    return fail(400, "turnstile", "Please complete the security check and send the form again.");
  }

  // 4. Rate limit: about 5 submissions a minute per address and form.
  if (env.RATE_LIMITER) {
    const { success } = await env.RATE_LIMITER.limit({ key: `${ip}:${form}` });
    if (!success) return fail(429, "rate_limited", "You have sent several forms in a short time. Please wait a minute and try again.");
  }

  // 5. Validation (zod), then files: only the form's own file fields, each within the size limit and of a real allowed type.
  const result = validateFields(form, parsed.fields);
  if (!result.ok) return fail(422, "invalid", "Please check the highlighted fields.", { fields: result.errors });
  const fields = result.data;

  const ref = makeRef(now, random);
  const uploads: { key: string; field: string; bytes: ArrayBuffer; mime: string }[] = [];
  for (const rule of def.files) {
    const item = parsed.files.find((f) => f.field === rule.name);
    if (!item) continue;
    if (item.file.size > MAX_FILE_BYTES) return fail(422, "invalid", "Please check the highlighted fields.", { fields: { [rule.name]: "Each file must be 3 MB or smaller." } });
    const bytes = await item.file.arrayBuffer();
    const kind = detectFile(rule, item.file.name, new Uint8Array(bytes.slice(0, 8)));
    if (!kind) return fail(422, "invalid", "Please check the highlighted fields.", { fields: { [rule.name]: `Upload a ${rule.kinds.map((k) => k.toUpperCase()).join(" or ")} file.` } });
    uploads.push({ key: uploadKey(form, rule.name, ref, kind.ext, now), field: rule.name, bytes, mime: kind.mime });
  }
  if (uploads.length && !env.UPLOADS) return fail(503, "not_configured", `File uploads are not available right now. ${TRY_AGAIN}`);

  // 6–7. Store the files (private bucket), then the row.
  for (const u of uploads) await env.UPLOADS!.put(u.key, u.bytes, { httpMetadata: { contentType: u.mime } });
  const meta = (k: string) => fields[k] ?? null;
  const record = Object.fromEntries(Object.entries(fields).filter(([k]) => !k.startsWith("utm_") && !["request_type", "service_id", "audience", "lead_id"].includes(k)));
  await env.DB.prepare(
    `INSERT INTO submissions (id, ref, form, request_type, service_id, audience, fields, consent, consent_at, utm_source, utm_medium, utm_campaign, utm_term, utm_content, posthog_id, cv_key, file_keys, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      uuid(), ref, form, meta("request_type"), meta("service_id"), meta("audience"), JSON.stringify(record), now.toISOString(),
      meta("utm_source"), meta("utm_medium"), meta("utm_campaign"), meta("utm_term"), meta("utm_content"), meta("lead_id"),
      uploads.find((u) => u.field === "cv")?.key ?? null, uploads.length ? JSON.stringify(uploads.map((u) => u.key)) : null, now.toISOString()
    )
    .run();

  // 8–9. Emails. A failed email never loses the stored submission.
  const notify = NOTIFY[form] === "sales" ? env.NOTIFY_SALES : env.NOTIFY_CONTACT;
  const sent = await Promise.all([
    notify ? sendMail(env, internalMail(env, form, ref, record, uploads.map((u) => u.key), notify), fetcher) : Promise.resolve(false),
    sendMail(env, confirmationMail(env, form, ref, fields), fetcher),
  ]);
  console.log(JSON.stringify({ event: "form_stored", form, files: uploads.length, internal_email: sent[0], confirmation_email: sent[1] })); // counts only

  // 10.
  return { status: 200, body: { ok: true, ref, nextStep: nextStep(form, fields.request_type) } };
}
