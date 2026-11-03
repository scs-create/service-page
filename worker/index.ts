// Cloudflare Worker in front of the static export (docs/v2/06-TECH-SPEC.md §1). Static files are served by
// Workers Static Assets directly; only the paths in wrangler.jsonc `assets.run_worker_first` reach this code.
// Responses made here bypass public/_headers, so they get the same security headers from SECURITY_HEADERS.
//
// Routes:
//   /api/forms/:form   form submissions: Turnstile, rate limit, zod, D1, R2, Resend (worker/forms.ts)
//   /api/auth, /api/callback   GitHub OAuth for Decap CMS (worker/oauth.ts)
//   /ingest/*          PostHog EU reverse proxy (worker/ingest.ts); analytics itself stays consent-gated
//   /admin/*           Cloudflare Access token check (worker/access.ts) when configured, otherwise the v1 password gate;
//                      /admin/submissions is the staff view of form submissions (worker/submissions.ts)
import { accessConfigured, verifyAccess } from "./access";
import { adminGate } from "./admin-auth";
import { handleForm } from "./forms";
import { ADMIN_CSP, SECURITY_HEADERS, SUBMISSIONS_CSP } from "./headers";
import { proxyIngest } from "./ingest";
import { finishAuth, startAuth } from "./oauth";
import { handleSubmissions } from "./submissions";
import { purgeOld } from "./retention";
import type { Env } from "./types";

// Only the default export may be a value export: Workers treats every named value export as an entrypoint.
export type { Env };

// Access replaces the password gate once it is configured (the spec's "Cloudflare Access in front of /admin").
async function gate(request: Request, env: Env): Promise<Response | null> {
  if (!accessConfigured(env)) return adminGate(request, env.ADMIN_USER, env.ADMIN_PASSWORD);
  const result = await verifyAccess(request, env);
  return result.ok ? null : new Response("Sign in through Cloudflare Access to open the admin area.", { status: 403, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

async function admin(request: Request, env: Env, pathname: string): Promise<Response> {
  const submissions = pathname === "/admin/submissions" || pathname.startsWith("/admin/submissions/");
  const res = (await gate(request, env)) ?? (submissions ? await handleSubmissions(request, env, pathname) : await env.ASSETS.fetch(request));
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) headers.set(k, v);
  headers.set("Content-Security-Policy", submissions ? SUBMISSIONS_CSP : ADMIN_CSP);
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

async function route(request: Request, env: Env, ctx?: { waitUntil(p: Promise<unknown>): void }): Promise<Response> {
  const { pathname } = new URL(request.url);

  const formMatch = pathname.match(/^\/api\/forms\/([a-z0-9-]+)\/?$/);
  if (formMatch) {
    if (request.method !== "POST") return json(405, { ok: false, error: "method_not_allowed" });
    const reply = await handleForm(request, env, formMatch[1]);
    return json(reply.status, reply.body);
  }
  if (pathname === "/api/auth" || pathname === "/api/callback") {
    const res = pathname === "/api/auth" ? startAuth(request, env) : await finishAuth(request, env);
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(SECURITY_HEADERS)) if (k !== "Content-Security-Policy" || !headers.has(k)) headers.set(k, v);
    return new Response(res.body, { status: res.status, headers });
  }
  if (pathname.startsWith("/api/")) return json(404, { ok: false, error: "not_found" });
  if (pathname === "/ingest" || pathname.startsWith("/ingest/")) return proxyIngest(request, ctx);

  if (pathname === "/admin" || pathname.startsWith("/admin/")) return admin(request, env, pathname);

  // Anything else that reaches the Worker: serve the static file, keeping its own headers.
  return env.ASSETS.fetch(request);
}

const worker = {
  async fetch(request: Request, env: Env, ctx?: { waitUntil(p: Promise<unknown>): void }): Promise<Response> {
    try {
      return await route(request, env, ctx);
    } catch {
      return json(500, { ok: false, error: "server_error" });
    }
  },

  // Daily 01:00 UTC (02:00 WAT): six-month retention purge of D1 rows and their R2 uploads.
  async scheduled(_event: unknown, env: Env): Promise<void> {
    await purgeOld(env);
  },
};

export default worker;
