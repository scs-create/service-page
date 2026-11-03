// v2 pages (docs/v2/05-SITE-SPEC.md §1, §3): Home B, Process, Partnership, Clients, Contact, standards, industries.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { AUDIENCES, FIGURES, HOME_HERO, PARTNERSHIP_CTA, SIX_STEPS, START_HERE } from "../src/content/v2/pages";
import * as pages from "../src/content/v2/pages";
import { getServiceById } from "../src/content/v2/catalogue";
import { INDUSTRIES } from "../src/content/v2/industries";
import { getPortfolioBySlug } from "../src/content/portfolio/data";

const read = (p: string) => fs.readFileSync(p, "utf8");
const code = (p: string) => read(p).replace(/\/\/.*$/gm, "").replace(/\{\/\*[\s\S]*?\*\/\}/g, ""); // without comments

test("home: the approved Direction B hero, tower on every screen, figures without dates", () => {
  assert.equal(HOME_HERO.title, "One accountable partner for setting up, running and growing your organisation, in Nigeria and across borders.");
  const home = read("src/app/page.tsx");
  assert.match(home, /<TowerMark height=\{116\} rule/);
  assert.match(home, /<HeroSkyline/);
  assert.match(home, /Registration record/);
  for (const f of FIGURES) assert.doesNotMatch(f.label, /as at|20\d\d/i);
  assert.equal(START_HERE.length, 8); // 7 audiences plus the Service Finder
});

test("home on mobile: condensed, nothing removed (carousels, <details>, 2x2 figures)", () => {
  const home = read("src/app/page.tsx");
  assert.equal((home.match(/className="snap-row/g) ?? []).length, 3); // steps, case studies, guides
  assert.equal((home.match(/<details className/g) ?? []).length, 2); // registration record, what partners receive
  assert.match(home, /grid-cols-2[^"]*md:grid-cols-4/);
  assert.match(home, /tabIndex=\{0\}/);
});

test("process: the six steps from Drive '02 How Work Runs'", () => {
  assert.deepEqual(SIX_STEPS.map((s) => s.title), ["Enquiry", "Understand the need", "Propose", "Agree", "Deliver", "Hand over and close"]);
});

test("clients: four audience pages with the spec's primary button, real services and a real case study", () => {
  const expected: Record<string, string> = { "founders-and-smes": "book", "growing-companies": "partnership", "ngos-and-institutions": "book", "doing-business-in-nigeria": "proposal" };
  assert.deepEqual(Object.fromEntries(AUDIENCES.map((a) => [a.slug, a.action])), expected);
  for (const a of AUDIENCES) {
    for (const id of a.services) assert.ok(getServiceById(id), `${a.slug}: ${id}`);
    assert.ok(getPortfolioBySlug(a.caseStudy), `${a.slug}: ${a.caseStudy}`);
  }
  assert.ok(START_HERE.some((s) => s.href === "/partnership/remote-operations"));
  assert.equal(PARTNERSHIP_CTA, "/contact?topic=partnership");
});

test("industries: 15 v1 pages merged into 6, and every v1 URL redirects", () => {
  assert.equal(INDUSTRIES.length, 6);
  assert.equal(INDUSTRIES.reduce((n, i) => n + i.includes.length, 0), 15);
  const live = read("public/_redirects");
  for (const line of read("docs/v2/04-_redirects.txt").split(/\r?\n/).filter((l) => l.startsWith("/"))) assert.ok(live.includes(line), line);
  for (const i of INDUSTRIES) assert.ok(i.needs.length > 0 && i.regulators.length > 0, i.slug);
});

test("contact: hours as text, no open-now indicator, the response promise", () => {
  const contact = code("src/app/contact/page.tsx");
  assert.match(contact, /SITE\.hours/);
  assert.doesNotMatch(contact, /open now|opens monday/i);
  assert.match(contact, /SITE\.responsePromise/);
});

test("copy: no fees, prices or delivery timelines in the drafted page copy", () => {
  const text = JSON.stringify(pages, (k, v) => (k === "caseStudy" ? undefined : v)); // slugs carry client names
  assert.doesNotMatch(text, /₦|\bNGN\b|\$\s?\d|\bwithin\s+\d+\s*(working\s+)?(days?|weeks?|months?)\b|\b\d+\s*(working\s+)?(days?|weeks?)\b/i);
  assert.doesNotMatch(text, /\b(unlock|empower|seamless|leverage|cutting-edge|robust|holistic|journey|elevate)/i);
  assert.doesNotMatch(text, /\blegal\b|\blaw firm|lawyer|litigation/i);
});

test("every page the navigation and footer link to now exists", () => {
  for (const p of ["process", "partnership", "partnership/remote-operations", "clients", "clients/[audience]", "contact/proposal", "about/standards", "accessibility", "search"]) {
    assert.ok(fs.existsSync(`src/app/${p}/page.tsx`), p);
  }
});
