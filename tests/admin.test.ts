// v2 CMS and staff access (docs/v2/06-TECH-SPEC.md §6–§7): GitHub OAuth for Decap, Cloudflare Access token checks,
// the submissions view and its 15-minute signed file links.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import worker from "../worker/index";
import { finishAuth, startAuth } from "../worker/oauth";
import { resetAccessCache, verifyAccess } from "../worker/access";
import { checkFileLink, handleSubmissions, signFileLink } from "../worker/submissions";
import type { Env } from "../worker/types";

const base: Env = { ASSETS: { fetch: async () => new Response("static") }, GITHUB_CLIENT_ID: "Iv1.test", GITHUB_CLIENT_SECRET: "test-secret" };

test("oauth: /api/auth redirects to GitHub with a state that is also set as an HttpOnly cookie", () => {
  const r = startAuth(new Request("https://site.test/api/auth?provider=github&scope=repo"), base, () => "state-123");
  assert.equal(r.status, 302);
  const loc = new URL(r.headers.get("location")!);
  assert.equal(loc.origin + loc.pathname, "https://github.com/login/oauth/authorize");
  assert.equal(loc.searchParams.get("state"), "state-123");
  assert.equal(loc.searchParams.get("redirect_uri"), "https://site.test/api/callback");
  assert.match(r.headers.get("set-cookie")!, /scs_oauth_state=state-123; Path=\/api; HttpOnly; Secure; SameSite=Lax/);
  assert.equal(startAuth(new Request("https://site.test/api/auth"), { ASSETS: base.ASSETS }).status, 503);
});

test("oauth: a callback with the wrong state never exchanges the code", async () => {
  let called = false;
  const fetcher = (async () => ((called = true), Response.json({ access_token: "x" }))) as typeof fetch;
  const r = await finishAuth(new Request("https://site.test/api/callback?code=c&state=evil", { headers: { cookie: "scs_oauth_state=good" } }), base, fetcher);
  assert.equal(called, false);
  assert.match(await r.text(), /authorization:github:error/);
});

test("oauth: success hands the token only to this site's origin, under a CSP that allows only that script", async () => {
  const fetcher = (async (u: string | URL | Request) => {
    assert.equal(String(u), "https://github.com/login/oauth/access_token");
    return Response.json({ access_token: "gho_test" });
  }) as typeof fetch;
  const r = await finishAuth(new Request("https://site.test/api/callback?code=c&state=s1", { headers: { cookie: "scs_oauth_state=s1" } }), base, fetcher);
  const html = await r.text();
  assert.match(html, /authorization:github:success:/);
  assert.match(html, /"https:\/\/site\.test"/); // postMessage target origin, never "*"
  assert.doesNotMatch(html, /postMessage\([^)]*"\*"/);
  const script = html.match(/<script>([\s\S]*?)<\/script>/)![1];
  const hash = createHash("sha256").update(script).digest("base64");
  assert.equal(r.headers.get("content-security-policy"), `default-src 'none'; script-src 'sha256-${hash}'; base-uri 'none'; frame-ancestors 'none'`);
});

// ---------- Cloudflare Access ----------
const b64url = (b: ArrayBuffer | Uint8Array | string) => Buffer.from(typeof b === "string" ? b : new Uint8Array(b as ArrayBuffer)).toString("base64url");
async function accessFixture() {
  const { publicKey, privateKey } = await crypto.subtle.generateKey({ name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]);
  const jwk = { ...(await crypto.subtle.exportKey("jwk", publicKey)), kid: "k1", alg: "RS256" };
  const sign = async (claims: Record<string, unknown>, kid = "k1") => {
    const head = b64url(JSON.stringify({ alg: "RS256", kid }));
    const body = b64url(JSON.stringify(claims));
    const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(`${head}.${body}`));
    return `${head}.${body}.${b64url(sig)}`;
  };
  const fetcher = (async () => Response.json({ keys: [jwk] })) as typeof fetch;
  const env: Env = { ...base, ACCESS_TEAM_DOMAIN: "scs.cloudflareaccess.com", ACCESS_AUD: "aud-tag" };
  return { sign, fetcher, env };
}
const reqWith = (token?: string) => new Request("https://site.test/admin/", token ? { headers: { "cf-access-jwt-assertion": token } } : {});

