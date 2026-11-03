// v2 Worker skeleton: routes, honest "not live" answers and security headers on Worker responses.
import { test } from "node:test";
import assert from "node:assert/strict";
import worker, { type Env } from "../worker/index";
import { ADMIN_CSP, SECURITY_HEADERS } from "../worker/headers";

const served: string[] = [];
const env: Env = {
  ASSETS: {
    async fetch(request: Request) {
      served.push(new URL(request.url).pathname);
      return new Response("static", { status: 200, headers: { "Content-Security-Policy": "script-src 'self'" } });
    },
  },
};
const call = (path: string, method = "GET") => worker.fetch(new Request("https://example.test" + path, { method }), env);

test("worker: forms are not live yet", async () => {
  const r = await call("/api/forms/proposal", "POST");
  assert.equal(r.status, 503);
  assert.equal((await r.json()).error, "not_live");
  assert.equal((await call("/api/forms/proposal")).status, 405);
});

test("worker: CMS auth and unknown API routes", async () => {
  assert.equal((await call("/api/auth")).status, 501);
  assert.equal((await call("/api/callback")).status, 501);
  assert.equal((await call("/api/other")).status, 404);
  assert.equal((await call("/ingest/e")).status, 404);
});

test("worker: Worker responses carry the security headers", async () => {
  const r = await call("/api/auth");
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) assert.equal(r.headers.get(k), v);
  assert.equal(r.headers.get("Cache-Control"), "no-store");
});

test("worker: /admin passes through to static assets", async () => {
  const r = await call("/admin/");
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
