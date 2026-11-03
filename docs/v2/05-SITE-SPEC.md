# SCS Website v2: site specification

Read `02-DECISIONS.md` first. The visual reference is the design canvas, https://claude.ai/artifact/11aCnHGH4wGwN4rYS7Qybv (row B is the chosen direction), and its source files in `design/`. Use the source files as the reference for layout, spacing and copy. Build from them with the repo's own components; do not paste their markup.

## 1. Sitemap (keep existing URLs where listed as kept)

| Section | URL | Notes |
| --- | --- | --- |
| Home | `/` | Template H (§3) |
| Process | `/process` | New. Six steps plus "What we do and do not do" |
| Partnership | `/partnership`, `/partnership/remote-operations` | New. Central conversion page |
| Services | `/services`, `/services/<cluster>`, `/services/<cluster>/<service>` | 1 index + 7 hubs + 66 pages, all generated from `03-services.v2.json` |
| Clients | `/clients`, `/clients/founders-and-smes`, `/clients/growing-companies`, `/clients/ngos-and-institutions`, `/clients/doing-business-in-nigeria` | Audience pages. The remote-operations audience links to `/partnership/remote-operations` |
| Industries | `/industries`, `/industries/<slug>` | 6 pages from `04-industries.v2.json` |
| Work | `/portfolio`, `/portfolio/<slug>`, `/verification` | Kept. All 23 case studies |
| Corporate College | `/corporate-college`, `/corporate-college/corporate-school`, `/corporate-college/corporate-school/<slug>`, topic hubs `/corporate-college/corporate-school/topics/<topic>` | Kept, plus topic hubs: company registration, post-incorporation filings, tax registration (NRS), data protection (NDPA), doing business in Nigeria, funding readiness |
| Tools | `/tools`, `/assess`, `/compliance-checklist`, `/business-structure`, `/find-my-service`, `/compliance-calendar` | Kept. Each ends with a result plus "Discuss my result" and "Email me my result" (with consent) |
| About | `/about`, `/about/standards` | Story, leadership, values, standards (expert vetting, management quality review, data protection, conflicts, complaints), registration details |
| Contact | `/contact`, `/contact/proposal` | Discovery Call, enquiry form, proposal form, phone/WhatsApp, office, hours (text) |
| Join us | `/career`, `/career/expert-network` | Kept, plus the expert-network application |
| Policies | `/privacy`, `/cookies`, `/terms`, `/accessibility` | Update for Cloudflare, Resend and PostHog, and for 6-month retention |
| Search | `/search` | Static search index |
| Portal | `/portal` | Keep as is unless it conflicts with the static export; flag it in the PR if it does |

All moved URLs need a 301. The rules are in `04-_redirects.txt`.

## 2. Global elements

- **Header** (design/Header.dc.html):
  - logo, the full name "Stephen Corporate Services - SCS Ltd" and "RC 9041457";
  - nav: Home · Services · Clients · Process · Partnership · Insights · About;
  - "Request a proposal" link and "Book a Discovery Call" button.
  - The active item gets a 2px gold underline.
  - Services opens a mega-menu of the 7 clusters only, each showing its top 3 most-requested services, plus "All services" and "Service Finder".
  - Mobile: a Menu button that opens a full-height panel with the same items.
- **Footer** (design/Footer.dc.html):
  - navy band with a 4px gold top edge;
  - full company name, RC, address, hours, phone/WhatsApp and email;
  - Services (7 clusters); SCS links; Policies, Accessibility statement and Cookie settings;
  - "Stephen Corporate Academy (SCA) ↗" linking to stephencorporateservicesacademy.com;
  - © line with the tagline.
  - Print the footer service list once; no static "Show all 21 services" text.
- **Mobile action bar** (design/MobileBar.dc.html): sticky Call / WhatsApp / Book a call, on mobile only. Add bottom padding to the footer so the bar never covers content.
- **Cookie banner:** consent-first. "Accept" and "Reject" are equally prominent. PostHog loads only after consent.
- **Honeypot:** visually hidden with an off-screen class, `aria-hidden="true"` and `tabindex="-1"`, so its label is never visible.
- **Social links:** text labels, never raw URLs.

