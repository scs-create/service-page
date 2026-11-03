# Deploying the SCS website (v2, Cloudflare Workers)

The site is a static Next.js export served by Cloudflare Workers Static Assets. A small Worker (`worker/`) handles
the forms, the CMS sign-in, the PostHog proxy and `/admin`. Architecture: `docs/v2/06-TECH-SPEC.md`.

**Rules that never change:** no secret is ever pasted into a chat, an issue or a file in this repository. The
production domain, the Netlify site and the Google Workspace email records (MX, SPF, DKIM, DMARC) stay untouched
until the owner writes **"Approved for cutover"**. Never force-push. HSTS preload is never switched on.

## 1. Where things run

| What | Where |
| --- | --- |
| Code | GitHub `scs-create/service-page`. v2 lives on the `v2-pr*` branches until cutover, then on `main` |
| Site and Worker | Cloudflare → Workers & Pages → **scs-website** |
| Form submissions | Cloudflare D1 database **scs-forms** (6-month retention, deleted automatically each night) |
| CVs and proposal briefs | Cloudflare R2 bucket **scs-forms-uploads** (private) |
| Emails | Resend, from `contact@send.stephencorporateservices-scs.com`; replies go to `contact@stephencorporateservices-scs.com` |
| Analytics | PostHog Cloud EU, project 310194, after the visitor accepts (`docs/v2/ANALYTICS-AND-SEO.md`) |

## 2. The workflows (GitHub → Actions)

| Workflow | When it runs | What it does |
| --- | --- | --- |
| **Deploy** (`deploy.yml`) | Before cutover: every push to a `v2` / `v2-pr*` branch. After cutover: every push to `main`, daily at 05:00 UTC, and the **Run workflow** button | Lint, typecheck, tests, build, `check:site`, database migrations, then `wrangler deploy`. Before cutover the build is a noindex review build on the `workers.dev` address. After cutover it's the production build. The run summary shows the address and how to roll back |
| **v2** (`v2.yml`) | Pull requests into `v2` | The same checks, then a preview version with its own address, posted on the pull request |
| **v2 provision** (`v2-provision.yml`) | By hand, once | Creates the D1 database and the R2 bucket. Done on 3 November 2026; re-running is harmless |
| **CI** (`ci.yml`) | Pushes and pull requests on `main` | The same checks, without deploying |

The repository variable **`SITE_LIVE`** (GitHub → Settings → Secrets and variables → Actions → Variables) switches
Deploy from review builds to production builds. It's set to `true` on cutover day (§4, step 6) and never before.

The daily run publishes Corporate School posts whose date has arrived. A post dated in the future stays hidden until
the first build on or after that day. It replaces the v1 Netlify build hook.

## 3. Settings

**GitHub secrets** (Settings → Secrets and variables → Actions): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

**Worker secrets** (Cloudflare → Workers & Pages → scs-website → Settings → Variables and Secrets → Add →
type *Secret*):

| Secret | What it's for | Owner checklist |
| --- | --- | --- |
| `TURNSTILE_SECRET` | The form security check | Step 6 |
| `RESEND_API_KEY` | Sending the two emails | Steps 7–8 |
| `FILE_LINK_SECRET` | Signed download links in the submissions view (any long random text) | `docs/v2/ADMIN-ACCESS-SETUP.md` |
| `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` | Cloudflare Access in front of `/admin` | Step 11 |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | CMS sign-in | Step 12 |
| `ADMIN_USER`, `ADMIN_PASSWORD` | Fallback `/admin` password, only until Access is on | — |

Until a secret is set, the part that needs it stays closed: forms answer "not available right now", and `/admin`
shows "locked". Nothing breaks open.

The Turnstile **site key** is public. It's written in the workflows (`0x4AAAAAAFyc6LyJDNgcCfFV`), and a repository
variable `TURNSTILE_SITE_KEY` overrides it. The Turnstile widget's hostnames must include every address the forms run
on: `stephencorporateservices-scs.com` and the `workers.dev` review address (Turnstile → SCS forms → Hostnames).

## 4. Cutover (only after "Approved for cutover")

Do these steps in this order, on a weekday morning, with the owner reachable.

**The day before**

1. In Cloudflare → DNS, note the current apex and `www` records (type, value) in owner checklist step 17. These are
   the rollback values. Lower their TTL to 5 minutes. Don't touch any other record.
