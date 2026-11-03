// Cloudflare Worker in front of the static export (docs/v2/06-TECH-SPEC.md §1). Static files are served by
// Workers Static Assets directly; only the paths in wrangler.jsonc `assets.run_worker_first` reach this code.
// Responses made here bypass public/_headers, so they get the same security headers from SECURITY_HEADERS.
//
// PR 1 is the skeleton: the routes exist and answer honestly until their PR wires them up.
//   /api/forms/:form   forms PR (Turnstile, D1, R2, Resend)
//   /api/auth, /api/callback   CMS PR (GitHub OAuth for Decap)
//   /ingest/*          analytics PR (PostHog EU proxy)
//   /admin/*           password gate (worker/admin-auth.ts, as in v1) + ADMIN_CSP; Cloudflare Access in the CMS PR
import { adminGate } from "./admin-auth";
import { ADMIN_CSP, SECURITY_HEADERS } from "./headers";

// Only the default export may be exported from the entry module: Workers treats every named export as an entrypoint.
export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  ADMIN_USER?: string; // Worker secrets, never in the repository
  ADMIN_PASSWORD?: string;
}

async function admin(request: Request, env: Env): Promise<Response> {
  const res = adminGate(request, env.ADMIN_USER, env.ADMIN_PASSWORD) ?? (await env.ASSETS.fetch(request));
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  headers.set("Content-Security-Policy", ADMIN_CSP);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...SECURITY_HEADERS },
  });
}

async function route(request: Request, env: Env): Promise<Response> {
  const { pathname } = new URL(request.url);

  if (/^\/api\/forms\/[a-z0-9-]+\/?$/.test(pathname)) {
    if (request.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
    return json(503, { ok: false, error: "not_live", message: "This form is not live yet." });
  }
  if (pathname === "/api/auth" || pathname === "/api/callback") return json(501, { ok: false, error: "not_implemented" });
  if (pathname.startsWith("/api/")) return json(404, { ok: false, error: "not_found" });
  if (pathname === "/ingest" || pathname.startsWith("/ingest/")) return json(404, { ok: false, error: "not_found" });

  if (pathname === "/admin" || pathname.startsWith("/admin/")) return admin(request, env);

  // Anything else that reaches the Worker: serve the static file, keeping its own headers.
  return env.ASSETS.fetch(request);
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await route(request, env);
    } catch {
      return json(500, { ok: false, error: "server_error" });
    }
  },

  // Daily 01:00 UTC (02:00 WAT): six-month retention purge of D1 rows and R2 uploads, added with the forms PR.
  async scheduled(): Promise<void> {},
};

export default worker;
