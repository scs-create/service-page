# Stephen Corporate Services Ltd — Website

**Deploying? Follow `docs/DEPLOYMENT.md`.**

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Decap CMS (self-hosted, pinned) · Netlify (hosting + Forms) · Plausible (consent-gated).

```bash
npm install                 # also needed after pulling: prebuild copies the pinned CMS bundles + regenerates the forms skeleton
npm run dev                 # http://localhost:3000
npm run lint && npm run typecheck && npm test && npm run build
```

## Routes
`/` · `/services` (+21) · `/portfolio` (+16 case studies) · `/industries` (+12) · `/verification` · `/faq` · `/about` · `/contact` · `/career`
· `/corporate-college` · `/corporate-college/corporate-school` (+posts) · free tools: `/tools` `/assess` `/compliance-checklist` `/compliance-calendar` `/business-structure` `/find-my-service`
· `/terms` `/privacy` `/cookies` · `/admin` · `/rss.xml` `/sitemap.xml` `/search-index.json` · `/portal` (prototype, 404 in production; the real portal is phase two: `docs/CLIENT_PORTAL_PLAN.md`)
Inner pages show breadcrumbs (`Home > Section > Page`) with matching BreadcrumbList structured data.
`/academy/*` redirects (301) to `/corporate-college/*`.

## One-time Netlify setup
1. **Domain**: add `stephencorporateservices-scs.com` as primary, redirect `www`, enable HTTPS.
2. **Forms → Enable form detection**, redeploy. `public/__forms.html` is GENERATED from `src/lib/formFields.ts` on every build — never edit it by hand.
3. **Form notifications**: only two forms exist (below). Route them: `enquiry` → `sales@…`, `career-application` → `contact@…`.
4. **Environment variables**: see `.env.example`. Set `NEXT_PUBLIC_BOOKING_URL` to the Cal.com link (it is also the built-in default). Never set the two preview flags in production.
5. **Plausible**: create site `stephencorporateservices-scs.com`, then add these five custom-event goals: `CTA Click`, `Form Submit`, `Form Step`, `Tool Complete`, `Booking Click`.
6. **Scheduled posts**: add repo secret `NETLIFY_BUILD_HOOK_URL` (Netlify → Build hooks) so `.github/workflows/scheduled-build.yml` rebuilds daily.
7. Submit a test of every form type and confirm it appears under Forms.

## CMS login (Decap)
`/admin` uses Decap's **GitHub backend with Netlify's built-in OAuth** (Git Gateway / Netlify Identity are deprecated and are not used). Setup: `docs/DEPLOYMENT.md` step G. Editors need a GitHub account with write access to the repository. The CMS JavaScript is self-hosted and pinned (decap-cms 3.16.3), so `/admin` loads no third-party scripts.

## Booking
Every "Book" call to action (header "Book a Discovery Call", mobile dock "Book", home hero and closing band, services, service/industry/portfolio pages, FAQ, tool `noscript` fallbacks) opens the free Cal.com Discovery Call in a new tab ("↗") and sends a `Booking Click` event. "Discuss a package", "Ask about Partnership", "Request documents" and "Contact us" stay on the enquiry form (`/contact#enquiry`). Use `<CTAButton booking label="…" />` for new ones.

## Forms: two buckets
| Form | Use | Sorted by |
|---|---|---|
| `enquiry` | every lead | hidden `request_type`: `consultation`, `business-assessment`, `compliance-checklist`, `business-structure`, `find-my-service`, `compliance-reminders`, `training-request`, `growth-portfolio`, `newsletter` |
| `career-application` | staff / partner applications with CV, cover letter, proposal | `applying_as` |
Assessment submissions carry `assessment_score`, `assessment_band`, `assessment_gaps`, `assessment_answers` (JSON) for analysis. Export CSV from Netlify Forms.
Limits (field lengths, 3 MB per file) are client-side only. Confirm Netlify's spam filtering is on (Forms → Settings). Unsuccessful job applications must be deleted within 6 months (Privacy Notice).

## Email aliases (`src/lib/site.ts`)
`contact@` default public address · `sales@` consultations/leads · `info@` information, complaints, data-protection requests (until `privacy@` exists) · `accounts@` invoices · `admin@` INTERNAL ONLY (never shown).

## Preview vs production
Preview / branch deploys show the exact **client placeholders** (`docs/CLIENT_PLACEHOLDERS.md`) and the **portal prototype** (`/portal`, mock data, noindex, unlinked). Production hides both (the portal returns 404). To view them in production temporarily, set the two flags in `.env.example` — and remove them again.

## Legal pages
`src/content/legal/*.json` with `{{tokens}}` from `site.ts`. The final, lawyer-approved Terms of Service, Privacy Notice and Cookie Policy (supplied 18 October 2026, all dated 16 October 2026) are live and indexable. Any `[placeholder]` added later puts that page back into draft (notice, `noindex`, out of the sitemap). See `docs/legal-open-items.md`. To publish a new version, send the documents to the developer: legal pages are edited in the repository, not in `/admin`.

## Security notes
HTML from the CMS is sanitised (allowlist). Headers: `netlify.toml` sets nosniff, frame options, referrer, permissions, HSTS and a minimal CSP on every path (including `/admin`); `next.config.ts` adds the full CSP on every path except `/admin`: `default-src 'self'`, scripts and connections only to self and plausible.io, no frames or objects, `upgrade-insecure-requests`. Left loose on purpose: `script-src 'unsafe-inline'` (Next.js inlines hydration data and the site is static, so per-request nonces are impossible without dynamic rendering) and `style-src 'unsafe-inline'` (React style attributes). `/admin` keeps only the minimal policy because Decap needs api.github.com, api.netlify.com and GitHub-hosted images. HSTS is `max-age` only — enable `includeSubDomains`/`preload` only after every subdomain is confirmed HTTPS-only. CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, build and `npm audit`.

## Where content lives
Business details `src/lib/site.ts` · services/portfolio/industries/FAQs/IP/packages/testimonials/programmes `src/content/*/entries/` · regulators `src/content/regulators.json` · tools `src/content/tools/*.json` (assessment, calendar editable in CMS; checklist/structure/finder are JSON in the repo) · partnership `src/content/partnership.json` · about `src/content/about.ts` · leadership `src/content/leadership.ts` (photos in `public/images/team/`; never publish signatures) · blog `src/content/corporate-school/*.md` (future `date` = scheduled; the ten Corporate College articles were published 16 October 2026).
Design tokens: `src/app/globals.css` only (logo blue, navy, gold; gold is never text on white).
