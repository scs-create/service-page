// v2 content migration (docs/v2/05-SITE-SPEC.md §8, 02-DECISIONS.md §3): guides (item 20), topic hubs, case studies,
// the full company name, banned words and the policy updates.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { getAllPosts } from "../src/lib/posts";
import { TOPICS } from "../src/content/v2/topics";
import { getServiceById } from "../src/content/v2/catalogue";
import { portfolio } from "../src/content/portfolio/data";

const read = (p: string) => fs.readFileSync(p, "utf8");
const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));

test("item 20: guides carry no 'obtain legal advice' reader notes; item 19's kept line is the only lawyer mention", () => {
  const posts = fs.readdirSync("src/content/corporate-school").filter((f) => f.endsWith(".md"));
  assert.equal(posts.length, 10);
  for (const f of posts) {
    const text = read(`src/content/corporate-school/${f}`);
    assert.doesNotMatch(text, /legal advice/i, f);
    if (f !== "drafting-a-master-service-agreement.md") assert.doesNotMatch(text, /lawyer/i, f);
  }
  assert.match(read("src/content/corporate-school/drafting-a-master-service-agreement.md"), /lawyer's drafting or advice/); // item 19 kept
  const page = read("src/app/corporate-college/corporate-school/[slug]/page.tsx");
  assert.match(page, /For general information only\./);
  assert.match(page, /seek specialist professional advice for your situation/);
  assert.match(page, /Last reviewed/);
});

test("guides: every post has a published and a reviewed date", () => {
  for (const p of getAllPosts(new Date("2100-01-01"))) {
    assert.ok(p.date && p.reviewed, p.slug);
    assert.ok(new Date(p.reviewed!) >= new Date(p.date), p.slug);
  }
});

test("topic hubs: the six from the spec, real services and guides, official https sources, no fees", () => {
  assert.deepEqual(TOPICS.map((t) => t.slug), ["company-registration", "post-incorporation-filings", "tax-registration", "data-protection", "doing-business-in-nigeria", "funding-readiness"]);
  const slugs = new Set(getAllPosts(new Date("2100-01-01")).map((p) => p.slug));
  for (const t of TOPICS) {
    for (const id of t.services) assert.ok(getServiceById(id), `${t.slug}: ${id}`);
    for (const g of t.guides) assert.ok(slugs.has(g), `${t.slug}: ${g}`);
    for (const s of t.sources) assert.match(s.url, /^https:\/\/(www\.)?[a-z]+\.gov\.ng$/, s.url);
  }
  assert.doesNotMatch(JSON.stringify(TOPICS), /₦|\bNGN\b|\bfee\b|\b\d+\s*(working\s+)?(days?|weeks?)\b/i);
});

test("case studies: all 23 on the K template; no invented dates", () => {
  assert.equal(portfolio.length, 23);
  const page = read("src/app/portfolio/[slug]/page.tsx");
  for (const s of ["The challenge", "What SCS did", "The outcome", "Related services", "Discuss similar work", "Verify this client"]) assert.ok(page.includes(s), s);
  assert.doesNotMatch(page, /toLocaleDateString/);
});

test("the full company name everywhere (owner decision b)", () => {
  const files = walk("src").filter((f) => /\.(tsx?|json|md)$/.test(f));
  for (const f of files) assert.doesNotMatch(read(f), /Stephen Corporate Services (\(SCS\) )?Ltd|Stephen Corporate Services Limited/, f);
  assert.match(read("src/lib/site.ts"), /legalName: "Stephen Corporate Services - SCS Ltd"/);
});

test("banned words: the v1 baseline is empty, so a production build allows none", () => {
  assert.deepEqual(JSON.parse(read("scripts/banned-baseline.json")), {});
});

test("policies: Cloudflare, Turnstile and Resend named, 6-month retention for every submission, Netlify gone", () => {
  const privacy = read("src/content/legal/privacy.json");
  for (const t of ["Cloudflare, Inc.", "Cloudflare Turnstile", "Resend, Inc.", "deleted after six (6) months"]) assert.ok(privacy.includes(t), t);
  for (const f of ["privacy", "cookies", "terms"]) assert.doesNotMatch(read(`src/content/legal/${f}.json`), /netlify/i, f);
});
