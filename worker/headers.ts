// Headers for responses the Worker makes itself; public/_headers does not apply to them.
export const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  "Strict-Transport-Security": "max-age=31536000",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

// Decap CMS compiles its config schema at runtime (needs 'unsafe-eval') and talks to the GitHub API. This policy is
// for /admin only; the public site keeps the strict policy from public/_headers.
export const ADMIN_CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://avatars.githubusercontent.com https://raw.githubusercontent.com",
  "connect-src 'self' https://api.github.com https://raw.githubusercontent.com",
  "font-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

// /admin/submissions renders plain HTML and forms with no scripts at all.
export const SUBMISSIONS_CSP = "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'";
