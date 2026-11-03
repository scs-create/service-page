// Post-build: give every exported HTML page its own script-src policy listing the SHA-256 hash of each inline
// script on that page (docs/v2/06-TECH-SPEC.md §8). The site is a static export, so Next.js must inline its
// bootstrap scripts and per-request nonces are impossible; hashes are the static-site equivalent.
//
// public/_headers sends the full CSP as a header. This adds a second policy as <meta http-equiv>. Browsers
// enforce both, so an inline script runs only if its exact hash is listed here. JSON-LD and other data blocks
// (type="application/ld+json") are not executed, so they need no hash.
//
// out/admin (Decap CMS) is skipped: the Worker gives /admin its own policy (worker/index.ts ADMIN_CSP).
//
// Usage: node scripts/csp-hashes.mjs [outDir]   (runs automatically after `next build`)
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const OUT = process.argv[2] ?? "out";
export const SCRIPT_SOURCES = ["'self'", "https://challenges.cloudflare.com"]; // Turnstile (forms PR)
const EXECUTABLE = /^(|text\/javascript|application\/javascript|module)$/i;

export function walkHtml(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return walkHtml(p);
    return p.endsWith(".html") ? [p] : [];
  });
}

// Inline, executable <script> bodies exactly as written (browsers hash the raw text, no entity decoding).
export function inlineScripts(html) {
  const found = [];
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    if (/\ssrc\s*=/i.test(attrs)) continue;
    const type = (attrs.match(/\stype\s*=\s*["']?([^"'\s>]+)/i)?.[1] ?? "").trim();
    if (!EXECUTABLE.test(type)) continue;
    found.push(m[2]);
  }
  return found;
}

export const sha256 = (s) => `'sha256-${createHash("sha256").update(s, "utf8").digest("base64")}'`;

export function addPolicy(html) {
  const cleaned = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/i, "");
  const hashes = [...new Set(inlineScripts(cleaned).map(sha256))];
  const meta = `<meta http-equiv="Content-Security-Policy" content="script-src ${[...SCRIPT_SOURCES, ...hashes].join(" ")}">`;
  if (!/<head[^>]*>/i.test(cleaned)) throw new Error("no <head> element");
  // First thing in <head>, so it applies before any script is parsed.
  return { html: cleaned.replace(/<head[^>]*>/i, (h) => h + meta), count: hashes.length };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  let pages = 0, total = 0;
  for (const file of walkHtml(OUT).filter((f) => !/^[\\/]admin[\\/]/.test(f.slice(OUT.length)))) {
    const { html, count } = addPolicy(readFileSync(file, "utf8"));
    writeFileSync(file, html);
    pages++; total += count;
  }
  console.log(`csp-hashes: ${pages} pages, ${total} inline script hashes`);
}
