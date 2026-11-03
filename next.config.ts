import type { NextConfig } from "next";

// v2 runs on Cloudflare Workers Static Assets (docs/v2/06-TECH-SPEC.md §1): the site is a static export in out/.
// A static export cannot use next.config redirects, headers or the default image loader, so:
//   redirects        -> public/_redirects   (checked by scripts/check-site.mjs: every target must exist)
//   security headers -> public/_headers     (+ a per-page script-src with hashes, added by scripts/csp-hashes.mjs)
//   images           -> served as built (pre-optimised at build time in a later PR)
// Paths that the Worker answers (/api/*, /ingest/*, /admin/*) get their headers from worker/index.ts instead.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
