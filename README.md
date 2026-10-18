# Stephen Corporate Services Ltd — Website

**Deploying? Follow `docs/DEPLOYMENT.md`.**

Next.js 16 (App Router) · TypeScript · Tailwind v4 · Decap CMS (self-hosted, pinned) · Netlify (hosting + Forms) · PostHog Cloud EU (consent-gated, proxied through `/ingest`).

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
5. **PostHog**: see `docs/DEPLOYMENT.md` step H and the Analytics section below.
6. **Scheduled posts**: add repo secret `NETLIFY_BUILD_HOOK_URL` (Netlify → Build hooks) so `.github/workflows/scheduled-build.yml` rebuilds daily.
7. Submit a test of every form type and confirm it appears under Forms.

## CMS login (Decap)
`/admin` uses Decap's **GitHub backend with Netlify's built-in OAuth** (Git Gateway / Netlify Identity are deprecated and are not used). Setup: `docs/DEPLOYMENT.md` step G. Editors need a GitHub account with write access to the repository. **Before that, `/admin` asks for a username and password** (browser prompt) checked by `netlify/edge-functions/admin-auth.ts` against the Netlify environment variables `ADMIN_USER` and `ADMIN_PASSWORD` (never stored in the repo). If they are not set, `/admin` stays locked. The CMS JavaScript is self-hosted and pinned (decap-cms 3.16.3), so `/admin` loads no third-party scripts.

## Booking
Every "Book" call to action (header "Book a Discovery Call", mobile dock "Book", home hero and closing band, services, service/industry/portfolio pages, FAQ, tool `noscript` fallbacks) opens the free Cal.com Discovery Call in a new tab ("↗") and sends a `Booking Click` event. "Discuss a package", "Ask about Partnership", "Request documents" and "Contact us" stay on the enquiry form (`/contact#enquiry`). Use `<CTAButton booking label="…" />` for new ones.

## Forms: two buckets
| Form | Use | Sorted by |
|---|---|---|
| `enquiry` | every lead | hidden `request_type`: `consultation`, `business-assessment`, `compliance-checklist`, `business-structure`, `find-my-service`, `compliance-reminders`, `training-request`, `growth-portfolio`, `newsletter` |
| `career-application` | staff / partner applications with CV, cover letter, proposal | `applying_as` |
Assessment submissions carry `assessment_score`, `assessment_band`, `assessment_gaps`, `assessment_answers` (JSON) for analysis. Export CSV from Netlify Forms.
Limits (field lengths, 3 MB per file) are client-side only. Confirm Netlify's spam filtering is on (Forms → Settings). Unsuccessful job applications must be deleted within 6 months (Privacy Notice).

## Analytics (PostHog)
- **Tool and region:** PostHog Cloud **EU** (servers in Frankfurt), `posthog-js` pinned in `package.json`. All settings live in one place: `src/lib/analytics.ts` (project key, `/ingest`, `ui_host` `https://eu.posthog.com`, `defaults` date).
- **Proxy:** the browser only talks to our own domain. `netlify.toml` forwards `/ingest/static/*` and `/ingest/array/*` to `eu-assets.i.posthog.com` and `/ingest/*` to `eu.i.posthog.com` (in that order). It works on the custom domain only, which is also the only place tracking runs. The CSP stays `'self'` for scripts and connections.
- **Consent:** PostHog is downloaded and started **only after "Accept analytics"** (`src/components/ui/Analytics.tsx`). Before that, or after "Decline", nothing loads, nothing is sent and nothing is stored apart from the choice itself (`scs_cookie_consent`). Browsers that send **Do Not Track / Global Privacy Control** still see the banner, with a line saying analytics is off by default; only their own explicit "Accept analytics" turns it on (owner decision, 18 October 2026). Withdrawing via "Cookie settings" opts out and deletes every `ph_*` / `__ph*` cookie and storage item. Never runs on localhost, `*.netlify.app` or `/admin`. Session replay and surveys are **off**; if replay is ever enabled it must use `maskAllInputs: true` and stay consent-only.
- **Events** (snake_case, sent through `src/lib/track.ts` only):

  | Event | Properties | Fired by |
  |---|---|---|
  | `$pageview`, `$pageleave`, autocapture | PostHog defaults (incl. UTM parameters and referrer) | posthog-js |
  | `cta_clicked` | `cta_name`, `location_on_page`, `page_path` | call / email / WhatsApp / `book_discovery_call` links and any `data-track` element (`TrackClicks.tsx`) |
  | `outbound_link_clicked` | `destination_domain`, `link_label`, `location_on_page`, `page_path` | links to other sites |
  | `file_downloaded` | `file_name`, `page_path` | `.pdf`, `.docx`, `.xlsx`, `.pptx`, `.csv`, `.zip` or `download` links |
  | `service_page_viewed` | `service_name`, `page_path` | each `/services/[slug]` page |
  | `form_started` / `form_step_completed` / `form_submitted` / `form_error` | `form_name`, `step`, `service_interest`, `error_type`, `page_path` | `useFormAnalytics()` in both form components |
  | `newsletter_subscribed` | `page_path` | newsletter form |
  | `tool_completed` | `tool_name`, `result_band`, `page_path` | the free tools |

  `form_name` is the form's `request_type` in snake_case (`consultation`, `business_assessment`, … `career_application`). `location_on_page` comes from `data-location` on a wrapper (`hero`, `closing_band`, `page_hero`, `top_bar`, `contact_channels`, …) or the landmark (`header`, `footer`, `sidebar`, `mobile_dock`, `main`).
