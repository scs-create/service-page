// v2 platform: per-page CSP hashes and the post-build content checks.
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { addPolicy, inlineScripts, sha256 } from "../scripts/csp-hashes.mjs";
import { bannedHits, legalHits, missingRedirectTargets, run, visibleText } from "../scripts/check-site.mjs";

test("csp: hashes inline executable scripts only", () => {
  const html = `<html><head><title>x</title></head><body>
    <script>self.a=1</script><script src="/_next/a.js"></script>
    <script type="application/ld+json">{"@type":"Organization"}</script><script type="module">b()</script></body></html>`;
  assert.deepEqual(inlineScripts(html), ["self.a=1", "b()"]);
  const { html: out, count } = addPolicy(html);
  assert.equal(count, 2);
  assert.match(out, /^<html><head><meta http-equiv="Content-Security-Policy" content="script-src 'self' https:\/\/challenges\.cloudflare\.com 'sha256-/);
  assert.ok(out.includes(sha256("self.a=1")));
  assert.ok(!out.includes("unsafe-inline"));
});

test("csp: re-running replaces the policy instead of stacking it", () => {
  const once = addPolicy("<head></head><script>x()</script>").html;
  const twice = addPolicy(once).html;
  assert.equal(twice, once);
});

test("csp: known SHA-256 value", () => {
  // printf 'alert(1)' | openssl dgst -sha256 -binary | base64
  assert.equal(sha256("alert(1)"), "'sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI='");
});

test("check: visible text drops scripts and decodes entities", () => {
  const t = visibleText(`<p>A &amp; B&#39;s</p><script>journey()</script><style>.robust{}</style>`);
  assert.equal(t.trim(), "A & B's");
});

test("check: banned words, with the tagline and client name allowed", () => {
  assert.deepEqual(bannedHits("Elevate Your Company, Go Global. Light Bearers Education & Empowerment Foundation"), {});
  assert.deepEqual(bannedHits("Your growth journey, a robust and Seamless plan"), { seamless: 1, robust: 1, journey: 1 });
  assert.deepEqual(bannedHits("We empower teams"), { empower: 1 });
});

test("check: legal words are reported and kept passages marked", () => {
  const hits = legalHits("Is SCS a law firm? No." + " ".repeat(60) + "Obtain legal advice.");
  assert.equal(hits.length, 2);
  assert.equal(hits.find((h: { word: string }) => h.word === "law firm")!.kept, true);
  assert.equal(hits.find((h: { word: string }) => h.word === "legal advice")!.kept, false);
});

function site() {
  const dir = mkdtempSync(join(tmpdir(), "scs-out-"));
  mkdirSync(join(dir, "services"));
  writeFileSync(join(dir, "index.html"), "<head></head><p>Home</p>");
  writeFileSync(join(dir, "services.html"), "<head></head><p>Our journey</p>");
  writeFileSync(join(dir, "services", "a.html"), "<head></head><p>[OWNER TO CONFIRM]</p>");
  writeFileSync(join(dir, "_redirects"), "/old /services/a 301\n/x/* /services/:splat 301\n/gone /nowhere 301\n");
  return dir;
}

test("check: redirect targets must exist", () => {
  const dir = site();
  assert.deepEqual(missingRedirectTargets(dir, "/old /services/a 301\n/x/* /services/:splat 301\n/gone /nowhere 301\n# c\n"), ["/gone -> /nowhere"]);
});

test("check: baseline ratchet in preview, zero tolerance in production", () => {
  const dir = site();
  writeFileSync(join(dir, "_redirects"), "/old /services/a 301\n");
  const preview = run(dir, { baseline: { "/services": { journey: 1 } } });
  assert.deepEqual(preview.errors, []);
  assert.equal(preview.ownerToConfirm, 1);
  const noBaseline = run(dir, {});
  assert.equal(noBaseline.errors.length, 1);
  const prod = run(dir, { production: true, baseline: { "/services": { journey: 1 } } });
  assert.equal(prod.errors.length, 2); // banned word + [OWNER TO CONFIRM]
});

test("check: old phone number and Benhen always fail", () => {
  const dir = site();
  writeFileSync(join(dir, "_redirects"), "");
  writeFileSync(join(dir, "index.html"), "<head></head><a href='tel:+2349064035713'>+234 906 403 5713</a> Benhen");
  assert.equal(run(dir, { baseline: { "/services": { journey: 1 } } }).errors.length, 2);
});

test("prune: pages that rendered the not-found page are found; the real 404 pages are kept", async () => {
  const { softNotFoundPages } = await import("../scripts/prune-soft-404s.mjs");
  const dir = mkdtempSync(join(tmpdir(), "scs-out-"));
  const nf = "<head><title>Page not found | Stephen Corporate Services - SCS Ltd</title></head>";
  writeFileSync(join(dir, "404.html"), nf);
  writeFileSync(join(dir, "_not-found.html"), nf);
  writeFileSync(join(dir, "portal.html"), nf);
  writeFileSync(join(dir, "about.html"), "<head><title>About | Stephen Corporate Services - SCS Ltd</title></head>");
  assert.deepEqual(softNotFoundPages(dir), [join(dir, "portal.html")]);
});
