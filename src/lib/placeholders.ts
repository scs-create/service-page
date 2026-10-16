// Exact client-placeholder strings (see docs/CLIENT_PLACEHOLDERS.md). They render ONLY on preview /
// branch deploys (NEXT_PUBLIC_SHOW_CLIENT_PLACEHOLDERS=true, set in netlify.toml) — never on production.
export const SHOW_PLACEHOLDERS = process.env.NEXT_PUBLIC_SHOW_CLIENT_PLACEHOLDERS === "true";

export const PH = {
  positioning: "[CLIENT TO CONFIRM: positioning wording]",
  metrics: "[CLIENT TO CONFIRM: metrics – use website ZIP figures until confirmed]",
  address: "[CLIENT TO CONFIRM: address – Karsana]",
  primaryEmail: "[CLIENT TO CONFIRM: primary email]",
  taxonomy: "[CLIENT TO CONFIRM: service taxonomy mapping]",
  whatsapp: "[CLIENT TO SUPPLY: WhatsApp number confirmation]",
  bios: "[CLIENT TO SUPPLY: leadership bios and approved photos]",
  testimonials: "[CLIENT TO SUPPLY: real consented testimonials]",
  verification: "[CLIENT TO SUPPLY: verification document uploads]",
  blog: "[CLIENT TO SUPPLY: replacement blog posts]",
  ip: "[CLIENT TO CONFIRM: IP filing vs registration status and client permission]",
  programmes: "[CLIENT TO SUPPLY: ten signature programmes — not found in the Growth Portfolio deck]",
  booking: "[CLIENT TO SUPPLY: Cal.com / Calendly booking link]",
} as const;
