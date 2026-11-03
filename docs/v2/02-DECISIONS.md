# SCS Website v2: owner decisions and non-negotiable rules

Status: final as at 3 November 2026. Where any other file disagrees, **this file wins**. Precedence after this file: 05-SITE-SPEC.md, 06-TECH-SPEC.md, then the strategy doc.

## 1. Identity (exact values: copy, never retype from memory)

| Item | Value |
| --- | --- |
| Company name, in full | **Stephen Corporate Services - SCS Ltd** (write it in full everywhere, including the header, footer, title tags, JSON-LD `name`/`legalName`, emails and policies; shorten to "SCS" only where the full name cannot physically fit, or on a repeat mention within the same paragraph) |
| RC number | 9041457 (Corporate Affairs Commission, Nigeria) |
| Tagline | Elevate Your Company, Go Global. |
| Office | SD20 Belham Estate, Karsana, FCT, Abuja, Nigeria ("Belham", never "Benhen") |
| Hours | Monday to Friday, 8:00 am to 5:00 pm WAT (UTC+1) |
| Phone and WhatsApp | **+234 812 813 8222** · `tel:+2348128138222` · `https://wa.me/2348128138222` (replaces +234 906 403 5713 everywhere, including JSON-LD and vCard) |
| Public email | contact@stephencorporateservices-scs.com |
| Lead routing | sales@ for enquiries; contact@ for careers; info@ and accounts@ unchanged |
| Booking | https://cal.com/support-stephen-corporate-services-scs/30min (Discovery Call) |
| Domain | stephencorporateservices-scs.com (apex is canonical; www redirects to apex) |
| Leadership | Stephen Onyekeja: Chairman / Founder · Dr Chinedum Chidalu Kelvin: Chief Executive Officer. Use only `src/content/leadership.ts`. No bios. |

## 2. Content rules

1. **No fees or cost values anywhere.** That covers SCS fees, ranges, "from" prices and official government fees. Routes forward are "Book a Discovery Call", "Request a proposal" and "Start a partnership conversation".
2. **No delivery or completion timelines** for any service, on any page, guide or tool result.
3. **Response promise, word for word:** "We respond within 24 hours." There is no "open now" indicator; show office hours as text.
4. **Proof figures** keep their definitions and have **no "as at" date**:
   - 3,000+: Business registrations guided through the CAC by our founding team
   - 1,800+: Agreements processed for clients
   - 1,200+: Client and administrative engagements
   - 10+: Sectors actively served
5. **Values list:** keep the current "Why SCS" list for now (Multidisciplinary, Business-Centric, Technology-Enabled, Integrated, Scalable, Practical, Continuous).
6. **Case studies:** all 23 in `src/content/portfolio/entries` are approved and consented. Migrate all of them.
7. **Partner benefits:** Quarterly Business Check-Up, SCS Business Growth Report, one coordinator, scoped projects agreed in writing, and management quality review. No plan names or extra benefits.
8. **Retention:** enquiries and career applications, with their CVs, are deleted after **6 months**.
9. Use British/Nigerian English. Explain every acronym the first time it appears. Name regulators exactly. Write for international readers.
10. Never invent testimonials, bios, figures, client names or logos. Never show client data, staff names or prospect lists from Drive.
11. **Banned vocabulary** (CI word check): unlock, empower, seamless, leverage, cutting-edge, robust, holistic, "in today's fast-paced world", journey, elevate. The tagline is the only exception.

## 3. Legal-wording decisions (owner ruling)

Of the 22 items in the strategy doc's legal-rule table, **only items 20 and 22 are applied**. Every other item keeps its v1 wording, by owner decision, including items 1, 2, 13 and 16, which the owner explicitly confirmed.

- **Apply item 20:** in the Corporate School articles, change reader notes such as "obtain appropriate legal advice" to "seek specialist professional advice for your situation", or to the standard "For general information only" note.
- **Apply item 22:** keep the 301 redirect `/services/legal-partnership-and-regulatory-business-support` → the CR-07 page. That URL appears only in `_redirects`, never in links, the sitemap or page text.
- **Keep v1 wording:** the FAQ "Is SCS a law firm?" answer (item 1); the About standards sentence (item 2); the Terms scope clause (item 13); and the Founder's display name and credentials, `Stephen Onyekeja, Esq.` with `LL.B., BL, ACArb, CDPO, ACA (in view)` (item 16). The other kept items are 3–12, 14, 15, 17, 18, 19 and 21.
- The services that retain v1 lines (SA-11, CS-07, CR-07, FA-08, HO-09) keep their v1 service lines.
- The CI legal-word scan **reports** matches as a list for review and does not fail the build. It allow-lists the kept passages above.
- JSON-LD uses `Organization` + `ProfessionalService` types only.

## 4. Design

- **Direction B is chosen.** Headings H1 and H2 use **Source Serif 4** (600). Everything else uses **Inter** (400/500/600). Self-host both, subset to Latin and Latin Extended.
- **The tower motif is the SCS symbol** (the logo mark). It appears in the home page hero on every screen size and **must never be removed**.
  - Use the existing exact vector, `src/components/sections/HeroSkyline.tsx` (also exported as `design/tower.svg`). Never redraw or approximate it.
  - In v1 it is hidden on mobile (`hidden md:block`). In v2 it shows on mobile too, as a 116px-tall mark over a gold rule, beside the tagline.
- **Navigation:** Home · Services · Clients · Process · Partnership · Insights · About. On the right: "Request a proposal" (text link) and "Book a Discovery Call" (primary button).
  - "Clients" replaces "Who we help" (`/clients`).
  - "Process" replaces "How we work" (`/process`).
- **Mobile home page must be short:**
  - horizontal scroll-snap carousels for the process steps, case studies and guides;
  - a collapsed `<details>` for the registration record and for "What partners receive";
  - Start-here rows without descriptions;
  - figures in a 2×2 grid.

  Nothing is removed; content is only condensed.
- **Mobile bar:** Call / WhatsApp / Book a call on every page.
- Design-system tokens: `design-system/tokens.json` (unchanged colours). Add the serif heading family to the website type group.

## 5. Services and structure

- There are **66 services in 7 clusters**, named in terms professional service firms use worldwide: Strategy & Advisory · Company Formation & Secretarial · Compliance & Regulatory · Finance & Accounting · HR & Operations · Technology & Digital · Marketing & Communications.
- The single source of truth is `03-services.v2.json`. All 45 internal catalogue services are current (Drive Services reset, 3 November 2026).
- Industries are merged from 15 to 6 (`04-industries.v2.json`).
- The process is six steps (Drive "02 How Work Runs"): Enquiry → Understand the need → Propose → Agree → Deliver (with review) → Hand over and close.