## 3. Templates

**H: Home** (design/Main.dc.html, direction B). Sections in order:
1. Hero: eyebrow, H1, gold rule, lead, "Book a Discovery Call" and "See our process →", response promise.
   - Desktop: the **tower SVG** on the right, with the registration record card under it.
   - Mobile: the tower as a 112px band above the text, and the record as a `<details>`.
2. Figures: four figures with definitions, no dates (2×2 on mobile).
3. Start here: 8 rows (7 audiences plus the Service Finder). Descriptions are hidden on mobile.
4. Our process: navy band, six steps (a carousel on mobile, with "Swipe to see all six steps →").
5. SCS Partnership in brief, with "What partners receive" (a `<details>` on mobile).
6. Selected work: 3 case-study fact panels (a carousel on mobile) and "All 23 case studies →".
7. Corporate School: latest 3 guides (a carousel on mobile).
8. Closing: "Not sure where to start?" and "Book a Discovery Call".

Target mobile home length: about 5,500px at a 390px width (v1 is about 8,600px).

**C: Cluster hub.** What it covers → most-requested services first → all services in the cluster → related guides → related case study → What happens next → "Discuss your needs".

**S: Service page** (design/Service.dc.html). Breadcrumb → H1 (service name) → summary → service ID, plus "Delivered in person in Abuja or remotely". Then:
- Main column: Who it is for → Why it matters (3 benefits) → What you receive (gold-topped panel) → What you provide → How it runs (link to /process) → What this service does not include → Related (guide plus case study).
- Sticky side panel: "Discuss this service" (primary), "Request a proposal instead →" and the response promise.

Close with "What happens next" in 3 steps. Use no timelines and no fees.

**A: Audience page.** Who this is for → what usually comes first → how SCS helps (service links) → "Are we a fit?" → case study → What happens next → one button (as in the table below).

| Audience | Path | Primary button |
| --- | --- | --- |
| Founders and SMEs | `/clients/founders-and-smes` | Book a Discovery Call |
| Growing companies | `/clients/growing-companies` | Start a partnership conversation |
| NGOs and institutions | `/clients/ngos-and-institutions` | Book a Discovery Call |
| Doing business in Nigeria | `/clients/doing-business-in-nigeria` | Request a proposal |
| International firms | `/partnership/remote-operations` | Start a partnership conversation |

**P: Partnership** (design/Partnership.dc.html). Hero → What partners receive (4 cards) → Who it suits → "Are we a fit?" (navy band, two columns, plus "If we are not the right fit for a need, we will say so.") → How a partnership is agreed (6 steps) → Remote operations for international firms (WAT time-zone overlap) → What happens next → "Start a partnership conversation".

**K: Case study.** Client and RC → sector → challenge → what SCS did → deliverables → outcome stated factually → date → related service.

**G: Guide.** Subtitle promise → author, published date, last reviewed date → "For general information only" note → numbered sections → worked example → official sources with retrieval dates → related service.

**F: Form pages** (design/Contact.dc.html):
- Show only the fields needed, with labels above the inputs and a "Required" legend.
- Consent checkbox naming Stephen Corporate Services - SCS Ltd, plus the response promise.
- On success, replace the form with a "What happens next" panel:
  1. a success message and the reference number (also emailed);
  2. a timeline: received → reviewed by the right person → reply within 24 hours → call or proposal;
  3. one primary button matched to the request (Book your Discovery Call, with name and email prefilled via Cal.com URL parameters; Take the business assessment; or Read: what to prepare for your call);
  4. "Continue exploring": 2 or 3 links matched to the service or audience chosen;
  5. "Add our contact details" as a vCard download (it is lighter than a summary), carrying the new phone number.

## 4. Visual system (direction B)

- Colours (from tokens.json):
  - primary #0340a9 · secondary/navy #011550 · accent/gold #f9b91a;
  - bg #ffffff · surface #f1f5fc · text #0b1730 · muted #475a7d · border #d6e0f2;
  - success #1e7f4d · error #b3261e · input outline #8a9bbb (a new token: 3:1 or better on white, for WCAG 1.4.11).
