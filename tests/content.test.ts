import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { z } from "zod";
import { ContentError, parseContent } from "../src/lib/content";
import { portfolioSchema, testimonialSchema, verificationSchema } from "../src/lib/schemas";
import { services } from "../src/content/services/data";
import { portfolio } from "../src/content/portfolio/data";
import { SERVICE_LINE_TO_SLUG } from "../src/content/portfolio/serviceLines";
import { assessment, checklist, calendar, faqs, finderQuiz, industries, ipAll, ipVisible, regulators, structureQuiz, SUPPORT_PACKAGES } from "../src/content/loaders";
import { buildFormsHtml } from "../scripts/gen-forms";
import { scoreAssessment } from "../src/lib/assessment";
import { rankOutcomes } from "../src/lib/quiz";
import { searchEntries } from "../src/lib/search";
import { buildSearchIndex } from "../src/lib/searchIndex";
import { hasPlaceholders } from "../src/lib/legal";
import { SITE } from "../src/lib/site";
import type { LegalDocumentData } from "../src/lib/types";

const serviceSlugs = new Set(services.map((s) => s.slug));
const regCodes = new Set(regulators.map((r) => r.code));
const legal = (n: string) => JSON.parse(fs.readFileSync(`src/content/legal/${n}.json`, "utf-8")) as LegalDocumentData;

// ---------- M-05: validation reports file + field ----------
test("invalid content fails with the file and field named", () => {
  assert.throws(() => parseContent({ rc: "abc" }, portfolioSchema, "src/content/portfolio/entries/x.json"), (e: unknown) => {
    assert.ok(e instanceof ContentError);
    assert.match((e as Error).message, /src\/content\/portfolio\/entries\/x\.json/);
    assert.match((e as Error).message, /field "rc"/);
    return true;
  });
});
test("testimonials cannot be published without consent", () => {
  const r = testimonialSchema.safeParse({ quote: "Great", name: "A", consent: false });
  assert.equal(r.success, false);
});
test("verification documents must describe their image", () => {
  assert.equal(verificationSchema.safeParse({ slug: "a", title: "T", category: "Regulatory Permit", image: "/x.png", alt: "" }).success, false);
});

// ---------- Content integrity ----------
test("21 services, 16 case studies, 12 industries, packages A–F, 10 FAQs", () => {
  assert.equal(services.length, 21);
  assert.equal(portfolio.length, 16);
  assert.equal(industries.length, 12);
  assert.deepEqual(SUPPORT_PACKAGES.map((p) => p.id), ["A", "B", "C", "D", "E", "F"]);
  assert.equal(faqs.length, 10);
});
test("every referenced service slug exists", () => {
  for (const s of Object.values(SERVICE_LINE_TO_SLUG)) assert.ok(serviceSlugs.has(s), `serviceLines → ${s}`);
  for (const i of industries) for (const s of i.services) assert.ok(serviceSlugs.has(s), `${i.slug} → ${s}`);
  for (const d of assessment.domains) for (const s of [d.serviceSlug, ...d.related]) assert.ok(serviceSlugs.has(s), `assessment ${d.id} → ${s}`);
});
test("every referenced regulator code exists (list supplied by the client)", () => {
  const used = [...industries.flatMap((i) => i.regulators), ...checklist.types.flatMap((t) => t.items.flatMap((i) => i.regulators)), ...checklist.sectors.flatMap((s) => s.items.flatMap((i) => i.regulators)), ...calendar.areas.flatMap((a) => a.regulators)];
  for (const c of used) assert.ok(regCodes.has(c), `unknown regulator ${c}`);
});
test("portfolio: every case study has an RC number and its service lines are mapped", () => {
  for (const p of portfolio) {
    assert.match(p.rc, /^\d+$/);
    for (const l of p.serviceLines) assert.ok(SERVICE_LINE_TO_SLUG[l], `${p.slug}: unmapped service line "${l}"`);
  }
});
test("IP showcase: nothing is public until permission is granted", () => {
  assert.equal(ipAll.length, 18);
  assert.equal(ipVisible.length, 0);
});

// ---------- Forms: skeleton is generated from the same registry the site posts with ----------
test("public/__forms.html is up to date with src/lib/formFields.ts", () => {
  assert.equal(fs.readFileSync("public/__forms.html", "utf-8"), buildFormsHtml());
});
test("exactly two forms: enquiry (all leads) and career-application (with uploads)", () => {
  const html = buildFormsHtml();
  assert.equal((html.match(/<form /g) ?? []).length, 2);
  assert.match(html, /name="request_type"/);
  assert.match(html, /enctype="multipart\/form-data"/);
});

