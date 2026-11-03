// v2 analytics and SEO (docs/v2/05-SITE-SPEC.md §6–§7): the PostHog EU proxy, the event names, structured data.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { proxyIngest } from "../worker/ingest";

const read = (p: string) => fs.readFileSync(p, "utf8");

test("ingest: events go to eu.i.posthog.com without cookies or foreign credentials, with the visitor IP forwarded", async () => {
  let sent: Request | undefined;
  const fetcher = (async (r: string | URL | Request) => ((sent = r as Request), new Response("ok"))) as typeof fetch;
  const req = new Request("https://site.test/ingest/e/?ip=1&_=123", {
    method: "POST",
    headers: { cookie: "ph_secret=1; other=2", authorization: "Basic abc", "cf-connecting-ip": "203.0.113.9", "content-type": "application/json" },
    body: JSON.stringify({ event: "x" }),
  });
  await proxyIngest(req, undefined, fetcher);
  assert.equal(sent!.url, "https://eu.i.posthog.com/e/?ip=1&_=123");
  assert.equal(sent!.method, "POST");
  assert.equal(sent!.headers.get("cookie"), null);
  assert.equal(sent!.headers.get("authorization"), null);
  assert.equal(sent!.headers.get("x-forwarded-for"), "203.0.113.9");
  assert.equal(await sent!.text(), JSON.stringify({ event: "x" }));
});

test("ingest: a PostHog project key in Authorization is kept (the SDKs need it)", async () => {
  let sent: Request | undefined;
  const fetcher = (async (r: string | URL | Request) => ((sent = r as Request), new Response("ok"))) as typeof fetch;
  await proxyIngest(new Request("https://site.test/ingest/decide", { headers: { authorization: "Bearer phc_abc" } }), undefined, fetcher);
  assert.equal(sent!.headers.get("authorization"), "Bearer phc_abc");
});

test("ingest: static assets come from eu-assets.i.posthog.com and are cached at the edge", async () => {
  const urls: string[] = [];
  const store = new Map<string, Response>();
  const cache = { match: async (r: Request) => store.get(r.url)?.clone(), put: async (r: Request, res: Response) => void store.set(r.url, res) };
  const fetcher = (async (u: string | URL | Request) => (urls.push(String(u)), new Response("js", { status: 200 }))) as typeof fetch;
  const req = () => new Request("https://site.test/ingest/static/array.js");
  await proxyIngest(req(), undefined, fetcher, cache);
  await proxyIngest(req(), undefined, fetcher, cache);
  assert.deepEqual(urls, ["https://eu-assets.i.posthog.com/static/array.js"]); // second request served from cache
});

test("events: the v2 names from the spec, each able to carry service_id and audience", () => {
  const track = read("src/lib/track.ts");
  for (const e of ["cta_click", "booking_click", "form_step", "form_submit", "tool_complete", "whatsapp_click", "call_click", "partnership_cta", "post_submit_next_step"]) {
    assert.match(track, new RegExp(`\\| "${e}"`), e);
  }
  assert.match(track, /"service_id", "audience"/);
  for (const f of ["src/components/ui/TrackClicks.tsx", "src/lib/useFormAnalytics.ts", "src/components/sections/AssessmentTool.tsx"]) {
    assert.doesNotMatch(read(f), /"cta_clicked"|"form_submitted"|"form_step_completed"|"tool_completed"/, f);
  }
  assert.match(read("src/components/forms/SuccessPanel.tsx"), /data-location="form_success"/);
});

test("seo: Organization + ProfessionalService with RC, hours and contact point; Service, Article, FAQPage and breadcrumbs", () => {
  const layout = read("src/app/layout.tsx");
  assert.match(layout, /"@type": \["Organization", "ProfessionalService"\]/);
  for (const t of ["openingHoursSpecification", "contactPoint", "+234-812-813-8222", "legalName"]) assert.ok(layout.includes(t), t);
  assert.doesNotMatch(layout, /LegalService|Attorney/);
  assert.match(read("src/app/services/[cluster]/[service]/page.tsx"), /"@type": "Service"/);
  assert.match(read("src/app/corporate-college/corporate-school/[slug]/page.tsx"), /"@type": "Article"/);
  assert.match(read("src/app/faq/page.tsx"), /"@type": "FAQPage"/);
  assert.match(read("src/components/ui/Breadcrumbs.tsx"), /BreadcrumbList/);
});

test("seo: an Open Graph image per section, served as PNG", () => {
  for (const d of ["services", "clients", "process", "partnership", "portfolio", "industries", "about", "contact", "corporate-college/corporate-school"]) {
    assert.ok(fs.existsSync(`src/app/${d}/opengraph-image.tsx`), d);
  }
  assert.match(read("public/_headers"), /\/:section\/opengraph-image\n {2}Content-Type: image\/png/);
});
