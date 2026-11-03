// Staff view of form submissions (docs/v2/06-TECH-SPEC.md §6), inside the Worker and behind Cloudflare Access (or the
// password gate until Access is set up). Read-only except for the status. No scripts: plain HTML and forms.
//   GET  /admin/submissions                 recent submissions, filtered by ?form= and ?status=
//   GET  /admin/submissions/<ref>           one submission, its fields and its files
//   POST /admin/submissions/<ref>/status    change the status (same-origin form post)
//   GET  /admin/submissions/file?key&exp&sig  a stored file, through a signed link valid for 15 minutes
import { FORM_NAMES } from "../src/lib/formFields";
import { REF_PATTERN } from "../src/lib/formValidation";
import type { Env } from "./types";

export const STATUSES = ["new", "reviewed", "replied", "closed"] as const;
const LINK_TTL_SECONDS = 15 * 60;

type Row = { ref: string; form: string; request_type: string | null; service_id: string | null; fields: string; status: string; created_at: string; file_keys: string | null; utm_source: string | null; utm_medium: string | null; utm_campaign: string | null };

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const when = (iso: string) => new Date(iso).toLocaleString("en-GB", { timeZone: "Africa/Lagos", dateStyle: "medium", timeStyle: "short" }) + " WAT";

const STYLE = `body{font:15px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;color:#0b1730;margin:0;background:#f1f5fc}header,main{max-width:1200px;margin:0 auto;padding:16px 24px}header{display:flex;gap:16px;align-items:baseline;justify-content:space-between;border-bottom:4px solid #f9b91a;background:#011550;color:#fff;max-width:none}header a{color:#fff}a{color:#0340a9}table{width:100%;border-collapse:collapse;background:#fff}th,td{text-align:left;padding:8px 10px;border-bottom:1px solid #d6e0f2;vertical-align:top}th{background:#011550;color:#fff;font-weight:600}form.filters{display:flex;gap:12px;flex-wrap:wrap;align-items:end;margin:16px 0}select,button{font:inherit;min-height:40px;padding:0 10px;border:1px solid #8a9bbb;border-radius:4px;background:#fff}button{background:#0340a9;color:#fff;border-color:#0340a9}dl{display:grid;grid-template-columns:200px 1fr;gap:6px 16px;background:#fff;padding:16px;border:1px solid #d6e0f2}dt{color:#475a7d}dd{margin:0;white-space:pre-wrap}.pill{display:inline-block;padding:0 8px;border-radius:999px;background:#f1f5fc;border:1px solid #d6e0f2;font-size:13px}`;

