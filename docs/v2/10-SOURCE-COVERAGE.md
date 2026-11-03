# Source coverage: where each planning source lands in the v2 build

Checked on 3 November 2026 against the three planning sources:

1. **Planning chat** (https://claude.ai/share/fa72c333-c7cd-4d94-8ce7-589c3cd97b4b): research, the strategy rounds, the owner's decisions and the build pack.
2. **Strategy and Content Model** (https://claude.ai/artifact/DLnS1EMZqTwuwkD6m7fNHr): copied in full to `08-STRATEGY-AND-CONTENT-MODEL.md`.
3. **Design canvas** (https://claude.ai/artifact/11aCnHGH4wGwN4rYS7Qybv): Direction B. Its source files are in `design/` and are **byte-identical** to the canvas (Main, Header, Footer, MobileBar, Service, Partnership, Contact and tokens.json, compared on 3 November 2026).

Nothing from these sources is missing from the repo. Most of it is **not visible in the site yet**, because the pages
that carry it are built in PRs 3 to 6, in the order set by `01-BUILD-PROMPT.md`. Status: ✅ built · ⏳ planned (PR named).

## Owner rulings

| Ruling | Where | Status |
|---|---|---|
| Full name "Stephen Corporate Services - SCS Ltd" | `src/lib/site.ts` → header, footer, titles, JSON-LD | ✅ PR 2 (forms and emails: PR 5) |
| Phone/WhatsApp +234 812 813 8222; old number banned | `site.ts`; `scripts/check-site.mjs` fails on the old number | ✅ PR 1–2 |
| No fees or cost values, including government fees | Copy rule for every page; guides say fees come in the proposal | ⏳ PR 3–6 (copy) |
| No delivery or completion timelines | Service template has no timeline field | ⏳ PR 3 |
| "We respond within 24 hours." word for word; no "Open now" indicator | `SITE.responsePromise` in the footer; hours as text | ✅ PR 2 (forms and Contact: PR 4–5) |
| Direction B: Source Serif 4 for H1/H2, Inter for the rest | `layout.tsx`, `globals.css` | ✅ PR 2 |
| Tower on the home page, never removed, on mobile too | `TowerMark` + `HeroSkyline` (exact logo vector) | ✅ PR 2 (B home layout: PR 4) |
| Nav: Home · Services · Clients · Process · Partnership · Insights · About, plus Request a proposal and Book a Discovery Call | `src/lib/nav.ts`, `Header.tsx` | ✅ PR 2 (target pages: PR 3–4) |
| Shorter mobile home (carousels, `<details>`, 2×2 figures), nothing removed | `.snap-row` utility | ✅ utility PR 2 · ⏳ home PR 4 |
| Legal wording: only items 20 and 22 applied; 1, 2, 13, 16 and the rest kept as v1 | Redirect (item 22) in `public/_redirects`; legal-word report allow-lists kept passages | ✅ item 22, report PR 1 · ⏳ item 20 rewrites PR 6 |
| Service names in globally used terms; 66 services in 7 clusters | `src/content/v2/services.v2.json` | ✅ data + menu PR 2 · ⏳ pages PR 3 |
| Industries 15 → 6 | `04-industries.v2.json` | ⏳ PR 4 |
| All 23 case studies approved and consented | v1 content | ⏳ PR 6 (fixed case-study template PR 4) |
| Proof figures with definitions, no "as at" dates | `02-DECISIONS.md`, strategy §7 | ⏳ home PR 4 |
| Values list unchanged | v1 content | ✅ unchanged |
| No extra partner benefits; enquiries kept 6 months | Partnership page; retention job | ⏳ PR 4 · PR 5 (cron is wired in PR 1) |
| Hosting on Cloudflare Workers, not Netlify | `wrangler.jsonc`, `worker/` | ✅ PR 1 (Netlify forms replaced in PR 5) |

## Strategy and Content Model, section by section

| Section | Lands in | Status |
|---|---|---|
| §2 Positioning: home H1 "One accountable partner for setting up, running and growing your organisation, in Nigeria and across borders." and the supporting line | Home hero (`design/Main.dc.html`) | ⏳ PR 4 |
| §2 Ten-second test (what, who, why trust, next step above the fold) | Home and audience heroes | ⏳ PR 4 |
| §3 Seven audiences and Start-here paths | `/clients/*` pages, home Start here | ⏳ PR 4 |
| §4 Merged service model (7 clusters, 66 services) | `/services`, 7 hubs, 66 service pages, Service Finder | ⏳ PR 3 |
| §5 Legal-rule table (only 20 and 22) | See rulings above | ✅ / ⏳ PR 6 |
| §6 Sitemap and redirects (41 rules) | `04-_redirects.txt` → `public/_redirects`, switched on as targets exist | ✅ 3 rules PR 1 · ⏳ the rest PR 3–4 |
| §6 Footer and mobile menu carry Contact, Tools, Work, Corporate College, Join us; footer carries Search | `Footer.tsx`, `Header.tsx` mobile panel | ✅ PR 2 (`/search` page: PR 4) |
| §7 Eight page templates, each ending in "What happens next" | Home, hub, service, audience, case study, guide, tool, form | ⏳ PR 3–5 |
| §8 Partnership page outline | `/partnership`, `/partnership/remote-operations` (`design/Partnership.dc.html`) | ⏳ PR 4 |
| §9 Tone guide (five v2 rules, banned vocabulary) | Copy rules; CI banned-word check | ✅ check PR 1 · ⏳ copy PR 3–6 |
| §10 Metrics plan: events `cta_click`, `booking_click`, `form_step`, `form_submit`, `tool_complete`, `whatsapp_click`, `call_click`, `partnership_cta`, `post_submit_next_step`, each with `service_id` and `audience`; UTM stored with leads | PostHog via `/ingest`; D1 lead rows | ⏳ PR 5 (UTM) · PR 8 (events, dashboard) |
| §11 Owner decisions | All answered (see `02-DECISIONS.md`) | ✅ |

## Design canvas (Direction B), board by board

| Board | Lands in | Status |
|---|---|---|
| Shared · Header | `src/components/layout/Header.tsx` | ✅ PR 2 |
| Shared · Footer | `src/components/layout/Footer.tsx` | ✅ PR 2 |
| Shared · Mobile action bar | `src/components/layout/MobileBar.tsx` | ✅ PR 2 |
| B · Home (desktop and mobile) | `src/app/page.tsx` | ⏳ PR 4 (tower on mobile already in PR 2) |
| B · Service page | service template | ⏳ PR 3 |
| B · Partnership | `/partnership` | ⏳ PR 4 |
| B · Contact | `/contact`, `/contact/proposal` | ⏳ PR 4 (page) · PR 5 (working form) |

## Research report

Summary and the official facts to state carefully: `09-RESEARCH-SUMMARY.md`. They are used in the Corporate School guides and topic hubs (PR 6), with "last reviewed" dates and no fee amounts.
