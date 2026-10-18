# Client placeholders (exact strings)

These render ONLY on preview / branch deploys (`NEXT_PUBLIC_SHOW_CLIENT_PLACEHOLDERS=true`, set in `netlify.toml`).
Production hides them, and a section with nothing real to show is removed, not faked. The strings live in `src/lib/placeholders.ts`.

## Still open

| Placeholder | Where it appears | Decision needed |
|---|---|---|
| `[CLIENT TO CONFIRM: service taxonomy mapping]` | Industries pages | Growth Portfolio's 21 service lines vs the site's 21 |
| `[CLIENT TO SUPPLY: real consented testimonials]` | Home (section hidden in production) | Add via CMS → Testimonials (consent box is mandatory) |
| `[CLIENT TO SUPPLY: verification document uploads]` | Verification | Certificates / letters via CMS → Verification Documents (watermark first) |
| `[CLIENT TO CONFIRM: IP filing vs registration status and client permission]` | Services → IP page | Per item: filed or registered? Client permission? Then switch `permission` on |
| `[CLIENT TO SUPPLY: ten signature programmes — not found in the Growth Portfolio deck]` | Services (section hidden in production) | Supply the programmes (CMS → Signature Programmes) |
| `[CLIENT TO CONFIRM: SCA description]` | Corporate College | Final description of Stephen Corporate Academy |
| `[CLIENT TO CONFIRM: Partnership terms]` | Services (Partnership band) | Terms of Partnership / Quarterly Check-Up |

Leadership bios: none exist, so none are shown (no placeholder). Add a `bio` in `src/content/leadership.ts` only once the founders approve wording.

## Resolved (16 October 2026)

| Was | Decision |
|---|---|
| Positioning wording (Home, "Who we are") | Owner's positioning paragraph is live |
| Metrics | 3,000+ / 1,800+ / 1,200+ / 10+ confirmed; the 3,000+ label now reads "Business registrations guided through the CAC by our founding team" (achieved before SCS launched) |
| Address | SD20 Belham Estate, Karsana, FCT, Abuja (changed from "Benhen" on 18 October 2026) |
| Primary email | contact@stephencorporateservices-scs.com |
| Phone and WhatsApp | +234 812 813 8222 (changed from +234 906 403 5713 on 18 October 2026) |
| Leadership photos | Supplied; circular, optimised (`public/images/team/`). Signatures are never published |
| Booking link | Cal.com Discovery Call (free): `https://cal.com/support-stephen-corporate-services-scs/30min` |
| Blog posts | The two samples were replaced by the ten Corporate College articles |

Legal-page placeholders are listed separately in `docs/legal-open-items.md`.