- **RULE: no personal data in events.** Only the keys in `ALLOWED_PROPS` (`src/lib/track.ts`) are ever sent; anything else is dropped. Never add names, emails, phone numbers, message text or file contents. `service_interest` is read only from a chosen dropdown/radio option, never typed text, and `before_send` replaces anything that looks like an email or phone number in free-text properties.
- **Leads:** when a visitor who accepted analytics submits a form, a random `lead_…` ID is saved with the Netlify entry (hidden field `lead_id`) and passed to `identify()` with only `lead_source` and `service_interest`. Match a lead to its visit by searching that ID in PostHog → Persons. No email, hashed or not, reaches PostHog. There is no login, so `reset()` is not used.
- **Retention:** 12 months (Privacy Notice). Set the same in PostHog.

## Email aliases (`src/lib/site.ts`)
`contact@` default public address · `sales@` consultations/leads · `info@` information, complaints, data-protection requests (until `privacy@` exists) · `accounts@` invoices · `admin@` INTERNAL ONLY (never shown).

## Preview vs production
Preview / branch deploys show the exact **client placeholders** (`docs/CLIENT_PLACEHOLDERS.md`) and the **portal prototype** (`/portal`, mock data, noindex, unlinked). Production hides both (the portal returns 404). To view them in production temporarily, set the two flags in `.env.example` — and remove them again.

## Legal pages
`src/content/legal/*.json` with `{{tokens}}` from `site.ts`. The final, lawyer-approved Terms of Service, Privacy Notice and Cookie Policy (supplied 18 October 2026, all effective 3 December 2025, no "last updated" date) are live and indexable. Any `[placeholder]` added later puts that page back into draft (notice, `noindex`, out of the sitemap). See `docs/legal-open-items.md`. To publish a new version, send the documents to the developer: legal pages are edited in the repository, not in `/admin`.

## Security notes
HTML from the CMS is sanitised (allowlist). Headers: `netlify.toml` sets nosniff, frame options, referrer, permissions, HSTS and a minimal CSP on every path (including `/admin`); `next.config.ts` adds the full CSP on every path except `/admin`: `default-src 'self'`, scripts and connections only to self (analytics goes through the same-origin `/ingest` proxy), no frames or objects, `upgrade-insecure-requests`. Left loose on purpose: `script-src 'unsafe-inline'` (Next.js inlines hydration data and the site is static, so per-request nonces are impossible without dynamic rendering) and `style-src 'unsafe-inline'` (React style attributes). `/admin` keeps only the minimal policy because Decap needs api.github.com, api.netlify.com and GitHub-hosted images. HSTS is `max-age` only — enable `includeSubDomains`/`preload` only after every subdomain is confirmed HTTPS-only. CI (`.github/workflows/ci.yml`) runs lint, typecheck, tests, build and `npm audit`.

## Where content lives
Business details `src/lib/site.ts` · services/portfolio/industries/FAQs/IP/packages/testimonials/programmes `src/content/*/entries/` · regulators `src/content/regulators.json` · tools `src/content/tools/*.json` (assessment, calendar editable in CMS; checklist/structure/finder are JSON in the repo) · partnership `src/content/partnership.json` · about `src/content/about.ts` · leadership `src/content/leadership.ts` (photos in `public/images/team/`; never publish signatures) · blog `src/content/corporate-school/*.md` (future `date` = scheduled; the ten Corporate College articles were published 16 October 2026).
Design tokens: `src/app/globals.css` only (logo blue, navy, gold; gold is never text on white).
