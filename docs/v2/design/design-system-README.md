> NOTE (3 Nov 2026): this is a copy of the SCS design system README. Where it disagrees with 02-DECISIONS.md, the decisions file wins: the phone number is now +234 812 813 8222, the full name is "Stephen Corporate Services - SCS Ltd", Direction B adds Source Serif 4 for H1/H2 on the website, and the service cluster names follow 03-services.v2.json.

Stephen Corporate Services Ltd (SCS) is a multidisciplinary corporate services, business support, consulting and advisory company in Abuja, serving businesses across Nigeria and cross-border markets. The brand is royal blue, navy and gold: structured, documented, accountable. Tagline: **Elevate Your Company, Go Global.**

Use this system for the website and anything digital. The `deck-*` tokens and the "Decks & print" type group are for presentations and printed documents only.

## Voice and content

SCS sounds like a senior adviser who has already done the work: plain, confident, specific, never salesy.

- **Lead with structure and outcomes, not paperwork.** "We focus on practical business outcomes, not merely paperwork." "A Business Support Partner, Not Just a Registration Office."
- **Use parallel triplets and pairs.** "Build with structure. Operate with confidence. Grow with purpose." "One partner. Multiple solutions. One business objective." "From idea to company. From structure to strategy." Use them for heroes and closings only — once per page.
- **Write as "we" (SCS) to "you"/"the business".** Name the firm "SCS" after first using "Stephen Corporate Services Ltd (SCS)".
- **Prove, don't claim.** Every number is work already delivered ("3,000+ business registrations approved by the CAC since 2025", "1,800+ agreements processed"). Name clients only with consent and with their RC number; withhold confidential commercial detail. Never invent testimonials, bios or stats — omit the section instead.
- **British/Nigerian English:** organisation, programme, licence (noun), enquiry. Dates "3 February 2026". Phone "+234 906 403 5713". Currency "₦20,000,000".
- **Casing:** Title Case for page and section titles ("What Sets Our Work Apart" or sentence case — match the page); sentence case for buttons, verb first ("Book Consultation", "View all services", "Discuss a package"); UPPERCASE only via the `eyebrow` and `label` styles.
- **Name regulators exactly:** Corporate Affairs Commission (CAC), Nigeria Revenue Service (NRS), Nigeria Data Protection Commission, Trademarks, Patents and Designs Registry.
- No emoji. Arrows "→" end text links ("Read the case study →"); "↗" marks links that open a new tab.
- The five-stage framework is always **Assess → Structure → Comply → Improve → Grow** ("The SCS Enterprise Scale System™"). The six service clusters are Start & Structure, Compliance & Regulatory, Finance & Tax, People & Operations, Technology & Data, Growth & Market Presence.
- Articles (Corporate School) are practical guides: a plain promise in the subtitle ("A professional guide to defining service obligations…"), numbered sections, short lists, one worked example ("Example: Rather than describing an engagement simply as business support, specify…").

## Colour

One fixed light theme. Navy and blue are **bands**, not a dark mode: wrap a section in `.scs-dark` (`secondary`) or `.scs-band-blue` (`primary`) and every component inside switches to its on-dark colours.

- Pages are `bg` white, alternating with `surface` sections. Headings and body in `text`; supporting copy in `muted`.
- `primary` royal blue carries action: buttons, links, eyebrows, active nav, the metrics band.
- `secondary` navy carries weight: the home hero, every PageHero, the process band, the closing band, the footer, table heads.
- `accent` gold is the signature **line**: the 56×4px rule under every SectionHeading, the 4px top edge of cards, the bottom edge of PageHero and top edge of the footer, step numerals and the gold-filled CTA on navy.
- **Gold is never text on white** (1.75:1). Gold text only on `secondary` (9.8:1) or `primary` (5.2:1). On a gold fill, text is `secondary`.
- On navy/blue: titles `on-dark`, supporting text `on-dark-muted`, outlines `on-dark-outline`, dividers `on-dark-divider`.
- `success` and `error` always come with words ("Request received.", an error sentence, a required asterisk with "Required field" explained).
- `border` is decorative (1.3:1). The site uses it for input outlines too; it is kept exact, so give inputs clear labels and rely on the focus ring.