// ---------- Tools ----------
test("assessment scoring: percent, band and gap ordering", () => {
  const all2 = Object.fromEntries(assessment.domains.map((d) => [d.id, 2 as const]));
  assert.equal(scoreAssessment(assessment, "idea", all2).percent, 100);
  assert.equal(scoreAssessment(assessment, "idea", all2).band, "Strong");
  const none = scoreAssessment(assessment, "idea", {});
  assert.equal(none.percent, 0);
  assert.equal(none.band, "Needs attention");
  assert.equal(none.gaps[0].id, "structure"); // idea-stage priority comes first among equal scores
  const mixed = scoreAssessment(assessment, "established", { ...all2, data: 0, tax: 1 });
  assert.equal(mixed.gaps[0].id, "data"); // weakest first
  assert.equal(mixed.gaps[1].id, "tax");
});
test("quiz ranking: weighted outcomes", () => {
  const picks = Object.fromEntries(structureQuiz.questions.map((q) => [q.id, 0]));
  assert.equal(rankOutcomes(structureQuiz, picks)[0].id, "company"); // profit + sole owner + yes + yes → company
  const nonprofit = { ...picks, purpose: 1 };
  assert.equal(rankOutcomes(structureQuiz, nonprofit)[0].id, "trustees");
  assert.ok(rankOutcomes(finderQuiz, { stage: 0, worry: 1, mode: 2 }).some((r) => r.id === "college"));
});
test("site search ranks title matches first and requires every word", () => {
  const idx = buildSearchIndex();
  assert.ok(idx.length > 60);
  assert.equal(searchEntries(idx, "tax")[0].kind !== undefined, true);
  assert.ok(searchEntries(idx, "premier pharmaceuticals").some((e) => e.kind === "Case study"));
  assert.equal(searchEntries(idx, "zzzzqqq").length, 0);
});

// ---------- M-04: legal pages and indexing ----------
test("legal pages with unresolved placeholders are flagged (noindex + left out of the sitemap)", () => {
  // The final documents (supplied 18 October 2026) have none, so all three are published and indexable.
  for (const n of ["terms", "privacy", "cookies"]) assert.equal(hasPlaceholders(legal(n)), false, n);
  assert.equal(hasPlaceholders({ ...legal("terms"), intro: [{ type: "p", text: "Pay within [30] days." }] }), true);
  assert.equal(hasPlaceholders({ ...legal("cookies"), intro: [], sections: [{ id: "a", heading: "A", level: 2, blocks: [{ type: "p", text: "All resolved." }] }] }), false);
});
test("legal text contains no old-domain emails or personal Gmail addresses", () => {
  const all = ["terms", "privacy", "cookies"].map((n) => JSON.stringify(legal(n))).join("");
  assert.doesNotMatch(all, /@stephencorporateservices\.com/);
  assert.doesNotMatch(all, /@gmail\.com/);
});
test("legal pages take company details from site.ts tokens, never hard-coded copies", () => {
  const all = ["terms", "privacy", "cookies"].map((n) => JSON.stringify(legal(n))).join("");
  for (const t of ["{{rc}}", "{{address}}", "{{email_privacy}}", "{{phone}}"]) assert.ok(all.includes(t), t);
  assert.doesNotMatch(all, /9552075|Belham|Benhen|09064035713/); // the supplied documents' variants
  assert.equal(SITE.rc, "9041457");
  assert.match(SITE.address.full, /^SD20 Belham Estate, Karsana/);
});
test("no link points at the CAC search portal (it returned 404); only the CAC website is linked", () => {
  const walk = (d: string): string[] => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${d}/${e.name}`) : [`${d}/${e.name}`]));
  const hits = walk("src").filter((f) => /\.(ts|tsx|json)$/.test(f) && /search\.cac\.gov\.ng/.test(fs.readFileSync(f, "utf-8")));
  assert.deepEqual(hits, []);
  assert.equal(SITE.cacUrl, "https://www.cac.gov.ng");
});
test("every legal date is the launch date, 16 October 2026", () => {
  for (const n of ["terms", "privacy", "cookies"]) {
    const d = legal(n) as unknown as { effective: string; updated: string };
    assert.equal(d.effective, "16 October 2026");
    assert.equal(d.updated, "16 October 2026");
    assert.doesNotMatch(JSON.stringify(d), /(19|20)\d\d(?<!2023)(?<!2025)(?<!2026)/); // only NDPA 2023, GAID 2025 and 2026
  }
});
test("breadcrumbs are restored and Corporate School has the ten supplied articles (samples removed)", () => {
  assert.equal(fs.existsSync("src/components/ui/Breadcrumbs.tsx"), true);
  const posts = fs.readdirSync("src/content/corporate-school").filter((f) => f.endsWith(".md"));
  assert.equal(posts.length, 10);
  assert.ok(!posts.includes("understanding-business-registration-nigeria.md") && !posts.includes("data-protection-compliance-basics.md"));
  for (const f of posts) assert.doesNotMatch(fs.readFileSync(`src/content/corporate-school/${f}`, "utf-8"), /utm_source/);
});
test("booking calls to action never fall back to an empty URL", () => {
  assert.match(SITE.bookingUrl, /^https:\/\/cal\.com\//);
});
test("the website sections describe the tools this site actually uses", () => {
  const privacy = JSON.stringify(legal("privacy")), cookies = JSON.stringify(legal("cookies"));
  for (const t of ["Netlify", "Plausible", "Cal.com", "GitHub"]) assert.match(privacy, new RegExp(t));
  for (const t of ["scs_cookie_consent", "plausible_ignore", "Plausible"]) assert.match(cookies, new RegExp(t));
});
void z;
