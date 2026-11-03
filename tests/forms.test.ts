// v2 forms (docs/v2/06-TECH-SPEC.md §2–§4): validation, files, the Worker pipeline, emails and retention.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { FORMS, HONEYPOT_FIELD, TURNSTILE_FIELD } from "../src/lib/formFields";
import { REF_PATTERN, detectFile, makeRef, retentionCutoff, uploadKey, validateFields } from "../src/lib/formValidation";
import { handleForm } from "../worker/forms";
import { purgeOld } from "../worker/retention";
import type { Env } from "../worker/types";

const PDF = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
const EXE = new Uint8Array([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);

test("validation: required fields, email, consent, unknown fields dropped, lengths limited", () => {
  const good = validateFields("enquiry", { name: " Ada ", email: "ada@example.com", consent_contact: "yes", message: "Hello", injected: "x" });
  assert.ok(good.ok);
  assert.deepEqual(good.ok && good.data, { name: "Ada", email: "ada@example.com", consent_contact: "yes", message: "Hello" });
  const bad = validateFields("enquiry", { name: "", email: "not-an-email", consent_contact: "no" });
  assert.ok(!bad.ok);
  assert.deepEqual(Object.keys(!bad.ok ? bad.errors : {}).sort(), ["consent_contact", "email", "name"]);
  const long = validateFields("enquiry", { name: "A", email: "a@b.co", consent_contact: "yes", message: "x".repeat(2001) });
  assert.ok(!long.ok && long.errors.message);
  assert.ok(!validateFields("expert", { name: "A", email: "a@b.co", expertise: "HR & Operations", profile_url: "javascript:alert(1)", consent_contact: "yes" }).ok);
  assert.ok(!validateFields("proposal", { name: "A", email: "a@b.co", consent_contact: "yes" }).ok); // organisation, country and brief required
});

test("files: the extension and the first bytes must both match an allowed type", () => {
  const rule = FORMS.career.files[0];
  assert.deepEqual(detectFile(rule, "cv.PDF", PDF), { ext: "pdf", mime: "application/pdf" });
  assert.equal(detectFile(rule, "cv.pdf", EXE), null); // renamed executable
  assert.equal(detectFile(rule, "cv.exe", PDF), null);
  assert.ok(detectFile(rule, "cv.docx", new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0, 0, 0, 0])));
  assert.equal(detectFile(FORMS.proposal.files[0], "brief.docx", new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0, 0, 0, 0])), null); // briefs: PDF only
});

test("refs, upload keys and the 6-month cutoff", () => {
  const ref = makeRef(new Date("2026-11-03T10:00:00Z"), () => new Uint8Array([0, 1, 2, 30]));
  assert.match(ref, REF_PATTERN);
  assert.ok(ref.startsWith("SCS-2611-"));
  assert.equal(uploadKey("career", "cv", ref, "pdf", new Date("2026-11-03T00:00:00Z")), `cv/2026/${ref}-cv.pdf`);
  assert.equal(retentionCutoff(new Date("2026-11-03T00:00:00Z")), "2026-05-03T00:00:00.000Z");
});

// ---------- the Worker pipeline, against fakes ----------
function harness(opts: { turnstile?: boolean; rateOk?: boolean; resend?: boolean } = {}) {
  const rows: unknown[][] = [];
  const puts: { key: string; type?: string }[] = [];
  const mails: { to: string[]; subject: string; text: string; reply_to?: string }[] = [];
  const env: Env = {
    ASSETS: { fetch: async () => new Response("") },
    DB: { prepare: () => ({ bind: (...v: unknown[]) => ({ run: async () => rows.push(v), all: async () => ({ results: [] }) }) }) },
    UPLOADS: { put: async (key, _v, o) => void puts.push({ key, type: o?.httpMetadata?.contentType }), delete: async () => {} },
    RATE_LIMITER: { limit: async () => ({ success: opts.rateOk ?? true }) },
    TURNSTILE_SECRET: "1x0000000000000000000000000000000AA",
    RESEND_API_KEY: opts.resend === false ? undefined : "re_test",
    MAIL_FROM: "Stephen Corporate Services - SCS Ltd <contact@send.example.test>",
    MAIL_REPLY_TO: "contact@example.test",
    NOTIFY_SALES: "sales@example.test",
    NOTIFY_CONTACT: "contact@example.test",
  };
  const fetcher = (async (url: string | URL | Request, init?: RequestInit) => {
    const u = String(url);
    if (u.includes("turnstile")) return Response.json({ success: opts.turnstile ?? true });
    if (u.includes("api.resend.com")) {
      mails.push(JSON.parse(String(init?.body)));
      return Response.json({ id: "x" });
    }
    throw new Error("unexpected fetch " + u);
  }) as typeof fetch;
  const deps = { fetcher, now: () => new Date("2026-11-03T10:00:00Z"), random: () => new Uint8Array([5, 6, 7, 8]), uuid: () => "uuid-1" };
  const post = (form: string, body: Record<string, string>) =>
    handleForm(new Request(`https://x.test/api/forms/${form}`, { method: "POST", headers: { "content-type": "application/json", "cf-connecting-ip": "203.0.113.9" }, body: JSON.stringify(body) }), env, form, deps);
  const postMultipart = (form: string, fields: Record<string, string>, files: Record<string, File>) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(fields)) fd.set(k, v);
    for (const [k, v] of Object.entries(files)) fd.set(k, v);
    return handleForm(new Request(`https://x.test/api/forms/${form}`, { method: "POST", body: fd }), env, form, deps);
  };
  return { env, rows, puts, mails, post, postMultipart };
}
const ENQUIRY = { name: "Ada Obi", email: "ada@example.com", topic: "Compliance & Regulatory", message: "Annual returns", consent_contact: "yes", [TURNSTILE_FIELD]: "XXXX.DUMMY.TOKEN", request_type: "consultation", utm_source: "linkedin", service_id: "CR-01" };

