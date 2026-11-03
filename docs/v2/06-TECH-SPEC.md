# SCS Website v2: technical specification (Cloudflare)

The base is GitHub `scs-create/service-page`, branch `main` (commit 821353f, 19 October 2026). Do all work on branch `v2` in small PRs. **Production stays untouched until the owner signs off the preview.** Before building, confirm current Cloudflare, Resend, Next.js and OpenNext limits and behaviour against their official documentation.

## 1. Architecture

```
Browser ──► Cloudflare (DNS + Workers)
             ├─ Static Assets  ← Next.js static export (out/)   HTML, CSS, JS, images, sitemap, rss, search-index
             └─ Worker (src/worker.ts), runs only for:
                 /api/forms/:form   POST  Turnstile → rate limit → zod → D1 insert → R2 (CVs) → emails
                 /api/auth, /api/callback   Decap CMS GitHub OAuth
                 /ingest/*          PostHog EU reverse proxy (consent still required)
                 /admin/submissions read-only view, behind Cloudflare Access
             Cron Trigger (daily): retention purge, then a rebuild trigger for future-dated posts (via GitHub Actions schedule)
Bindings: D1 (DB), R2 (CV_BUCKET), RATE_LIMITER, SEND_EMAIL (Email Routing, internal only), secrets
```

- Use **Next.js `output: "export"`**, with `trailingSlash: false` and `images.unoptimized: true`. Do not use OpenNext unless a feature truly needs server rendering; if one does, justify it in the PR.
- Static export consequences:
  - Pre-optimise images at build time (sharp) to AVIF/WebP with explicit width and height.
  - Move the `next.config` redirects to `public/_redirects` (copy from `04-_redirects.txt`).
  - Put security headers in `public/_headers`.
  - Generate the sitemap, RSS and search index as static files.
- `wrangler.jsonc`: `assets.directory = "./out"` and `assets.run_worker_first = ["/api/*", "/ingest/*", "/admin/*"]`, so every other request is served as a static asset without running the Worker.
- Remove Netlify-specific pieces (Netlify Forms `__forms.html`, `netlify/` functions, `netlify.toml`, Plausible remnants) only after their replacements work on the preview.

## 2. D1 schema (`migrations/0001_init.sql`)

```sql
CREATE TABLE submissions (
  id TEXT PRIMARY KEY,                 -- uuid
  ref TEXT UNIQUE NOT NULL,            -- e.g. SCS-2611-7F3K (human reference)
  form TEXT NOT NULL,                  -- enquiry | proposal | partnership | training | career | expert
  request_type TEXT,
  service_id TEXT,                     -- from 03-services.v2.json
  audience TEXT,
  fields TEXT NOT NULL,                -- JSON
  consent INTEGER NOT NULL,            -- 1
  consent_at TEXT NOT NULL,            -- ISO 8601
  utm_source TEXT, utm_medium TEXT, utm_campaign TEXT, utm_term TEXT, utm_content TEXT,
  posthog_id TEXT,                     -- only when analytics consent given
  cv_key TEXT,                         -- R2 object key (careers only)
  status TEXT NOT NULL DEFAULT 'new',  -- new | reviewed | replied | closed
  created_at TEXT NOT NULL
);
CREATE INDEX idx_sub_created ON submissions(created_at);
CREATE INDEX idx_sub_form ON submissions(form);
```

## 3. Forms endpoint: `POST /api/forms/:form`

1. Accept `application/json`, or `multipart/form-data` for careers, with a body size limit of 3.5 MB for careers and 32 KB otherwise.
2. Reject the submission (with a silent success response) if the honeypot field is filled.
3. Verify Turnstile server-side against `https://challenges.cloudflare.com/turnstile/v0/siteverify` with `TURNSTILE_SECRET`, using the managed widget on form pages only.
4. Apply the `RATE_LIMITER` binding, keyed on `cf-connecting-ip` + form, at about 5 requests per 60 s.
5. Validate with **zod**, one schema per form, with the fewest fields:
   - **Enquiry:** name, email, organisation (optional), topic (one of the 7 cluster names, SCS Partnership, Training or Something else), message, consent.
   - **Proposal:** organisation, contact name, email, country, service(s), brief, optional brief upload (PDF, 3 MB or less, stored in R2), consent.
   - **Career:** name, email, role, CV (PDF/DOCX, 3 MB or less: check the magic bytes and the extension), consent.
6. Insert the record into D1 and generate the `ref`.
7. Store any CV in the **private** R2 bucket under `cv/<yyyy>/<ref>.<ext>`. Staff open it only through a short-lived signed URL (15 minutes) from the admin view.
8. Send the **internal notification** with the Email Routing `send_email` binding, to a verified address: sales@ for enquiries and proposals, contact@ for careers. Include the ref and the fields, never the CV file itself.
9. Send the **visitor confirmation** with **Resend** from `contact@stephencorporateservices-scs.com`, over the sending subdomain (§5). Include the ref, "We respond within 24 hours.", the What-happens-next steps and the Discovery Call link.
10. Respond with `{ ok, ref, nextStep }`. The page then shows the success panel (05-SITE-SPEC §3 F).

Errors return a plain message and keep the user's input. Never log personal data to the console.

## 4. Retention (Cron Trigger, daily 02:00 WAT)

