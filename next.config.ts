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

const nextConfig: NextConfig = {
  // "Academy" is now "Corporate College" — keep old links and search rankings working.
  async redirects() {
    return [
      { source: "/academy", destination: "/corporate-college", permanent: true },
      { source: "/academy/:path*", destination: "/corporate-college/:path*", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/((?!admin).*)", headers: [{ key: "Content-Security-Policy", value: CSP }] }];
  },
};

export default nextConfig;
