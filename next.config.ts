import type { NextConfig } from "next";

// Content Security Policy for the public site (every path except /admin, the Decap CMS editor, which needs
// api.github.com, api.netlify.com and GitHub-hosted images and keeps the minimal policy from netlify.toml).
// 'unsafe-inline' in script-src stays: Next.js inlines its hydration data in <script> tags and the site is
// statically generated, so per-request nonces (which need dynamic rendering) are not possible. Everything else
// is same-origin, except Plausible (script + event endpoint), which only loads after analytics consent.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://plausible.io",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://plausible.io",
  "manifest-src 'self'",
  "frame-src 'none'",
  "worker-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// Same values as netlify.toml (kept in step). HSTS is max-age only: never includeSubDomains/preload here.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
];

const nextConfig: NextConfig = {
  // "Academy" is now "Corporate College" — keep old links and search rankings working.
  async redirects() {
    return [
      { source: "/academy", destination: "/corporate-college", permanent: true },
      { source: "/academy/:path*", destination: "/corporate-college/:path*", permanent: true },
    ];
  },
  poweredByHeader: false,
  // On Netlify, netlify.toml [[headers]] only reach static files; pages rendered by Next.js need them here too.
  async headers() {
    return [
      { source: "/:path*", headers: SECURITY_HEADERS },
      { source: "/((?!admin).*)", headers: [{ key: "Content-Security-Policy", value: CSP }] },
    ];
  },
};

export default nextConfig;