- Gold is never text on white.
- Type:
  - H1 and H2 in Source Serif 4 600, letter-spacing 0. H1 58/34px (desktop/mobile); H2 42/27px.
  - Everything else in Inter. Body 16/1.5; lead 18/16px; eyebrow 13px 600 uppercase with 0.06em tracking.
  - Figures use tabular numerals.
- Shape:
  - 1px hairlines; a 4px gold top edge on proof and document panels; the 56×4px gold rule under H1/H2.
  - Radius 4px on panels and inputs, 8px on buttons. No shadows except the hover lift.
- Navy bands sparingly: the process band, "Are we a fit?" and the footer.
- Never use gradients, glassmorphism, emoji, stock photos, carousels in a hero, auto-play, parallax, pop-ups, chat bubbles or fake urgency.
- Mobile carousels use CSS scroll-snap only (no JS library), are keyboard-scrollable (`tabindex="0"` on the scroller with an `aria-label`) and show a visible swipe hint.

## 5. Accessibility (WCAG 2.2 AA)

- Skip link; landmarks; one H1 per page.
- Focus ring: 2px primary, offset 2px; gold inside navy bands.
- Targets at least 24×24 CSS px; this design uses 44px.
- `prefers-reduced-motion` turns off all motion.
- Forms use visible labels, `autocomplete`, and errors shown only after interaction, linked with `aria-describedby`.
- `<details>` panels have clear summaries.
- Publish an accessibility statement at `/accessibility`.

## 6. SEO and structured data

- Every page has a unique title and description, a canonical URL and an Open Graph image per section. Titles follow "Page — Stephen Corporate Services - SCS Ltd".
- JSON-LD:
  - `Organization` + `ProfessionalService` with `name`/`legalName` "Stephen Corporate Services - SCS Ltd", `identifier` RC 9041457, address, `openingHoursSpecification` (Mo–Fr 08:00–17:00, Africa/Lagos), and a `contactPoint` with telephone +234-812-813-8222 and the public email;
  - `Service` per service page; `Article` for guides; `FAQPage` for FAQs; `BreadcrumbList` where breadcrumbs are visible.
- Generate `sitemap.xml`, `robots.txt`, `rss.xml` and `search-index.json` at build time.
- Internal links run between services, guides and case studies (from the related fields in the data file).
- Target queries include "register a company in Nigeria as a foreigner", "CAC annual returns", "NDPA compliance for small business", "how to register an NGO in Nigeria", "Tax ID registration Nigeria" and "business name vs limited company Nigeria".

## 7. Analytics (PostHog EU, project 310194, consent-gated, proxied at /ingest)

- Events, each with `service_id` and `audience`:
  - `cta_click`, `booking_click`, `form_step`, `form_submit`, `tool_complete`;
  - `whatsapp_click`, `call_click`, `partnership_cta`, `post_submit_next_step`.
- Capture UTM source, medium and campaign on landing; store them with each submission.
- Build a "Website v2" dashboard: entry pages, channels, the funnel landing → service, audience or partnership page → booking click or form submission, Core Web Vitals by template, mobile vs desktop, and countries.
- The v1 baseline (30 days to 3 November 2026):
  - 24 visitors, 54 pageviews, 2 min 23 s average session, 42% bounce;
  - mobile visitors view 1 page each;
  - home LCP p75 is 2.75 s.

## 8. Content work in the build session

- Draft benefits, What you receive, What you provide and Does not include for all 66 services. Follow the tone guide and the decisions file, and add no timelines or fees. Mark every draft `"status": "draft"` so the owner can approve it in a PR.
- Migrate and tidy all v1 pages, all 23 case studies (into the fixed structure) and the 10 Corporate School posts (apply item 20 only).
- Write the Process, Partnership and audience pages from §3. Leave anything unconfirmed as an `[OWNER TO CONFIRM]` comment in the PR, never in production. CI fails if production contains `[OWNER TO CONFIRM]`.