function page(title: string, body: string, status = 200): Response {
  return new Response(
    `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)} · SCS submissions</title><style>${STYLE}</style></head><body><header><strong>Stephen Corporate Services - SCS Ltd · Submissions</strong><a href="/admin/submissions">All submissions</a></header><main>${body}</main></body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

// ---------- signed file links ----------
async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export async function signFileLink(secret: string, key: string, now = Date.now()): Promise<string> {
  const exp = Math.floor(now / 1000) + LINK_TTL_SECONDS;
  return `/admin/submissions/file?key=${encodeURIComponent(key)}&exp=${exp}&sig=${await hmac(secret, `${key}\n${exp}`)}`;
}
export async function checkFileLink(secret: string, url: URL, now = Date.now()): Promise<string | null> {
  const key = url.searchParams.get("key") ?? "";
  const exp = Number(url.searchParams.get("exp") ?? "0");
  const sig = url.searchParams.get("sig") ?? "";
  if (!key || !exp || exp < Math.floor(now / 1000)) return null;
  const expected = await hmac(secret, `${key}\n${exp}`);
  if (expected.length !== sig.length) return null;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0 ? key : null;
}

// ---------- pages ----------
async function list(env: Env, url: URL): Promise<Response> {
  const form = url.searchParams.get("form") ?? "";
  const status = url.searchParams.get("status") ?? "";
  const where: string[] = [];
  const args: string[] = [];
  if ((FORM_NAMES as readonly string[]).includes(form)) {
    where.push("form = ?");
    args.push(form);
  }
  if ((STATUSES as readonly string[]).includes(status)) {
    where.push("status = ?");
    args.push(status);
  }
  const sql = `SELECT ref, form, request_type, service_id, fields, status, created_at, file_keys, utm_source, utm_medium, utm_campaign FROM submissions${where.length ? " WHERE " + where.join(" AND ") : ""} ORDER BY created_at DESC LIMIT 200`;
  const { results } = await env.DB!.prepare(sql).bind(...args).all<Row>();
  const option = (v: string, cur: string) => `<option value="${v}"${v === cur ? " selected" : ""}>${v || "All"}</option>`;
  const rows = results
    .map((r) => {
      const f = JSON.parse(r.fields) as Record<string, string>;
      const files = r.file_keys ? (JSON.parse(r.file_keys) as string[]).length : 0;
      return `<tr><td><a href="/admin/submissions/${esc(r.ref)}">${esc(r.ref)}</a></td><td>${esc(when(r.created_at))}</td><td>${esc(r.form)}${r.request_type ? `<br><small>${esc(r.request_type)}</small>` : ""}</td><td>${esc(f.name)}<br><small>${esc(f.email)}</small></td><td>${esc(f.organisation ?? "")}</td><td>${files ? `${files} file${files > 1 ? "s" : ""}` : ""}</td><td><span class="pill">${esc(r.status)}</span></td></tr>`;
    })
    .join("");
  return page(
    "Submissions",
    `<h1>Submissions</h1><p>Kept for six months, then deleted automatically with their files.</p>
<form class="filters" method="get"><label>Form<br><select name="form">${["", ...FORM_NAMES].map((v) => option(v, form)).join("")}</select></label><label>Status<br><select name="status">${["", ...STATUSES].map((v) => option(v, status)).join("")}</select></label><button type="submit">Filter</button></form>
<table><thead><tr><th>Reference</th><th>Received</th><th>Form</th><th>Name and email</th><th>Organisation</th><th>Files</th><th>Status</th></tr></thead><tbody>${rows || `<tr><td colspan="7">No submissions match.</td></tr>`}</tbody></table>`
  );
}

async function detail(env: Env, ref: string): Promise<Response> {
  const { results } = await env.DB!.prepare("SELECT ref, form, request_type, service_id, fields, status, created_at, file_keys, utm_source, utm_medium, utm_campaign FROM submissions WHERE ref = ?").bind(ref).all<Row>();
  const r = results[0];
  if (!r) return page("Not found", "<h1>Not found</h1><p>No submission has that reference.</p>", 404);
  const fields = JSON.parse(r.fields) as Record<string, string>;
  const keys = r.file_keys ? (JSON.parse(r.file_keys) as string[]) : [];
  const links = env.FILE_LINK_SECRET
    ? await Promise.all(keys.map(async (k) => `<li><a href="${esc(await signFileLink(env.FILE_LINK_SECRET!, k))}">${esc(k.split("/").pop())}</a> <small>(link valid for 15 minutes)</small></li>`))
    : keys.map((k) => `<li>${esc(k.split("/").pop())} <small>(file links need the FILE_LINK_SECRET Worker secret)</small></li>`);
  const meta: [string, string | null][] = [["Form", r.form], ["Request type", r.request_type], ["Service ID", r.service_id], ["Received", when(r.created_at)], ["Campaign", [r.utm_source, r.utm_medium, r.utm_campaign].filter(Boolean).join(" / ") || null]];
  return page(
    r.ref,
    `<h1>${esc(r.ref)}</h1>
<form method="post" action="/admin/submissions/${esc(r.ref)}/status" class="filters"><label>Status<br><select name="status">${STATUSES.map((s) => `<option${s === r.status ? " selected" : ""}>${s}</option>`).join("")}</select></label><button type="submit">Save status</button></form>
<dl>${meta.filter(([, v]) => v).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}${Object.entries(fields).filter(([k]) => k !== "consent_contact").map(([k, v]) => `<dt>${esc(k.replace(/_/g, " "))}</dt><dd>${esc(v)}</dd>`).join("")}<dt>Consent</dt><dd>Given with the submission</dd></dl>
${keys.length ? `<h2>Files</h2><ul>${links.join("")}</ul>` : ""}`
  );
}

async function setStatus(request: Request, env: Env, ref: string): Promise<Response> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return page("Refused", "<p>That request came from another site.</p>", 403);
  const status = String((await request.formData()).get("status") ?? "");
  if (!(STATUSES as readonly string[]).includes(status)) return page("Invalid", "<p>Unknown status.</p>", 400);
  await env.DB!.prepare("UPDATE submissions SET status = ? WHERE ref = ?").bind(status, ref).run();
  return new Response(null, { status: 303, headers: { Location: `/admin/submissions/${ref}` } });
}

async function file(env: Env, url: URL): Promise<Response> {
  if (!env.FILE_LINK_SECRET || !env.UPLOADS) return page("Unavailable", "<p>File links are not configured.</p>", 503);
  const key = await checkFileLink(env.FILE_LINK_SECRET, url);
  if (!key) return page("Link expired", "<p>This file link has expired or is not valid. Open the submission again for a new link.</p>", 403);
  const obj = await env.UPLOADS.get(key);
  if (!obj) return page("Not found", "<p>The file is no longer stored (files are deleted after six months).</p>", 404);
  return new Response(obj.body, {
    headers: { "Content-Type": obj.httpMetadata?.contentType ?? "application/octet-stream", "Content-Disposition": `attachment; filename="${key.split("/").pop()}"` },
  });
}

// Called only after the admin gate (Access or password) has passed.
export async function handleSubmissions(request: Request, env: Env, pathname: string): Promise<Response> {
  if (!env.DB) return page("Unavailable", "<p>The submissions database is not configured yet.</p>", 503);
  const url = new URL(request.url);
  const rest = pathname.replace(/^\/admin\/submissions\/?/, "");
  if (rest === "") return list(env, url);
  if (rest === "file") return file(env, url);
  const m = rest.match(/^([A-Z0-9-]+)(\/status)?$/);
  if (!m || !REF_PATTERN.test(m[1])) return page("Not found", "<p>Not found.</p>", 404);
  if (m[2]) return request.method === "POST" ? setStatus(request, env, m[1]) : new Response(null, { status: 405 });
  return detail(env, m[1]);
}