| Ground | Text | Ratio |
| --- | --- | --- |
| `bg` | `text` / `muted` / `primary` | 17.8 / 6.9 / 9.1 |
| `surface` | `text` / `muted` / `primary` | 16.3 / 6.4 / 8.3 |
| `secondary` | `on-dark` / `on-dark-muted` / `accent` | 17.2 / 12.5 / 9.8 |
| `primary` | `on-dark` / `on-dark-muted` / `accent` | 9.1 / 7.0 / 5.2 |
| `accent` | `secondary` | 9.8 |

## Type

Inter for everything on the web (`sans`), weights 400, 500, 600 — headings are 600, never 700. Headings carry −0.01em tracking and balanced wrapping.

- Home hero H1: `display`. Inner page H1: `page-title` (in PageHero only). Section titles: `h2`. Card titles: `h3`, smaller cards `h4`.
- Intros: `lead` in `muted`. Body: `body` (16/1.5). Card copy, labels, footer: `small`. Dates, hints, legal: `caption`.
- Kickers: `eyebrow` (UPPERCASE, 0.05em) above every section and page title. Card categories: `label`.
- Figures: `stat` and `step-number`, tabular numerals.
- Mobile sizes step down: `display` 36px, `page-title` 30px, `h2` 30/36px, `lead` 16px, `stat` 36px.

Decks and print use Fraunces Bold for titles and big numbers (`deck-cover-title`, `deck-title`, `deck-stat`, `deck-card-title`) and Public Sans for the rest (`deck-eyebrow` UPPERCASE with wide tracking, `deck-section-label`, `deck-body`). Don't use Fraunces on the website.

## Layout, spacing, shape

- Content sits in a `container-max` 1280px column with gutters of `space-3` (mobile), 24px (tablet), `space-5` (desktop).
- Sections breathe: `space-7` (64px) vertical padding on mobile, 80px on desktop; heroes and closing bands `space-8` (96px).
- Card padding `space-4` (24px); grids gap 20–24px; three columns of cards on desktop, four for short differentiators, five for the process.
- Square-shouldered: `radius-md` (8px) for buttons and cards, `radius-sm` (4px) for inputs and tags, `radius-full` only for monograms, package discs and progress bars.
- Separate surfaces with a 1px `border` hairline plus a 4px `accent` top edge (`border-accent`) — not with shadows, and never a coloured left edge on cards (left edges are only for DeliveryModes and form messages).
- Every interactive target is at least `touch-target` 44px tall.
- Keep headings to `measure-heading` (70ch) and hero intros to `measure-body` (65ch).

## Motion and states

- Cards lift on hover: translateY(−3px) with `shadow-lift`, 0.2s ease. Sections fade up 16px as they scroll into view (CSS scroll-driven, no JS). Stats count up once.
- All motion is off under `prefers-reduced-motion`.
- Hover: `primary` buttons go `secondary`; gold buttons go white; links underline; on navy, links turn `accent`.
- Focus: a 2px solid `focus-ring` outline with 2px offset; inside navy bands the ring is `focus-ring-dark` (gold). Never remove it.
- Selection highlight is `accent` with `secondary` text.
- Form errors show only after the user has interacted (`:user-invalid`): `error` border plus a 1px `error` ring.

## Imagery and iconography

- The logo and the HeroSkyline motif are the brand's pictures. The skyline (three towers, gold band, gold baseline) appears once, in the Home hero. Logo rules are in the Logos asset group.
- Proof is shown as documents, not stock photography: certificates from the Certificates group in the CertificateGallery, watermarked "SCS · FOR VERIFICATION ONLY".
- No icon library. The site uses typographic glyphs (→ ↗ ▼ ▲ + − ✕ ☰ •) and one inline check icon in `success` for delivered items. Don't add decorative icons or emoji; if an icon set is ever needed, choose a single-weight outline set and flag it here.
- Leadership photos are circular; until supplied, a navy monogram with gold initials stands in.

## Components

Load `tokens.css`, `components/bundle.css` (it also loads Inter, Public Sans and Fraunces from Google Fonts), React 18 and `components/bundle.js`; components are on `window.SCS`. Wrap rendered UI in an element with class `scs`; make navy bands with `scs-dark` and blue bands with `scs-band-blue`.

Typical page: Header → PageHero (with Breadcrumbs) → sections opening with SectionHeading → a closing navy band with ClosingStatement and an `accent` + `outlineLight` Button pair → Footer → CookieBanner.
