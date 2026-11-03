// Post-build content checks on the exported site in out/ (docs/v2/06-TECH-SPEC.md §10 and §12).
//
//   banned words      fail   (docs/v2/02-DECISIONS.md §2.11). v1 copy still has some; those are frozen in
//                            scripts/banned-baseline.json and may only go down. Production needs the baseline empty.
//   legal words       report only, never fails (02-DECISIONS.md §3); the kept v1 passages are marked "kept".
//   [OWNER TO CONFIRM] fails only when NEXT_PUBLIC_SITE_ENV=production.
//   old phone, Benhen fail always.
//   _redirects        fail if a target is not a real page in out/.
//
// Usage: node scripts/check-site.mjs [outDir] [--update-baseline]
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";
import { walkHtml } from "./csp-hashes.mjs";

const BASELINE_FILE = new URL("./banned-baseline.json", import.meta.url);

export const BANNED = [
  "unlock", "empower", "seamless", "leverage", "cutting-edge", "robust", "holistic",
  "in today's fast-paced world", "journey", "elevate",
];
// The only allowed uses: the tagline (02-DECISIONS.md §2.11) and a real client's registered name.
const BANNED_ALLOW = ["Elevate Your Company, Go Global.", "Light Bearers Education & Empowerment Foundation"];
// Final legal pages keep their v1 wording (owner ruling); the word check does not apply to them.
const KEPT_PAGES = new Set(["/privacy", "/terms", "/cookies", "/disclaimer", "/data-protection"]);

const LEGAL = ["legal advice", "legal services", "law firm", "lawyer", "attorney", "solicitor", "barrister", "litigation", "legal opinion", "esq."];
// Kept v1 passages (02-DECISIONS.md §3, items 1, 2, 13, 16 and the rest of the kept items).
const LEGAL_KEPT = ["Is SCS a law firm?", "does not present itself as a law firm", "Stephen Onyekeja, Esq."];

const OLD_PHONE = /906\W*403\W*5713/;
const BENHEN = /benhen/i;

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", "#39": "'", "#x27": "'", rsquo: "'", lsquo: "'" };
export function visibleText(html) {
  return html
    .replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(#?\w+);/g, (m, e) => ENTITIES[e] ?? (e.startsWith("#") ? String.fromCodePoint(Number(e.slice(1).replace(/^x/, "0x"))) : m))
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ");
}

export function pagePath(outDir, file) {
  const rel = relative(outDir, file).split(sep).join("/").replace(/\.html$/, "");
  return rel === "index" ? "/" : "/" + rel.replace(/\/index$/, "");
}

const count = (text, word) => text.toLowerCase().split(word.toLowerCase()).length - 1;

export function bannedHits(text) {
  let t = text;
  for (const a of BANNED_ALLOW) t = t.split(a).join(" ");
  const hits = {};
  for (const w of BANNED) {
    const n = count(t, w);
    if (n) hits[w] = n;
  }
  return hits;
}

export function legalHits(text) {
  const hits = [];
  for (const w of LEGAL) {
    const re = new RegExp(`.{0,50}${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.{0,50}`, "gi");
    for (const m of text.matchAll(re)) hits.push({ word: w, context: m[0].trim(), kept: LEGAL_KEPT.some((k) => m[0].includes(k)) });
  }
  return hits;
}

// Targets of _redirects rules that point inside the site must exist as exported pages.
export function missingRedirectTargets(outDir, redirects) {
  const missing = [];
  for (const line of redirects.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);
    if (!parts[0] || parts[0].startsWith("#") || parts.length < 2) continue;
    const target = parts[1];
    if (/^https?:/.test(target)) continue;
    const base = target.replace(/\/?:splat$/, "").replace(/[?#].*$/, "").replace(/\/$/, "") || "/";
    const exists = base === "/" ? existsSync(join(outDir, "index.html"))
      : existsSync(join(outDir, base + ".html")) || existsSync(join(outDir, base, "index.html"));
    if (!exists) missing.push(`${parts[0]} -> ${target}`);
  }
  return missing;
}

export function run(outDir, { production = false, updateBaseline = false, baseline = {} } = {}) {
  const errors = [], legal = [], banned = {};
  let ownerToConfirm = 0, pages = 0;
  for (const file of walkHtml(outDir)) {
    const path = pagePath(outDir, file);
    const html = readFileSync(file, "utf8");
    const text = visibleText(html);
    pages++;
    if (OLD_PHONE.test(html)) errors.push(`${path}: old phone number 906 403 5713`);
    if (BENHEN.test(html)) errors.push(`${path}: "Benhen" (the estate is Belham)`);
    if (html.includes("[OWNER TO CONFIRM]")) {
      ownerToConfirm++;
      if (production) errors.push(`${path}: [OWNER TO CONFIRM] in a production build`);
    }
    if (!KEPT_PAGES.has(path)) {
      const hits = bannedHits(text);
      if (Object.keys(hits).length) banned[path] = hits;
    }
    for (const h of legalHits(text)) legal.push({ path, ...h, kept: h.kept || KEPT_PAGES.has(path) });
  }

  for (const [path, hits] of Object.entries(banned)) {
    for (const [w, n] of Object.entries(hits)) {
      const allowed = production ? 0 : (baseline[path]?.[w] ?? 0);
      if (n > allowed) errors.push(`${path}: banned word "${w}" x${n} (baseline ${allowed})`);
    }
  }

  const redirectsFile = join(outDir, "_redirects");
  if (existsSync(redirectsFile)) {
    for (const m of missingRedirectTargets(outDir, readFileSync(redirectsFile, "utf8"))) errors.push(`_redirects target missing: ${m}`);
  } else errors.push("out/_redirects missing");

  return { pages, errors, legal, banned, ownerToConfirm, newBaseline: updateBaseline ? banned : null };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const args = process.argv.slice(2);
  const outDir = args.find((a) => !a.startsWith("--")) ?? "out";
  const production = process.env.NEXT_PUBLIC_SITE_ENV === "production";
  const updateBaseline = args.includes("--update-baseline");
  const baseline = existsSync(BASELINE_FILE) ? JSON.parse(readFileSync(BASELINE_FILE, "utf8")) : {};
  const r = run(outDir, { production, updateBaseline, baseline });

  if (r.newBaseline) {
    writeFileSync(BASELINE_FILE, JSON.stringify(r.newBaseline, null, 2) + "\n");
    console.log(`check-site: baseline written (${Object.keys(r.newBaseline).length} pages)`);
  }
  console.log(`check-site: ${r.pages} pages checked`);
  const legacy = Object.values(r.banned).reduce((s, h) => s + Object.values(h).reduce((a, b) => a + b, 0), 0);
  console.log(`banned words: ${legacy} legacy v1 occurrence(s) on ${Object.keys(r.banned).length} page(s); production needs 0`);
  console.log(`[OWNER TO CONFIRM]: ${r.ownerToConfirm} page(s)`);
  console.log(`legal-word report (review only, never fails): ${r.legal.length} match(es)`);
  for (const h of r.legal) console.log(`  ${h.kept ? "kept " : "check"} ${h.path}  "${h.word}"  …${h.context}…`);
  if (r.errors.length) {
    console.error(`\ncheck-site FAILED (${r.errors.length}):`);
    for (const e of r.errors) console.error("  " + e);
    process.exit(1);
  }
  console.log("check-site: OK");
}
