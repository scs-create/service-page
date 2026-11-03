// Post-build: a page that calls notFound() during a static export (for example /portal with the prototype flag
// off) is still written to out/ as the not-found page, so the host would serve it with status 200. Removing the
// file, its RSC payloads and its folder makes Cloudflare answer with the real 404 page (not_found_handling).
//
// Usage: node scripts/prune-soft-404s.mjs [outDir]   (runs automatically after `next build`)
import { existsSync, readFileSync, rmSync } from "node:fs";
import { basename, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { walkHtml } from "./csp-hashes.mjs";

const NOT_FOUND_TITLE = /<title>Page not found \|/;
const KEEP = new Set(["404.html", "_not-found.html"]);

export function softNotFoundPages(outDir) {
  return walkHtml(outDir).filter((f) => !(dirname(f) === outDir && KEEP.has(basename(f))) && NOT_FOUND_TITLE.test(readFileSync(f, "utf8")));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const out = process.argv[2] ?? "out";
  const pages = softNotFoundPages(out);
  for (const html of pages) {
    const base = html.replace(/\.html$/, "");
    for (const p of [html, base + ".txt", base]) if (existsSync(p)) rmSync(p, { recursive: true, force: true });
  }
  console.log(`prune-soft-404s: removed ${pages.length} page(s)${pages.length ? ": " + pages.map((p) => p.slice(out.length)).join(", ") : ""}`);
}
