# Client placeholders (exact strings)

These render ONLY on preview / branch deploys (`NEXT_PUBLIC_SHOW_CLIENT_PLACEHOLDERS=true`, set in `netlify.toml`).
Production hides them. The strings live in `src/lib/placeholders.ts`.

| Placeholder | Where it appears | Decision needed |
|---|---|---|
| `[CLIENT TO CONFIRM: positioning wording]` | Home, "Who we are" | Final one-line positioning (site currently says "multidisciplinary corporate services…") |
| `[CLIENT TO CONFIRM: metrics – use website ZIP figures until confirmed]` | Home, metrics strip | Confirm 3,000+ / 1,800+ / 1,200+ and the 3,000+ label |
| `[CLIENT TO CONFIRM: address – Karsana]` | Contact | Karsana vs Gwarinpa; Benhen vs Belham |
| `[CLIENT TO CONFIRM: primary email]` | Contact | Is `contact@` the primary public address? |
| `[CLIENT TO CONFIRM: service taxonomy mapping]` | Industries pages | Growth Portfolio's 21 service lines vs the site's 21 |
| `[CLIENT TO SUPPLY: WhatsApp number confirmation]` | Contact | Is +234 906 403 5713 active on WhatsApp? |
| `[CLIENT TO SUPPLY: leadership bios and approved photos]` | About, leadership cards | Bios + photos (add `bio` / `photo` in `src/content/leadership.ts`) |
| `[CLIENT TO SUPPLY: real consented testimonials]` | Home | Add via CMS → Testimonials (consent box is mandatory) |
| `[CLIENT TO SUPPLY: verification document uploads]` | Verification | Certificates / letters via CMS → Verification Documents |
| `[CLIENT TO CONFIRM: IP filing vs registration status and client permission]` | Services → IP page | Per item: filed or registered? Client permission? Then switch `permission` on |
| `[CLIENT TO SUPPLY: ten signature programmes — not found in the Growth Portfolio deck]` | Services | Supply the ten programmes (CMS → Signature Programmes) |
| `[CLIENT TO SUPPLY: Cal.com / Calendly booking link]` | Contact | Set `NEXT_PUBLIC_BOOKING_URL` in Netlify |
| `[CLIENT TO CONFIRM: SCA description]` | Corporate College | Final description of Stephen Corporate Academy |
| `[CLIENT TO CONFIRM: Partnership terms]` | Services (Partnership band) | Terms of Partnership / Quarterly Check-Up |
| `[CLIENT TO SUPPLY: replacement blog posts]` | Corporate School | The two sample posts are placeholders |

Legal-page placeholders are listed separately in `docs/legal-open-items.md`.