- Delete `submissions` older than **6 months**, together with their R2 objects (enquiries, proposals and careers alike, per the owner's decision).
- Log only counts.
- Update the Privacy notice to state 6 months.

## 5. Email DNS (do not touch Google Workspace)

- Keep the root domain's Google Workspace MX, SPF (`include:_spf.google.com`), DKIM and DMARC exactly as they are.
- Verify Resend on a **sending subdomain**, for example `send.stephencorporateservices-scs.com`, and add only the records Resend generates for that subdomain (DKIM, the return-path MX and its SPF).
- DMARC at the root: keep the existing record. If none exists, add `v=DMARC1; p=none; rua=mailto:<owner inbox>` and move to `quarantine` after 2–4 weeks of clean reports. Use relaxed alignment (`adkim=r; aspf=r`) so the subdomain's DKIM aligns.
- Cloudflare Email Routing `send_email` needs Email Routing enabled with verified destinations. If enabling it would change the root MX, **do not enable it**. Send internal notifications through Resend instead, and note the choice in the PR.

## 6. Staff access to submissions

The recommendation is a read-only view at `/admin/submissions` inside the same Worker, protected by **Cloudflare Access** and limited to named Google Workspace accounts that the owner supplies.

- It lists recent submissions, filters by form and status, lets staff change the status, and links each CV through a signed URL.
- Reason: the data stays in one place, nothing is copied into spreadsheets, and least-privilege access is enforced at the edge.
- Optional later: a nightly sync of non-sensitive lead fields (ref, form, service_id, audience, UTM, created_at) into the "SCS PostHog Data Warehouse" leads sheet.

## 7. CMS (Decap)

- Implement `/api/auth` and `/api/callback` in the Worker against a **GitHub OAuth App** (callback `https://stephencorporateservices-scs.com/api/callback`). Keep `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` as Worker secrets.
- Update `public/admin/config.yml` `backend.base_url` to point to the site and `auth_endpoint` to `api/auth`.
- Add the CMS collection for `03-services.v2.json` content once it is moved into `src/content/services-v2/`.
- Put `/admin/` (the CMS) behind Cloudflare Access too.

## 8. Security headers (`public/_headers`)

- `Content-Security-Policy: default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src 'self' https://challenges.cloudflare.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`
  - PostHog goes through `/ingest` on the same origin. If the PostHog script must load from its CDN, add only that host.
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`, after the cutover is stable.
- `X-Content-Type-Options: nosniff` · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- Cache: send HTML with `Cache-Control: public, max-age=0, must-revalidate`, and `/_next/static/*` plus hashed assets with `public, max-age=31536000, immutable`.

## 9. Performance budgets (mobile, slow 4G, p75)

| Measure | Budget |
| --- | --- |
| LCP | Under 2.0 s |
| INP | Under 200 ms |
| CLS | Under 0.05 |
| Home page weight | Under 500 KB transferred |
| Home JavaScript | Under 100 KB |
| Lighthouse | 95 or higher in every category |

Self-hosted, subset fonts (Inter and Source Serif 4) with `font-display: swap` and a preload for the H1 face. Load no third-party scripts except PostHog after consent, Turnstile on form pages and the Cal.com link-out. The tower is inline SVG with no image request.

## 10. CI/CD (GitHub Actions)

- On PR: `npm ci` → lint → typecheck → test → `npm audit --audit-level=high` → build → banned-word check → legal-word report → `[OWNER TO CONFIRM]` check (fails only in a production build) → `wrangler versions upload`, posting the preview URL as a PR comment.
- In the preview, the placeholder and prototype flags are on; in production they are off.
- On merge to `main` (after cutover): build, then `wrangler deploy`.
- A daily schedule rebuilds and deploys, so future-dated posts publish (this replaces the Netlify scheduled build).
- Rollback: `wrangler rollback`, or redeploy the previous version from the Cloudflare dashboard. Document both in `docs/DEPLOYMENT.md`.
- Secrets in GitHub: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Worker secrets: `TURNSTILE_SECRET`, `RESEND_API_KEY`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `POSTHOG_KEY` if needed.

## 11. DNS cutover (only after the owner signs off the preview)

1. Lower the TTL on the apex and www records 24 hours ahead.
2. Attach the custom domains `stephencorporateservices-scs.com` and `www.stephencorporateservices-scs.com` to the Worker. Add a redirect rule from www to the apex (301, keeping the path and query).
3. Leave every MX, TXT (SPF, DKIM, DMARC, verification) and Google record untouched. Before and after, export the DNS zone and diff it to prove that only the apex and www records changed.
4. Smoke test: every page in the sitemap returns 200; every rule in `_redirects` returns 301 to the correct target; every form works end to end; both emails arrive; the Workspace mailbox still receives mail.
5. Submit the sitemap in Google Search Console and Bing Webmaster Tools.
6. Rollback: re-point the apex and www to the previous Netlify target (record its values in the checklist before step 2).
7. Decommission the Netlify site after **7 days** of stable operation.

## 12. QA before sign-off

- Lighthouse on every template (Home, Hub, Service, Audience, Partnership, Case study, Guide, Tool, Form, Policy).
- Accessibility: keyboard only, a screen reader (NVDA or VoiceOver) and contrast checks.
- Checks: links, 404, redirects; forms end to end (Turnstile, D1, R2, both emails, success panel, vCard, retention job dry-run); analytics events and consent; JSON-LD validation.
- Grep for the old phone number `906 403 5713` and for "Benhen". Both must return 0 matches.
- Confirm the full company name appears in the header, footer, titles and JSON-LD.
