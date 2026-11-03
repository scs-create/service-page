// GitHub OAuth for Decap CMS (docs/v2/06-TECH-SPEC.md §7), replacing Netlify's OAuth provider.
//   GET /api/auth      → redirect to GitHub's authorize page, with a random state kept in an HttpOnly cookie
//   GET /api/callback  → check the state, exchange the code for a token, and hand the token to the CMS window that
//                        opened the popup, using Decap's postMessage handshake ("authorizing:github", then
//                        "authorization:github:success:{token,provider}") restricted to this site's own origin.
// The token never touches storage on the server. GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET are Worker secrets.
import type { Env } from "./types";

const STATE_COOKIE = "scs_oauth_state";
const SCOPES = new Set(["repo", "public_repo", "user", "read:user"]);

const html = (body: string, status = 200, extra: Record<string, string> = {}) =>
  new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Signing in</title></head><body>${body}</body></html>`, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", ...extra },
  });

function cookie(request: Request, name: string): string | undefined {
  return (request.headers.get("cookie") ?? "").split(/;\s*/).map((c) => c.split("=")).find(([k]) => k === name)?.[1];
}

export function startAuth(request: Request, env: Env, random: () => string = () => crypto.randomUUID()): Response {
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return html("<p>Sign-in is not configured yet.</p>", 503);
  const url = new URL(request.url);
  const scope = (url.searchParams.get("scope") ?? "repo").split(/[ ,]+/).filter((s) => SCOPES.has(s)).join(" ") || "repo";
  const state = random();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
  authorize.searchParams.set("redirect_uri", `${url.origin}/api/callback`);
  authorize.searchParams.set("scope", scope);
  authorize.searchParams.set("state", state);
  return new Response(null, {
    status: 302,
    headers: { Location: authorize.toString(), "Set-Cookie": `${STATE_COOKIE}=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`, "Cache-Control": "no-store" },
  });
}

// The popup page: tells the CMS it is ready, waits for the CMS to answer, then posts the result to that origin only.
// The script is inline, so the response carries its own CSP listing that script's SHA-256 hash: nothing else can run.
export async function handoff(origin: string, status: "success" | "error", content: unknown): Promise<Response> {
  const message = `authorization:github:${status}:${JSON.stringify(content)}`;
  const script = `(function(){var o=${JSON.stringify(origin)},m=${JSON.stringify(message)};function r(e){if(e.origin!==o)return;window.removeEventListener("message",r);window.opener.postMessage(m,o);setTimeout(function(){window.close()},200)}window.addEventListener("message",r);window.opener&&window.opener.postMessage("authorizing:github",o)})();`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(script));
  const hash = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Signing in</title></head><body><p>Signing in…</p><script>${script}</script></body></html>`, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Content-Security-Policy": `default-src 'none'; script-src 'sha256-${hash}'; base-uri 'none'; frame-ancestors 'none'`,
      "Set-Cookie": `${STATE_COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    },
  });
}

export async function finishAuth(request: Request, env: Env, fetcher: typeof fetch = fetch): Promise<Response> {
  const url = new URL(request.url);
  const origin = url.origin;
  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) return html("<p>Sign-in is not configured yet.</p>", 503);
  const state = url.searchParams.get("state");
  const expected = cookie(request, STATE_COOKIE);
  if (!state || !expected || state !== expected) return handoff(origin, "error", { message: "The sign-in request expired. Close this window and try again." });
  const code = url.searchParams.get("code");
  if (!code) return handoff(origin, "error", { message: "GitHub did not return a sign-in code." });

  const res = await fetcher("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json", "User-Agent": "scs-website" },
    body: JSON.stringify({ client_id: env.GITHUB_CLIENT_ID, client_secret: env.GITHUB_CLIENT_SECRET, code, redirect_uri: `${origin}/api/callback` }),
  });
  const data = (await res.json().catch(() => ({}))) as { access_token?: string; error_description?: string };
  if (!data.access_token) return handoff(origin, "error", { message: data.error_description ?? "GitHub sign-in failed." });
  return handoff(origin, "success", { token: data.access_token, provider: "github" });
}
