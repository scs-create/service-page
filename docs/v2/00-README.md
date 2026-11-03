# SCS Website v2: build pack for Claude Code

Prepared 3 November 2026. This pack holds everything the Claude Code session needs to build version 2 of the Stephen Corporate Services - SCS Ltd website.

## How to start (Stephen)

1. Open Claude Code on the web and start a session on **scs-create/service-page**.
2. Attach this zip to your first message. Alternatively, unzip it into the repo as `docs/v2/` on a new `v2` branch.
3. Paste the prompt from **`01-BUILD-PROMPT.md`** (the text between the two lines) as that first message.
4. Keep **`07-OWNER-SETUP-CHECKLIST.md`** open. Claude will ask for each step by number when it needs it.

## What is in the pack

| File | What it is |
| --- | --- |
| `01-BUILD-PROMPT.md` | The first message to paste into Claude Code |
| `02-DECISIONS.md` | All owner decisions and rules (top precedence) |
| `03-services.v2.json` | 66 services in 7 clusters: names, IDs, paths, summaries, v1 sources, most-requested flags |
| `04-industries.v2.json` | 6 merged industries and the v1 pages each replaces |
| `04-redirects.csv` / `04-_redirects.txt` | 41 permanent redirects, ready for `public/_redirects` |
| `05-SITE-SPEC.md` | Sitemap, global elements, page templates, visual system B, accessibility, SEO, analytics, content tasks |
| `06-TECH-SPEC.md` | Cloudflare Workers architecture, D1 schema, forms API, email DNS, staff access, CMS, headers, budgets, CI/CD, cutover, QA |
| `07-OWNER-SETUP-CHECKLIST.md` | The account, key and approval steps only Stephen can do |
| `design/*.dc.html` | Source of the approved Direction B designs (Home, Service, Partnership, Contact, Header, Footer, Mobile bar) |
| `design/tower.svg` | The SCS tower mark (exact vector of the logo) |
| `design/tokens.json`, `design/design-system-README.md` | The SCS design system |
| `08-STRATEGY-AND-CONTENT-MODEL.md` | Added in the build: full copy of the strategy doc (positioning, audiences, templates, Partnership outline, tone guide, metrics plan) |
| `09-RESEARCH-SUMMARY.md` | Added in the build: research summary and the official facts guides must state carefully (no fees) |
| `10-SOURCE-COVERAGE.md` | Added in the build: every item from the chat, strategy doc and canvas, where it lands and which PR builds it |
| `LOCAL-TESTING.md` | Added in the build: running the v2 build on your own PC |
| `ADMIN-ACCESS-SETUP.md` | Added in the build: exact Cloudflare Access, GitHub OAuth and Worker settings for checklist steps 10–12 |
| `ANALYTICS-AND-SEO.md` | Added in the build: the v2 events, the PostHog dashboard to build, structured data, Search Console steps |
| `QA-REPORT.md` | Added in the build: PR 9 QA results (Lighthouse, accessibility, smoke test) and what is left for after deploy |
| `99-original-brief.txt` | The original v2 brief (context only; the decisions file overrides it) |

## Links

- Strategy and content model (doc): https://claude.ai/artifact/DLnS1EMZqTwuwkD6m7fNHr
- Design canvas (row B chosen): https://claude.ai/artifact/11aCnHGH4wGwN4rYS7Qybv
- SCS design system: https://claude.ai/artifact/Bv4PmZLBKMySJuRnLqZL1h
- Repository: https://github.com/scs-create/service-page (base: `main` @ 821353f)
- PostHog: EU cloud, project 310194
- Booking: https://cal.com/support-stephen-corporate-services-scs/30min

These links are private to your account. If the Claude Code session cannot open them, the files here are complete without them.
