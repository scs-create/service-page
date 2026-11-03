# Prompt to paste into the Claude Code session (first message)

Copy everything between the lines below into the first message of the Claude Code session on `scs-create/service-page`, with the build pack zip attached (or with the pack committed at `docs/v2/`).

---

You are the lead engineer building **version 2 of the Stephen Corporate Services - SCS Ltd website** (stephencorporateservices-scs.com) in this repository. Strategy, content model and design are finished and approved. Your job is to build, migrate content, test, and prepare the launch, with production untouched until I sign off the preview.

## Sources, in order of precedence

1. `docs/v2/02-DECISIONS.md`: my final decisions and the non-negotiable rules. This file overrides everything else, including the original brief.
2. `docs/v2/05-SITE-SPEC.md` (pages, templates, visual system, accessibility, SEO, analytics) and `docs/v2/06-TECH-SPEC.md` (Cloudflare architecture, Worker, D1, R2, email, CMS, CI/CD, cutover, QA).
3. `docs/v2/03-services.v2.json` (66 services, 7 clusters: the single source of truth for services), `docs/v2/04-industries.v2.json` and `docs/v2/04-_redirects.txt`.
4. `docs/v2/design/`: the approved Direction B design source (`*.dc.html`), `tower.svg` and `tokens.json`. The live canvas is https://claude.ai/artifact/11aCnHGH4wGwN4rYS7Qybv (row B is the chosen one). Treat the markup as a visual reference and rebuild it with the repo's own React components and Tailwind; do not paste the markup in.
5. The strategy document: https://claude.ai/artifact/DLnS1EMZqTwuwkD6m7fNHr. Background only: its "Decisions log" and "Second round of owner decisions" tables are already folded into 02-DECISIONS.md.
6. The current code on `main`. Keep every working feature, URL and content item unless the specs say otherwise.
7. `docs/v2/99-original-brief.txt`. Context only; decisions and specs override it.

If you can open the artifact links, use them. If you cannot, the files in `docs/v2/` are complete without them.

## Rules you must never break

- The company name is written in full as **"Stephen Corporate Services - SCS Ltd"**.
- Phone and WhatsApp are **+234 812 813 8222** everywhere.
- **No fees, prices or cost values** anywhere, including official government fees.
- **No delivery or completion timelines** for any service.
- The response promise is exactly: "We respond within 24 hours." There is no "open now" indicator.
- The **tower motif stays in the home page hero** permanently.
- Navigation: Home · Services · Clients · Process · Partnership · Insights · About.
- Legal wording: apply **only items 20 and 22**. Keep everything else, including items 1, 2, 13 and 16, exactly as in v1 (see the decisions file).
- Never invent testimonials, bios, figures, clients or logos. Never use client or staff data from anywhere other than the published portfolio.
- Production DNS, the Netlify site and the Google Workspace email records stay untouched until I write "Approved for cutover" in the sign-off PR.

## How to work

- Create branch `v2` from `main`. Open **small, reviewable PRs into `v2`**, each with a preview URL, in this order:
  1. Platform: static export, `wrangler.jsonc`, Worker skeleton, `_headers`, `_redirects`, CI with preview deploys and the word checks.
  2. Design system B: tokens, self-hosted subset fonts (Inter and Source Serif 4), Header, Footer, MobileBar, cookie banner and the tower SVG component.
  3. Services: the data model from `03-services.v2.json`, the 7 cluster hubs, the service page template, the services index, and Service Finder updates.
  4. Pages: Home (with the mobile condensing patterns), Process, Partnership, `/partnership/remote-operations`, Clients audience pages, Industries (6).
  5. Forms: the `/api/forms/:form` Worker with Turnstile, rate limiting, zod, D1, R2 for CVs, the internal notification, the Resend confirmation, the success panel with vCard, and the 6-month retention cron.
  6. Content migration: all 23 case studies in the fixed structure; Corporate School (apply item 20); About, FAQ, careers and tools; policies updated for Cloudflare, Resend, PostHog and 6-month retention.
  7. CMS and staff access: Decap OAuth in the Worker, `/admin/submissions` behind Cloudflare Access.
  8. Analytics and SEO: the PostHog `/ingest` proxy, consent, events, JSON-LD, sitemap, RSS, search index, Open Graph images, and the PostHog "Website v2" dashboard (if you have PostHog access; otherwise give me the exact steps).
  9. QA and docs: Lighthouse, accessibility, link and redirect checks, the full form test, and rewritten `README.md`, `docs/DEPLOYMENT.md` (with the cutover and rollback checklist), a content-editing guide for staff, and a form and submissions handling guide.
- **Do not stop for open questions.** Make the most reasonable choice consistent with the decisions file, note it in the PR description under "Decisions taken", and keep going. Stop and ask me only for the following, and ask each one when you first need it, not all at the start:
  - a key or account step from `docs/v2/07-OWNER-SETUP-CHECKLIST.md`;
  - anything irreversible: DNS, deleting the Netlify site, changing email records;
  - copy approvals, which I give in the PRs.
- When you need a key or account step from me, quote the exact step number from `07-OWNER-SETUP-CHECKLIST.md`, and tell me where to put the value. Never ask me to paste a secret into chat.
- Draft service and page copy following the tone guide in the specs, marked `status: "draft"` until I approve. Unconfirmed facts go in PR comments as `[OWNER TO CONFIRM]`, never in production.
- Confirm current Cloudflare, Resend, Next.js and Turnstile behaviour from official docs before relying on it.
- At the end of each PR, report in 5 lines or fewer: what changed, the preview link, decisions taken, anything you need from me, and the next PR.

## Definition of done (before I sign off the preview)

- Every page passes the 10-second test: what SCS does, who it is for, why it can be trusted, and the next step.
- No fees, timelines, invented content or `[OWNER TO CONFIRM]` text in the production build.
- The full company name and the new phone number appear everywhere. Grep for `906 403 5713` and "Benhen" returns 0 matches.
- The budgets in 06-TECH-SPEC §9 are met on the preview, WCAG 2.2 AA passes and CI is green.
- Every form works end to end on Cloudflare: Turnstile, D1, R2, both emails, the success panel and the next-step button. The retention job passes a dry run.
- Every old URL redirects correctly, Netlify Forms is fully replaced, and the Google Workspace email records are unchanged (proven by a DNS zone diff).

Start now with PR 1. First give me a short plan (10 lines or fewer) of what PR 1 will contain, then build it.

---
