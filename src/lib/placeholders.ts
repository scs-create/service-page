// Exact client-placeholder strings (see docs/CLIENT_PLACEHOLDERS.md). They render ONLY on preview /
// branch deploys (NEXT_PUBLIC_SHOW_CLIENT_PLACEHOLDERS=true, set in netlify.toml) — never on production.
export const SHOW_PLACEHOLDERS = process.env.NEXT_PUBLIC_SHOW_CLIENT_PLACEHOLDERS === "true";

export const PH = {
  taxonomy: "[CLIENT TO CONFIRM: service taxonomy mapping]",
  testimonials: "[CLIENT TO SUPPLY: real consented testimonials]",
  verification: "[CLIENT TO SUPPLY: verification document uploads]",
  ip: "[CLIENT TO CONFIRM: IP filing vs registration status and client permission]",
  programmes: "[CLIENT TO SUPPLY: ten signature programmes, not found in the Growth Portfolio deck]",
} as const;