2. Export the zone: DNS → Records → Import and Export → **Export**. Save it as `dns-before.txt` outside the repository.

**Cutover**

3. Merge v2 into `main`: open a pull request from the last v2 branch into `main`, check that it's green, and merge
   it (merge commit, no force-push). The Netlify build that this triggers changes nothing visible, because the domain
   still points at Netlify.
4. Remove the v1 workflow `scheduled-build.yml` and the `NETLIFY_BUILD_HOOK_URL` secret, if they're still there.
5. Cloudflare → Workers & Pages → scs-website → Settings → Domains & Routes → **Add → Custom domain**:
   `stephencorporateservices-scs.com`, then `www.stephencorporateservices-scs.com`. Cloudflare replaces the apex and
   `www` records itself.
6. GitHub → Settings → Secrets and variables → Actions → Variables → **New variable** `SITE_LIVE` = `true`. Then
   Actions → **Deploy** → **Run workflow** on `main`. This deploys the production build: indexable, with no
   placeholders and no prototype.
7. Cloudflare → Rules → Redirect Rules → **Create**: when the hostname equals `www.stephencorporateservices-scs.com`,
   redirect dynamically to `concat("https://stephencorporateservices-scs.com", http.request.uri.path)`, status 301,
   keeping the query string.
8. Export the zone again as `dns-after.txt`, then run:

   ```
   node scripts/dns-diff.mjs dns-before.txt dns-after.txt
   ```

   It must end with `dns-diff: OK`. If it prints **STOP**, a record other than the apex or `www` changed: put it back
   from `dns-before.txt` at once.

**Smoke test (the same hour)**

9. Run `node scripts/smoke.mjs https://stephencorporateservices-scs.com`. It checks every sitemap page (200), all 41
   redirects (301 to the right page), the 404 page, the security headers and that `/admin` isn't open. It must end
   with `smoke: OK`.
10. By hand:
    - send one of each form (enquiry, proposal with a PDF, career with a CV, expert);
    - check that both emails arrive for each: the team notification at sales@ or contact@, and the visitor confirmation;
    - check the entries in `/admin/submissions`, and open one file link;
    - send an ordinary email to `contact@` from outside: Google Workspace must still receive it.
11. Check `https://www.stephencorporateservices-scs.com/services?x=1` goes to the apex with the path and query kept.
12. Submit the sitemap in Google Search Console and Bing (owner checklist step 18, `docs/v2/ANALYTICS-AND-SEO.md`).

**After**

13. Watch Cloudflare → scs-website → Metrics and Logs, and PostHog, for 7 days.
14. After **7 days** of stable operation, delete the Netlify site (owner checklist step 19).
15. Raise the TTL back to Auto. Switch on HSTS (`max-age=63072000; includeSubDomains`, without preload) only once
    the 7 days have passed.

## 5. Rollback

| Problem | What to do |
| --- | --- |
| A bad deploy (wrong content, a broken page) | Cloudflare → Workers & Pages → scs-website → **Deployments** → choose the previous version → **Rollback**. Or, with the API token set in your terminal: `npx wrangler rollback` (the previous version) or `npx wrangler rollback <version-id>`. Then fix the code with `git revert` and push |
| The new site itself fails on cutover day | Remove the two custom domains from the Worker (Settings → Domains & Routes), then put the apex and `www` records back to the values from step 1. The Netlify site is still there for 7 days, so v1 is back within the TTL (5 minutes). Set `SITE_LIVE` back to `false` |
| Email stopped arriving at the Workspace mailbox | Compare against `dns-before.txt` with `scripts/dns-diff.mjs`, and restore any MX, SPF, DKIM or DMARC record that changed. Never edit those records for the website |
| Forms fail | Check Cloudflare → scs-website → Logs. The usual causes are a missing secret (§3), the Turnstile hostname list, or Resend's domain not being verified. Visitors always see the phone number, WhatsApp and email as alternatives |

## 6. Working on the code

```
npm ci
npm run lint && npm run typecheck && npm test
npm run build && npm run check:site
npx wrangler dev          # the built site at http://localhost:8787, the same runtime as Cloudflare
node scripts/smoke.mjs http://localhost:8787
```

Running the site on your own PC, with local test keys: `docs/v2/LOCAL-TESTING.md`.
