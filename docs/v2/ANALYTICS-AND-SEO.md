# Analytics and SEO in v2

## How analytics works

- **PostHog Cloud EU** (project 310194) loads only after a visitor clicks "Accept analytics", and only on the live
  domain. Previews and `localhost` are never tracked.
- Traffic goes through `/ingest` on our own domain (`worker/ingest.ts`, following PostHog's Cloudflare guide).
  Cookies and other credentials are removed before anything reaches PostHog.
- No name, email, phone number, message or file is ever sent to PostHog (`src/lib/track.ts` allow-list).

## Events (05-SITE-SPEC.md §7)

Each event carries `service_id` and `audience` when the page has them (service pages, audience pages, the
Discuss panel), plus `page_path`.

| Event | When it fires |
| --- | --- |
| `booking_click` | Any "Book a Discovery Call" link (Cal.com) |
| `call_click` | A phone link |
| `whatsapp_click` | A WhatsApp link |
| `partnership_cta` | "Start a partnership conversation" |
| `cta_click` | Other tracked buttons (`cta_name` says which), and email links |
| `form_started` · `form_step` · `form_submit` · `form_error` | Form progress (`form_name`, the chosen service interest) |
| `post_submit_next_step` | A click in the success panel after a form (`cta_name`) |
| `tool_complete` | A business tool finished (`tool_name`, `result_band`) |
| `service_page_viewed` · `outbound_link_clicked` · `file_downloaded` · `newsletter_subscribed` | As named |

v1 used older names (`cta_clicked`, `form_submitted`, `form_step_completed`, `tool_completed`). PostHog keeps
the v1 history under those names, so v1 and v2 are compared with the baseline figures in `05-SITE-SPEC.md` §7.

## The "Website v2" dashboard (built in PostHog after launch)

Build these once real traffic exists (owner checklist step 20, after 30 days):

1. Entry pages and channels: web analytics, filtered to the live domain.
2. **Funnel:** `$pageview` on a service, audience or partnership page → `booking_click` **or** `form_submit`.
   Break it down by `service_id`, then by `audience`.
3. Core Web Vitals by template (PostHog web vitals): LCP, INP and CLS at p75.
4. Mobile against desktop: pages per visitor and bounce rate (v1: 1.0 page on mobile, 42% bounce).
5. Countries.

Leads join up through the anonymous `lead_id`. It's saved with the submission in D1 (`posthog_id`) only for
visitors who accepted analytics.

## SEO (05-SITE-SPEC.md §6)

- Every indexable page has a unique title ("Page | Stephen Corporate Services - SCS Ltd"), a unique description
  and a canonical link. `check:site` fails a production build if any is missing or duplicated.
- Structured data:
  - `Organization` + `ProfessionalService`, with the RC number, address, opening hours and contact point;
  - `Service` on each of the 66 service pages;
  - `Article` on guides;
  - `FAQPage` on the FAQ;
  - `BreadcrumbList` wherever breadcrumbs are visible.
- Each section has an Open Graph image, generated at build time from `src/lib/ogImage.tsx`.
- `sitemap.xml`, `robots.txt`, `rss.xml` and `search-index.json` are generated at build time. Previews are
  `noindex` and disallow all crawling; only the production build is indexable.

### After cutover (owner checklist step 18)

1. Google Search Console → **Add property → Domain** → `stephencorporateservices-scs.com`. Add the TXT record it
   shows in Cloudflare DNS, then click Verify.
2. **Sitemaps** → submit `https://stephencorporateservices-scs.com/sitemap.xml`.
3. Bing Webmaster Tools → **Import from Google Search Console** (or add the site and the same sitemap).