test("access: a valid token passes; wrong audience, issuer, expiry, key or a tampered token fail", async () => {
  resetAccessCache();
  const { sign, fetcher, env } = await accessFixture();
  const now = Date.now();
  const good = { iss: "https://scs.cloudflareaccess.com", aud: ["aud-tag"], exp: Math.floor(now / 1000) + 600, email: "sales@example.test" };
  assert.deepEqual(await verifyAccess(reqWith(await sign(good)), env, fetcher, now), { ok: true, email: "sales@example.test" });
  for (const [claims, reason] of [[{ ...good, aud: ["other"] }, "aud"], [{ ...good, iss: "https://evil.cloudflareaccess.com" }, "iss"], [{ ...good, exp: Math.floor(now / 1000) - 5 }, "expired"]] as const) {
    assert.equal((await verifyAccess(reqWith(await sign(claims)), env, fetcher, now)).ok, false, reason);
  }
  assert.equal((await verifyAccess(reqWith(await sign(good, "unknown")), env, fetcher, now)).ok, false);
  const t = (await sign(good)).split(".");
  const forged = [t[0], b64url(JSON.stringify({ ...good, email: "attacker@example.test" })), t[2]].join(".");
  assert.equal((await verifyAccess(reqWith(forged), env, fetcher, now)).ok, false);
  assert.equal((await verifyAccess(reqWith(), env, fetcher, now)).ok, false);
});

test("access: once configured, /admin refuses requests without an Access token (the password alone is not enough)", async () => {
  resetAccessCache();
  const { env } = await accessFixture();
  const withPassword = { ...env, ADMIN_USER: "editor", ADMIN_PASSWORD: "pw" };
  const r = await worker.fetch(new Request("https://site.test/admin/", { headers: { authorization: "Basic " + Buffer.from("editor:pw").toString("base64") } }), withPassword);
  assert.equal(r.status, 403);
});

// ---------- submissions view ----------
test("file links: valid for 15 minutes, refused when expired or tampered", async () => {
  const now = Date.UTC(2026, 10, 3, 10);
  const link = new URL("https://site.test" + (await signFileLink("secret", "cv/2026/SCS-2611-ABCD-cv.pdf", now)));
  assert.equal(await checkFileLink("secret", link, now + 14 * 60 * 1000), "cv/2026/SCS-2611-ABCD-cv.pdf");
  assert.equal(await checkFileLink("secret", link, now + 16 * 60 * 1000), null);
  link.searchParams.set("key", "cv/2026/SCS-2611-ZZZZ-cv.pdf");
  assert.equal(await checkFileLink("secret", link, now), null);
});

function db(rows: Record<string, unknown>[]) {
  const runs: { sql: string; args: unknown[] }[] = [];
  return {
    runs,
    DB: { prepare: (sql: string) => ({ bind: (...args: unknown[]) => ({ run: async () => void runs.push({ sql, args }), all: async <T,>() => ({ results: rows as T[] }) }) }) },
  };
}
const ROW = { ref: "SCS-2611-ABCD", form: "enquiry", request_type: "consultation", service_id: null, fields: JSON.stringify({ name: "<script>x</script>", email: "a@b.test" }), status: "new", created_at: "2026-11-03T10:00:00Z", file_keys: null, utm_source: null, utm_medium: null, utm_campaign: null };

test("submissions: the list escapes everything a visitor typed", async () => {
  const { DB } = db([ROW]);
  const r = await handleSubmissions(new Request("https://site.test/admin/submissions"), { ...base, DB }, "/admin/submissions");
  const html = await r.text();
  assert.match(html, /SCS-2611-ABCD/);
  assert.doesNotMatch(html, /<script>x<\/script>/);
  assert.match(html, /&lt;script&gt;x&lt;\/script&gt;/);
});

test("submissions: status changes only from this site, and only to a known status", async () => {
  const { DB, runs } = db([ROW]);
  const env = { ...base, DB };
  const post = (origin: string, status: string) =>
    handleSubmissions(new Request("https://site.test/admin/submissions/SCS-2611-ABCD/status", { method: "POST", headers: { origin, "content-type": "application/x-www-form-urlencoded" }, body: `status=${status}` }), env, "/admin/submissions/SCS-2611-ABCD/status");
  assert.equal((await post("https://evil.test", "closed")).status, 403);
  assert.equal((await post("https://site.test", "deleted")).status, 400);
  assert.equal((await post("https://site.test", "replied")).status, 303);
  assert.deepEqual(runs.at(-1)!.args, ["replied", "SCS-2611-ABCD"]);
});

test("cms config: the GitHub backend uses this site's /api/auth, with the v2 collections", () => {
  const cfg = fs.readFileSync("public/admin/config.yml", "utf8");
  assert.match(cfg, /auth_endpoint: api\/auth/);
  assert.match(cfg, /folder: "src\/content\/v2\/services"/);
  assert.match(cfg, /file: "src\/content\/v2\/clusters.json"/);
  assert.doesNotMatch(cfg.replace(/^\s*#.*$/gm, ""), /netlify/i);
});
