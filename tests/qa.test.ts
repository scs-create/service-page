// v2 QA and deploys (docs/v2/06-TECH-SPEC.md §10–§12): the deploy workflow's guards, the cutover DNS check.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { diff } from "../scripts/dns-diff.mjs";

const read = (p: string) => fs.readFileSync(p, "utf8");

const BEFORE = `;; Exported from Cloudflare
stephencorporateservices-scs.com.	300	IN	SOA	ns.cloudflare.com. dns.cloudflare.com. 1 10000 2400 604800 300
stephencorporateservices-scs.com.	3600	IN	A	75.2.60.5
www.stephencorporateservices-scs.com.	3600	IN	CNAME	scs.netlify.app.
stephencorporateservices-scs.com.	3600	IN	MX	1 smtp.google.com.
stephencorporateservices-scs.com.	3600	IN	TXT	"v=spf1 include:_spf.google.com ~all"
_dmarc.stephencorporateservices-scs.com.	3600	IN	TXT	"v=DMARC1; p=none"
`;

test("dns-diff: only the apex and www address records may change; TTL changes are ignored", () => {
  const after = BEFORE.replace("75.2.60.5", "104.21.0.1").replace("CNAME	scs.netlify.app.", "AAAA	100::").replace(/3600/g, "300");
  const ok = diff(BEFORE, after);
  assert.equal(ok.unexpected.length, 0);
  assert.equal(ok.added.length, 2);
  const broken = diff(BEFORE, after.replace(/^.*MX.*$/m, ""));
  assert.deepEqual(broken.unexpected, ["stephencorporateservices-scs.com. MX 1 smtp.google.com."]);
  assert.equal(diff(BEFORE, BEFORE.replace("p=none", "p=reject")).unexpected.length, 2);
});

test("deploy: review builds only before cutover, production only from main after it, never a custom domain in code", () => {
  const wf = read(".github/workflows/deploy.yml");
  assert.match(wf, /vars\.SITE_LIVE != 'true' && github\.ref_name != 'main'/);
  assert.match(wf, /vars\.SITE_LIVE == 'true' && github\.ref_name == 'main'/);
  assert.match(wf, /NEXT_PUBLIC_SITE_ENV: \$\{\{ vars\.SITE_LIVE == 'true' && 'production' \|\| 'preview' \}\}/);
  assert.match(wf, /cron: "0 5 \* \* \*"/); // daily rebuild replaces the Netlify build hook
  assert.match(wf, /npm run check:site/);
  const wrangler = read("wrangler.jsonc");
  assert.doesNotMatch(wrangler, /"routes"|custom_domain/); // the domain is attached by hand on cutover day
  assert.doesNotMatch(wrangler, /00000000-0000-0000-0000-000000000000/); // the provisioned D1 id is set
});

test("docs: deployment, cutover and rollback, staff guides, QA report", () => {
  const dep = read("docs/DEPLOYMENT.md");
  for (const t of ["Approved for cutover", "wrangler rollback", "dns-diff.mjs", "smoke.mjs", "SITE_LIVE", "7 days"]) assert.ok(dep.includes(t), t);
  assert.doesNotMatch(dep, /netlify\.toml|Netlify →/); // Netlify appears only as the v1 site being retired
  for (const f of ["docs/CONTENT-EDITING.md", "docs/FORMS-AND-SUBMISSIONS.md", "docs/v2/QA-REPORT.md"]) assert.ok(fs.existsSync(f), f);
  assert.doesNotMatch(read("README.md"), /Netlify \(hosting/);
});
