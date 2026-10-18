import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { renderMarkdown } from "../src/lib/markdown";
import { validateConsent, parseConsent } from "../src/lib/consent";
import { checkBasicAuth, safeEqual } from "../netlify/edge-functions/admin-auth";

// ---------- H-01: CMS Markdown is sanitised ----------
const attacks: [string, string, RegExp][] = [
  ["script tag", "Hello <script>alert(1)</script> world", /<script|alert\(1\)<\/script/i],
  ["img onerror", "<img src=x onerror=alert(1)>", /onerror/i],
  ["javascript: link", "[click](javascript:alert(1))", /javascript:/i],
  ["iframe", '<iframe src="https://evil.example"></iframe>', /<iframe/i],
  ["inline style", '<p style="position:fixed;inset:0">x</p>', /style=/i],
  ["svg onload", "<svg onload=alert(1)></svg>", /<svg|onload/i],
  ["data: image", "![x](data:text/html;base64,PHNjcmlwdD4=)", /data:/i],
  ["form + input", '<form action="https://evil"><input name=a></form>', /<form|<input/i],
  ["object/embed", '<object data="x"></object><embed src="x">', /<object|<embed/i],
];
for (const [name, input, bad] of attacks) {
  test(`sanitiser strips: ${name}`, async () => {
    assert.doesNotMatch(await renderMarkdown(input), bad);
  });
}
test("sanitiser keeps legitimate formatting, safe links and uploaded images", async () => {
  const html = await renderMarkdown("# Title\n\n**bold** and [site](https://example.com)\n\n![alt](/images/uploads/a.png)\n\n- one\n- two");
  assert.match(html, /<h2>Title<\/h2>/); // h1 is demoted: the page title is the only h1
  assert.match(html, /<strong>bold<\/strong>/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /<img[^>]+src="\/images\/uploads\/a\.png"/);
  assert.match(html, /<li>one<\/li>/);
});

// ---------- M-02: consent record validation ----------
const NOW = Date.UTC(2026, 5, 1);
const good = { analytics: true, functional: false, marketing: false, ts: NOW - 1000 };
test("consent: valid record accepted", () => assert.deepEqual(validateConsent(good, NOW)?.analytics, true));
test("consent: expired (>1 year) rejected", () => assert.equal(validateConsent({ ...good, ts: NOW - 366 * 86400000 }, NOW), null));
test("consent: timestamp from the future rejected", () => assert.equal(validateConsent({ ...good, ts: NOW + 3600_000 }, NOW), null));
test("consent: implausibly old timestamp rejected", () => assert.equal(validateConsent({ ...good, ts: 1000 }, NOW), null));
test("consent: missing / wrong-typed fields rejected", () => {
  assert.equal(validateConsent({ ...good, analytics: "yes" }, NOW), null);
  assert.equal(validateConsent({ analytics: true, ts: NOW }, NOW), null);
  assert.equal(validateConsent({ ...good, ts: Number.NaN }, NOW), null);
  assert.equal(validateConsent({ ...good, ts: "now" }, NOW), null);
});
test("consent: non-objects and malformed JSON rejected", () => {
  for (const v of [null, 5, "x", [], true]) assert.equal(validateConsent(v, NOW), null);
  assert.equal(parseConsent("{not json", NOW), null);
  assert.equal(parseConsent(null, NOW), null);
});

// ---------- /admin password gate (Netlify Edge Function) ----------
const basic = (u: string, p: string) => "Basic " + Buffer.from(`${u}:${p}`).toString("base64");
test("admin gate: correct username and password pass", () => assert.equal(checkBasicAuth(basic("editor", "s3cret:with:colons"), "editor", "s3cret:with:colons"), true));
test("admin gate: wrong password, wrong user, missing or malformed header fail", () => {
  assert.equal(checkBasicAuth(basic("editor", "nope"), "editor", "s3cret"), false);
  assert.equal(checkBasicAuth(basic("someone", "s3cret"), "editor", "s3cret"), false);
  assert.equal(checkBasicAuth(null, "editor", "s3cret"), false);
  assert.equal(checkBasicAuth("Bearer abc", "editor", "s3cret"), false);
  assert.equal(checkBasicAuth("Basic !!!not-base64", "editor", "s3cret"), false);
  assert.equal(checkBasicAuth(basic("editor", ""), "editor", "s3cret"), false);
});
test("admin gate: constant-time compare handles different lengths", () => {
  assert.equal(safeEqual("abc", "abc"), true);
  assert.equal(safeEqual("abc", "abcd"), false);
  assert.equal(safeEqual("", "a"), false);
});
test("admin gate: no credentials are stored in the repository", () => {
  const src = fs.readFileSync("netlify/edge-functions/admin-auth.ts", "utf-8") + fs.readFileSync("netlify.toml", "utf-8");
  assert.doesNotMatch(src, /ADMIN_PASSWORD\s*=\s*["']|Basic-Auth/);
});
