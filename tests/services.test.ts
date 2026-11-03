// v2 services (docs/v2/02-DECISIONS.md §5, 05-SITE-SPEC.md §3): 66 services, 7 clusters, draft copy, no fees, no timelines.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { CLUSTERS, SERVICES, servicesInCluster, v2LinkForV1 } from "../src/content/v2/catalogue";
import v1Links from "../src/content/v2/v1-links.json";
import hubs from "../src/content/v2/clusters.json";

test("catalogue: 66 services in 7 clusters, the copy in src/ matches the build pack", () => {
  assert.equal(SERVICES.length, 66);
  assert.equal(CLUSTERS.length, 7);
  assert.deepEqual(JSON.parse(fs.readFileSync("src/content/v2/services.v2.json", "utf8")), JSON.parse(fs.readFileSync("docs/v2/03-services.v2.json", "utf8")));
  for (const c of CLUSTERS) assert.ok(servicesInCluster(c.slug).length > 0, c.slug);
});

test("paths: /services/<cluster>/<service>, unique", () => {
  const paths = SERVICES.map((s) => s.path);
  assert.equal(new Set(paths).size, paths.length);
  for (const s of SERVICES) assert.equal(s.path, `/services/${s.cluster}/${s.slug}`);
});

test("copy: every service has its page copy, marked draft until the owner approves", () => {
  for (const s of SERVICES) {
    assert.equal(s.copy.benefits.length, 3, s.id);
    assert.ok(s.copy.whatYouReceive.length > 0 || s.copy.v1Retained, s.id);
    assert.ok(["draft", "approved"].includes(s.copy.status), s.id);
  }
  for (const c of CLUSTERS) assert.ok((hubs.clusters as Record<string, { covers: string }>)[c.slug]?.covers, c.slug);
});

test("copy: the five v1-wording services keep their v1 service lines (owner decision 4)", () => {
  const retained = SERVICES.filter((s) => s.copy.v1Retained).map((s) => s.id).sort();
  assert.deepEqual(retained, ["CR-07", "CS-07", "FA-08", "HO-09", "SA-11"]);
  for (const s of SERVICES) assert.doesNotMatch(s.summary, /v1 wording retained/, s.id);
});

test("copy: no fees, no prices and no delivery timelines in any drafted service text", () => {
  const money = /₦|\bNGN\b|\$\s?\d|\b\d[\d,]*\s?(naira|dollars?)\b|\bfrom\s+\d/i;
  const timeline = /\bwithin\s+\d+|\b\d+\s*(working\s+)?(days?|weeks?|months?|hours?)\b|same[- ]day|next[- ]day/i;
  const banned = /\b(unlock|empower|seamless|leverage|cutting-edge|robust|holistic|journey|elevate)/i;
  for (const s of SERVICES) {
    const { v1Retained, ...drafted } = s.copy; // v1 lines are kept as v1 by owner decision
    void v1Retained;
    const text = JSON.stringify(drafted) + s.summary;
    assert.doesNotMatch(text, money, s.id);
    assert.doesNotMatch(text, timeline, s.id);
    assert.doesNotMatch(text, banned, s.id);
  }
});

test("redirects: the v1 link table equals the 301s, and every service rule is live", () => {
  const csv = fs.readFileSync("docs/v2/04-redirects.csv", "utf8").split(/\r?\n/).slice(1).filter(Boolean).map((l) => l.split(","));
  const fromCsv = Object.fromEntries(
    csv.filter(([from]) => from.startsWith("/services/") && !from.includes("legal-partnership")).map(([from, to]) => [from.slice(10), to])
  );
  assert.deepEqual(v1Links.links, fromCsv);
  const live = fs.readFileSync("public/_redirects", "utf8");
  for (const line of fs.readFileSync("docs/v2/04-_redirects.txt", "utf8").split(/\r?\n/).filter((l) => l.startsWith("/services/"))) {
    assert.ok(live.includes(line), line);
  }
  assert.equal(v2LinkForV1("tax-accounting-and-financial-business-support")?.label, "Finance & Accounting");
  assert.equal(v2LinkForV1("recruitment-and-talent-solutions")?.href, "/services/hr-and-operations/recruitment");
});

test("service finder: scores onto the 7 v2 clusters only", () => {
  const finder = JSON.parse(fs.readFileSync("src/content/tools/finder.json", "utf8"));
  const allowed = new Set([...CLUSTERS.map((c) => c.slug), ...Object.keys(finder.outcomes), "pkg-A", "pkg-B", "pkg-C", "pkg-D", "pkg-E", "pkg-F"]);
  for (const q of finder.questions) for (const o of q.options) for (const k of Object.keys(o.weights)) assert.ok(allowed.has(k), `${q.id}: ${k}`);
});
