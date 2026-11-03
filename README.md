# Stephen Corporate Services - SCS Ltd: website

Next.js 16 static export · TypeScript · Tailwind v4 · Cloudflare Workers (Static Assets, D1, R2) · Decap CMS
(self-hosted, pinned) · Resend · Cloudflare Turnstile · PostHog Cloud EU (consent-gated, proxied through `/ingest`).

| You want to… | Read |
| --- | --- |
| Deploy, cut over or roll back | `docs/DEPLOYMENT.md` |
| Edit pages, services or guides (staff) | `docs/CONTENT-EDITING.md` |
| Handle form submissions, CVs and data requests (staff) | `docs/FORMS-AND-SUBMISSIONS.md` |
| Run the site on your own PC | `docs/v2/LOCAL-TESTING.md` |
| Understand the decisions and the spec | `docs/v2/00-README.md`, `02-DECISIONS.md` (top precedence), `05-SITE-SPEC.md`, `06-TECH-SPEC.md` |
| See the latest QA results | `docs/v2/QA-REPORT.md` |

```
npm ci
npm run lint && npm run typecheck && npm test
npm run build && npm run check:site
npx wrangler dev                     # http://localhost:8787
node scripts/smoke.mjs http://localhost:8787
```

## How it fits together

- **Pages** are built once into `out/` and served by Cloudflare as static files, with `public/_headers` (security
  headers, caching) and `public/_redirects` (the 41 permanent redirects from v1 addresses).
- **The Worker** (`worker/index.ts`) runs only for:
  - `/api/forms/:form`: Turnstile → rate limit → validation → D1 → R2 → two emails;
  - `/api/auth` and `/api/callback`: CMS sign-in with GitHub;
  - `/ingest`: the PostHog EU proxy;
  - `/admin`: Cloudflare Access, then the CMS and `/admin/submissions`.

  A nightly cron deletes submissions and files older than six months.
- **Deploys** come from GitHub Actions (`.github/workflows/deploy.yml`):
  - before cutover, a noindex review build on `workers.dev`;
  - after it, production on every push to `main`, plus daily, so future-dated posts publish.

## Rules for anyone changing the site

- The name is always **Stephen Corporate Services - SCS Ltd**. The phone number is **+234 812 813 8222**. No fees,
  prices or delivery timelines. Response wording is exactly "We respond within 24 hours.", with no "open now"
  indicator.
- `check:site` (run in every workflow) fails a production build on:
  - banned words;
  - `[OWNER TO CONFIRM]`;
  - the old phone number or "Benhen";
  - a broken internal link or redirect target;
  - a missing or duplicate title or description;
  - a missing production Turnstile key.
- No personal data ever goes to analytics. Only the properties in `ALLOWED_PROPS` (`src/lib/track.ts`) are sent.
- No secrets in the repository. They live in GitHub secrets and Cloudflare Worker secrets (`docs/DEPLOYMENT.md` §3).
- Design tokens are only in `src/app/globals.css` (logo blue, navy, gold; gold is never text on white). The tower
  mark is the exact logo vector and is never redrawn.

## Where content lives

| Content | Where |
| --- | --- |
| Business details | `src/lib/site.ts` |
| Services (66, in 7 areas) | `src/content/v2/services.v2.json` (names, paths) and `src/content/v2/services/<ID>.json` (page copy) |
| Area introductions | `src/content/v2/clusters.json` |
| Audience, process and partnership pages | `src/content/v2/pages.ts` |
| Industries | `src/content/v2/industries.ts` |
| Topic hubs | `src/content/v2/topics.ts` |
| Corporate School guides | `src/content/corporate-school/*.md` (a future `date` means scheduled) |
| Case studies, FAQs, tools | `src/content/*/` |
| Legal pages | `src/content/legal/*.json` (edited in the repository, not in the CMS; effective 3 December 2025) |
