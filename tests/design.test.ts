// v2 design system B: navigation, fonts, global elements (docs/v2/02-DECISIONS.md §4, 05-SITE-SPEC.md §2 and §4).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { CLUSTERS, PRIMARY_NAV, isActive } from "../src/lib/nav";

const read = (p: string) => fs.readFileSync(p, "utf-8");

test("nav: the seven items in the agreed order", () => {
  assert.deepEqual(PRIMARY_NAV.map((n) => n.label), ["Home", "Services", "Clients", "Process", "Partnership", "Insights", "About"]);
  const header = read("src/components/layout/Header.tsx");
  assert.match(header, /Request a proposal/);
  assert.match(header, /Book a Discovery Call/);
  assert.match(header, /border-accent/); // 2px gold underline on the active item
});

test("nav: the mega-menu shows the 7 clusters, 3 services each, most requested first", () => {
  assert.deepEqual(CLUSTERS.map((c) => c.name), [
    "Strategy & Advisory", "Company Formation & Secretarial", "Compliance & Regulatory", "Finance & Accounting",
    "HR & Operations", "Technology & Digital", "Marketing & Communications",
  ]);
  for (const c of CLUSTERS) assert.equal(c.top.length, 3, c.name);
  assert.equal(CLUSTERS[1].top[0].label, "Company registration");
});

test("nav: active state", () => {
  assert.equal(isActive("/", "/"), true);
  assert.equal(isActive("/about", "/"), false);
  assert.equal(isActive("/services/x", "/services"), true);
  assert.equal(isActive("/servicesx", "/services"), false);
});

test("fonts: Inter and Source Serif 4 are self-hosted by next/font, Latin + Latin Extended; serif only for H1/H2", () => {
  const layout = read("src/app/layout.tsx");
  assert.match(layout, /Source_Serif_4\(/);
  assert.equal((layout.match(/subsets: \["latin", "latin-ext"\]/g) ?? []).length, 2);
  assert.doesNotMatch(layout + read("src/app/globals.css"), /fonts\.googleapis\.com/);
  assert.match(read("src/app/globals.css"), /h1,\nh2 \{\n  font-family: var\(--font-serif\)/);
});

test("global elements: full name and RC in header and footer; mobile bar; no floating chat bubble", () => {
  for (const f of ["src/components/layout/Header.tsx", "src/components/layout/Footer.tsx"]) {
    const src = read(f);
    assert.match(src, /SITE\.titleName/, f);
    assert.match(src, /RC \{SITE\.rc\}/, f);
  }
  const bar = read("src/components/layout/MobileBar.tsx");
  for (const label of ["Call", "WhatsApp", "Book a call"]) assert.match(bar, new RegExp(String.raw`>\s*${label}`), label);
  assert.match(bar, /md:hidden/);
  assert.equal(fs.existsSync("src/components/layout/ContactDock.tsx"), false);
});

test("cookie banner: Accept and Reject are equally prominent", () => {
  const src = read("src/components/ui/CookieBanner.tsx");
  assert.match(src, /className=\{EQUAL\}>Accept analytics</);
  assert.match(src, /className=\{EQUAL\}>Reject analytics</);
});

test("tower: the exact logo vector is reused, never redrawn", () => {
  const mark = read("src/components/brand/TowerMark.tsx");
  assert.match(mark, /import HeroSkyline/);
  assert.doesNotMatch(mark, /<path/);
  assert.match(read("src/app/page.tsx"), /<TowerMark height=\{116\} rule/);
});

test("footer: the response promise word for word, and office hours as text (no open-now indicator)", () => {
  assert.match(read("src/lib/site.ts"), /responsePromise: "We respond within 24 hours\."/);
  assert.doesNotMatch(read("src/components/layout/Footer.tsx"), /open now/i);
});
