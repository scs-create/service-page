// Smoke test against a running copy of the site (docs/v2/06-TECH-SPEC.md §11 step 4, docs/DEPLOYMENT.md):
//   node scripts/smoke.mjs http://localhost:8787
//   node scripts/smoke.mjs https://stephencorporateservices-scs.com        (cutover day)
// Checks: every sitemap page returns 200 HTML; every rule in public/_redirects returns 301 to its target; an
// unknown page returns 404; the security headers are present; /admin is never open; the forms endpoint answers.
// Sends no form data. Exits 1 on any failure.
import { readFileSync } from "node:fs";

const base = (process.argv[2] ?? "").replace(/\/$/, "");
if (!/^https?:\/\//.test(base)) {
  console.error("Usage: node scripts/smoke.mjs <base URL>, for example http://localhost:8787");
  process.exit(2);
}

const failures = [];
const fail = (msg) => failures.push(msg);
const get = (path, init = {}) => fetch(base + path, { redirect: "manual", ...init });

async function pool(items, size, fn) {
  const queue = [...items];
  await Promise.all(Array.from({ length: size }, async () => {
    while (queue.length) await fn(queue.shift());
  }));
}

// 1. Every page in the sitemap (its URLs name the live domain; the path is tested against base).
const sitemap = await (await get("/sitemap.xml")).text();
const pages = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
if (pages.length === 0) fail("/sitemap.xml lists no pages");
await pool(pages, 8, async (path) => {
  const res = await get(path);
  const type = res.headers.get("content-type") ?? "";
  if (res.status !== 200) fail(`${path}: ${res.status}, expected 200`);
  else if (!type.includes("text/html")) fail(`${path}: content-type ${type}`);
  await res.body?.cancel();
});

// 2. Every redirect rule. A splat rule is tested with a sample path.
const rules = readFileSync(new URL("../public/_redirects", import.meta.url), "utf8")
  .split(/\r?\n/)
  .filter((l) => l.startsWith("/"))
  .map((l) => l.split(/\s+/));
await pool(rules, 8, async ([from, to, code]) => {
  const path = from.replace("*", "sample");
  const want = to.replace(":splat", "sample");
  const res = await get(path);
  const location = res.headers.get("location") ?? "";
  if (String(res.status) !== code) fail(`${path}: ${res.status}, expected ${code}`);
  else if (new URL(location, base).pathname !== want) fail(`${path}: goes to ${location}, expected ${want}`);
  await res.body?.cancel();
});

// 3. Unknown page, headers, admin, forms endpoint.
const missing = await get("/this-page-does-not-exist");
if (missing.status !== 404) fail(`unknown page: ${missing.status}, expected 404`);
const home = await get("/");
for (const h of ["content-security-policy", "x-content-type-options", "referrer-policy", "permissions-policy"]) {
  if (!home.headers.get(h)) fail(`/: missing header ${h}`);
}
const admin = await get("/admin");
if (admin.status === 200) fail("/admin: open without signing in");
const form = await get("/api/forms/enquiry", { method: "POST", body: "" });
if (form.status === 404 || form.status >= 500 && form.status !== 503) fail(`/api/forms/enquiry: ${form.status}`);
const formNote = form.status === 503 ? " (forms answer 503: a Worker secret is not set yet)" : "";

console.log(`${base}: ${pages.length} pages, ${rules.length} redirects checked${formNote}`);
if (failures.length) {
  for (const f of failures) console.log(`  FAIL ${f}`);
  process.exit(1);
}
console.log("smoke: OK");
