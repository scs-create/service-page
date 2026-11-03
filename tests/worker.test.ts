// v2 Worker skeleton: routes, honest "not live" answers and security headers on Worker responses.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { type Env } from "../worker/index";
import { ADMIN_CSP, SECURITY_HEADERS } from "../worker/headers";

const served: string[] = [];
const env: Env = {
  ADMIN_USER: "editor",
  ADMIN_PASSWORD: "test-only",
  ASSETS: {
    async fetch(request: Request) {
      served.push(new URL(request.url).pathname);
      return new Response("static", { status: 200, headers: { "Content-Security-Policy": "script-src 'self'" } });
    },
  },
};
const call = (path: string, method = "GET", headers: Record<string, string> = {}) =>
  worker.fetch(new Request("https://example.test" + path, { method, headers }), env);
const login = { authorization: "Basic " + Buffer.from("editor:test-only").toString("base64") };

test("worker: forms fail closed until D1 and the Turnstile secret are configured; GET is refused", async () => {
  const r = await call("/api/forms/proposal", "POST");
  assert.equal(r.status, 503);
  assert.equal((await r.json()).error, "not_configured");
  assert.equal((await call("/api/forms/proposal")).status, 405);
  assert.equal((await call("/api/forms/nope", "POST")).status, 404);
});

test("worker: CMS auth and unknown API routes", async () => {
  assert.equal((await call("/api/auth")).status, 503); // CMS sign-in not configured in this test env
  assert.equal((await call("/api/callback")).status, 503);
  assert.equal((await call("/api/other")).status, 404);
  // /ingest is the PostHog proxy now (tests/analytics.test.ts)
});

test("worker: Worker responses carry the security headers", async () => {
  const r = await call("/api/auth");
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) assert.equal(r.headers.get(k), v);
  assert.equal(r.headers.get("Cache-Control"), "no-store");
});

test("worker: /admin asks for the password, with the admin headers on the challenge too", async () => {
  const r = await call("/admin");
  assert.equal(r.status, 401);
  assert.equal(r.headers.get("Content-Security-Policy"), ADMIN_CSP);
  assert.equal(r.headers.get("Cache-Control"), "no-store");
});

test("worker: /admin passes through to static assets after login", async () => {
  const r = await call("/admin/", "GET", login);
  assert.equal(r.status, 200);
  assert.equal(served.at(-1), "/admin/");
  assert.equal(r.headers.get("Content-Security-Policy"), ADMIN_CSP); // replaces, never joins, the asset's policy
  assert.equal(r.headers.get("X-Frame-Options"), "DENY");
  assert.equal(r.headers.get("X-Robots-Tag"), "noindex, nofollow");
});

test("worker: the strict public policy never gains unsafe-eval", async () => {
  const r = await call("/about");
  assert.equal(r.headers.get("Content-Security-Policy"), "script-src 'self'");
  assert.ok(!(await call("/api/auth")).headers.get("Content-Security-Policy")!.includes("unsafe-eval"));
});
