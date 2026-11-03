# QA report (PR 9, 3 November 2026)

What was checked against `06-TECH-SPEC.md` §9 and §12. Measured on the owner's PC with `wrangler dev`, which is
Cloudflare's local runtime, on the noindex review build. Items marked **after deploy** need the online review address
or the live domain.

## Summary

| Area | Result |
| --- | --- |
| Links, pages, redirects, 404 | ✅ `scripts/smoke.mjs`: all 151 sitemap pages return 200; all 41 redirects return 301 to the right page; unknown pages return 404; security headers present; `/admin` closed |
| Accessibility (automated) | ✅ Lighthouse accessibility **100** on all 10 templates |
| Keyboard | ✅ Skip link is the first stop and works; menus, the cookie banner and forms work by keyboard; focus outline is visible (blue on light, gold on navy) |
| Best practices | ✅ 100 on 9 templates. 96 on the area page is a local-only console error: the browser asks for https on `localhost` |
| SEO | ✅ Structured data, titles, descriptions and canonicals (PR 8). Lighthouse SEO is 69 locally only because review builds are deliberately noindex; the production build is indexable |
| Layout shift (CLS) | ✅ 0 to 0.05 on every template (budget under 0.05) |
| Page weight | ✅ About 290–300 KB on most templates (budget 500 KB for Home). Guides and the proposal form are about 530–550 KB because of the Turnstile check and guide content |
| JavaScript | ⚠️ About 150 KB compressed on Home (budget 100 KB). See below |
| Performance score | ⚠️ 61–87 locally. Not reliable on this PC (below); to be measured online after deploy |
| Old phone number, "Benhen", banned words, `[OWNER TO CONFIRM]` | ✅ 0 (`check:site`) |
| Full name in header, footer, titles, structured data | ✅ (tests and `check:site`) |
| Forms end to end | ✅ Locally (PR 5: D1, R2, rate limit, Turnstile test key, vCard). **After deploy**: once `TURNSTILE_SECRET` and `RESEND_API_KEY` are set, with real emails |
| Screen reader | **To do by hand**: NVDA (Windows, free) on Home, a service page and the proposal form; checklist below |

## Lighthouse (mobile, simulated slow 4G), final run

| Template | Page | Perf. | Access. | Best pr. | LCP | CLS | Total blocking time |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home | `/` | 61 | 100 | 100 | 3.8 s | 0 | 1,270 ms |
| Area hub | `/services/compliance-and-regulatory` | 82 | 100 | 96 | 3.0 s | 0 | 510 ms |
| Service | `/services/compliance-and-regulatory/data-protection-compliance` | 71 | 100 | 100 | 3.2 s | 0 | 1,060 ms |
| Audience | `/clients/founders-and-smes` | 74 | 100 | 100 | 3.2 s | 0 | 740 ms |
| Partnership | `/partnership` | 87 | 100 | 100 | 1.9 s | 0 | 490 ms |
| Case study | `/portfolio/premier-pharmaceuticals-ltd` | 70 | 100 | 100 | 3.2 s | 0 | 1,110 ms |
| Guide | a Corporate School guide | 64 | 100 | 100 | 3.3 s | 0 | 1,490 ms |
| Tool | `/assess` | 70 | 100 | 100 | 3.6 s | 0 | 760 ms |
| Form | `/contact/proposal` | 75 | 100 | 100 | 3.5 s | 0 | 620 ms |
| Policy | `/privacy` | 68 | 100 | 100 | 3.3 s | 0 | 970 ms |

**Why these performance numbers are not the real ones.** Lighthouse warned that this PC's processor is slower than
it expects (benchmark 700–1,050, against about 1,500 for a typical test machine). It then slows the processor down a
further four times to imitate a phone, so blocking time and the largest paint are exaggerated. The same page scored
anywhere from 61 to 77 between runs. The reliable measurement is PageSpeed Insights on the online review address,
which runs on Google's standard machines. That's the first check after deploy, and the results get added here.

## Fixed in this PR

- **Fonts:** the Latin Extended set of Inter and Source Serif 4 is no longer preloaded on every page. It still loads,
  but only on a page that uses those characters. This saves about 106 KB on every page.
- **Header logo:** a 6 KB image sized for the header (80 × 90) replaces the 80 KB original. The original stays for
  structured data and sharing.
- **Menus:** the header no longer ships the whole 66-service catalogue to the browser; the server passes it only the
  7 menu entries.
- Home page transfer fell from about 480 KB to about 300 KB.

## The JavaScript budget (100 KB)

About 150 KB of compressed JavaScript is left on Home:

| Part | Compressed size |
| --- | --- |
| React | 72 KB |
| The Next.js page runtime | 46 KB |
| The site's own code (menus, cookie banner, analytics loader, search) | About 30 KB |

The first two are the framework itself and are the same on every Next.js site, so 100 KB can't be met without
changing framework. A 39 KB polyfill file appears in the build, but only very old browsers download it.

Recommendation: accept about 150 KB as the budget, and judge speed by the measured real-visitor figures (LCP, INP
and CLS in PostHog, `ANALYTICS-AND-SEO.md`), which are what the spec's targets are about.

## Screen reader checklist (NVDA, by hand)

1. Install NVDA from nvaccess.org (free). Start it, then open the site in Chrome or Firefox.
2. On Home, press **H** to move through headings. Every section should have a heading, in a sensible order.
3. Press **Tab** through the header. Each link should be read with its name. The menu button should say whether
   it's open.
4. On `/contact/proposal`, fill the form with mistakes. Each error should be read out, and focus should move to the
   first one.
5. Send it with the test keys locally. The success message should be read out.