test("pipeline: a valid enquiry is stored with its ref and UTM, and both emails go out with the 24-hour promise", async () => {
  const h = harness();
  const r = await h.post("enquiry", ENQUIRY);
  assert.equal(r.status, 200);
  assert.match(String(r.body.ref), REF_PATTERN);
  assert.equal(r.body.nextStep, "book_call");
  assert.equal(h.rows.length, 1);
  const row = h.rows[0];
  assert.equal(row[2], "enquiry");
  assert.equal(row[3], "consultation");
  assert.equal(row[4], "CR-01");
  assert.equal(row[8], "linkedin"); // utm_source
  assert.doesNotMatch(String(row[6]), /cf-turnstile|utm_source/); // the token and meta are not kept in the fields JSON
  assert.equal(h.mails.length, 2);
  const [internal, confirmation] = h.mails;
  assert.deepEqual(internal.to, ["sales@example.test"]);
  assert.equal(internal.reply_to, "ada@example.com");
  assert.ok(internal.subject.includes(String(r.body.ref)));
  assert.deepEqual(confirmation.to, ["ada@example.com"]);
  assert.match(confirmation.text, /We respond within 24 hours\./);
  assert.ok(confirmation.text.includes(String(r.body.ref)));
});

test("pipeline: honeypot gets a silent success and nothing is stored or sent", async () => {
  const h = harness();
  const r = await h.post("enquiry", { ...ENQUIRY, [HONEYPOT_FIELD]: "spam" });
  assert.equal(r.status, 200);
  assert.equal(r.body.ok, true);
  assert.equal(h.rows.length + h.mails.length, 0);
});

test("pipeline: Turnstile failure, rate limit and invalid fields are refused before anything is stored", async () => {
  assert.equal((await harness({ turnstile: false }).post("enquiry", ENQUIRY)).status, 400);
  assert.equal((await harness({ rateOk: false }).post("enquiry", ENQUIRY)).status, 429);
  const h = harness();
  const r = await h.post("enquiry", { ...ENQUIRY, email: "nope" });
  assert.equal(r.status, 422);
  assert.ok((r.body.fields as Record<string, string>).email);
  assert.equal(h.rows.length, 0);
});

test("pipeline: a CV is checked, stored privately under cv/<yyyy>/<ref>, and never attached to an email", async () => {
  const h = harness();
  const fields = { name: "Ada", email: "ada@example.com", applying_as: "Staff position", consent_contact: "yes", [TURNSTILE_FIELD]: "XXXX.DUMMY.TOKEN" };
  const r = await h.postMultipart("career", fields, { cv: new File([PDF], "cv.pdf", { type: "application/pdf" }) });
  assert.equal(r.status, 200);
  assert.equal(h.puts.length, 1);
  assert.equal(h.puts[0].key, `cv/2026/${r.body.ref}-cv.pdf`);
  assert.equal(h.puts[0].type, "application/pdf");
  assert.deepEqual(h.mails[0].to, ["contact@example.test"]); // applications go to contact@
  for (const m of h.mails) assert.ok(!("attachments" in m));
  const bad = await harness().postMultipart("career", fields, { cv: new File([EXE], "cv.pdf") });
  assert.equal(bad.status, 422);
});

test("pipeline: without Resend the submission is still stored (an email failure never loses it)", async () => {
  const h = harness({ resend: false });
  assert.equal((await h.post("enquiry", ENQUIRY)).status, 200);
  assert.equal(h.rows.length, 1);
  assert.equal(h.mails.length, 0);
});

test("retention: rows older than 6 months are deleted together with their files", async () => {
  const deleted: string[][] = [];
  const queries: { sql: string; args: unknown[] }[] = [];
  const env: Env = {
    ASSETS: { fetch: async () => new Response("") },
    DB: {
      prepare: (sql) => ({
        bind: (...args: unknown[]) => ({
          run: async () => void queries.push({ sql, args }),
          all: async <T,>() => ({ results: [{ id: "a", file_keys: '["cv/2026/x-cv.pdf"]' }, { id: "b", file_keys: null }] as T[] }),
        }),
      }),
    },
    UPLOADS: { put: async () => {}, delete: async (k) => void deleted.push(Array.isArray(k) ? k : [k]) },
  };
  const r = await purgeOld(env, new Date("2026-11-03T00:00:00Z"));
  assert.deepEqual(r, { rows: 2, files: 1 });
  assert.deepEqual(deleted, [["cv/2026/x-cv.pdf"]]);
  assert.match(queries[0].sql, /^DELETE FROM submissions WHERE created_at < \?/);
  assert.equal(queries[0].args[0], "2026-05-03T00:00:00.000Z");
});

test("schema and config: the migration matches the spec, bindings and the cron are set, no secrets in config", () => {
  const sql = fs.readFileSync("migrations/0001_init.sql", "utf8");
  for (const col of ["ref TEXT UNIQUE NOT NULL", "consent_at TEXT NOT NULL", "utm_campaign", "cv_key TEXT", "status TEXT NOT NULL DEFAULT 'new'"]) assert.ok(sql.includes(col), col);
  const cfg = fs.readFileSync("wrangler.jsonc", "utf8");
  for (const b of ['"binding": "DB"', '"binding": "UPLOADS"', '"name": "RATE_LIMITER"', '"0 1 * * *"']) assert.ok(cfg.includes(b), b);
  assert.doesNotMatch(cfg, /re_[A-Za-z0-9]{10,}|0x4AAA|TURNSTILE_SECRET"\s*:/);
});
