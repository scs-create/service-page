// Cloudflare Access for /admin/* (docs/v2/06-TECH-SPEC.md §6–§7). Access blocks unauthenticated visitors at the edge;
// the Worker also validates the token Access adds, so a request that reached the Worker some other way (for example a
// workers.dev or preview URL that Access does not cover) is still refused. Per Cloudflare's guidance: read the
// Cf-Access-Jwt-Assertion header, match its kid against the team's certs (RS256), check iss, aud and expiry.
//   ACCESS_TEAM_DOMAIN  e.g. "scs.cloudflareaccess.com"  (Zero Trust team domain, owner checklist step 11)
//   ACCESS_AUD          the Access application's Audience (AUD) tag
// While both are unset, /admin keeps the v1 password gate (worker/admin-auth.ts).
import type { Env } from "./types";

type Jwk = JsonWebKey & { kid?: string };
let cache: { team: string; keys: Jwk[]; at: number } | null = null;

const b64urlToBytes = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=")), (c) => c.charCodeAt(0));
const b64urlJson = (s: string) => JSON.parse(new TextDecoder().decode(b64urlToBytes(s)));

async function keysFor(team: string, fetcher: typeof fetch): Promise<Jwk[]> {
  if (cache && cache.team === team && Date.now() - cache.at < 10 * 60 * 1000) return cache.keys;
  const res = await fetcher(`https://${team}/cdn-cgi/access/certs`);
  const data = (await res.json()) as { keys?: Jwk[] };
  cache = { team, keys: data.keys ?? [], at: Date.now() };
  return cache.keys;
}

export type AccessResult = { ok: true; email?: string } | { ok: false; reason: string };

export async function verifyAccess(request: Request, env: Env, fetcher: typeof fetch = fetch, now = Date.now()): Promise<AccessResult> {
  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return { ok: false, reason: "missing" };
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "malformed" };
  let header: { alg?: string; kid?: string };
  let claims: { iss?: string; aud?: string | string[]; exp?: number; nbf?: number; email?: string };
  try {
    header = b64urlJson(parts[0]);
    claims = b64urlJson(parts[1]);
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (header.alg !== "RS256") return { ok: false, reason: "alg" };
  const jwk = (await keysFor(env.ACCESS_TEAM_DOMAIN!, fetcher)).find((k) => k.kid === header.kid);
  if (!jwk) return { ok: false, reason: "kid" };
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlToBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
  if (!valid) return { ok: false, reason: "signature" };
  if (claims.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return { ok: false, reason: "iss" };
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!aud.includes(env.ACCESS_AUD)) return { ok: false, reason: "aud" };
  const t = Math.floor(now / 1000);
  if (!claims.exp || claims.exp < t || (claims.nbf && claims.nbf > t + 60)) return { ok: false, reason: "expired" };
  return { ok: true, email: claims.email };
}

export const accessConfigured = (env: Env) => !!(env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD);
export const resetAccessCache = () => {
  cache = null;
};
