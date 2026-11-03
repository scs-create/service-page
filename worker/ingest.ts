// PostHog EU reverse proxy at /ingest (docs/v2/05-SITE-SPEC.md §7), following PostHog's Cloudflare Worker guide
// (posthog.com/docs/advanced/proxy/cloudflare, EU hosts). It replaces the v1 netlify.toml rewrites. Analytics still
// loads only after the visitor accepts it (src/components/ui/Analytics.tsx); this only carries the traffic.
//   /ingest/static/*, /ingest/array/*  → eu-assets.i.posthog.com (cached at the edge)
//   /ingest/*                          → eu.i.posthog.com (cookies dropped; only PostHog keys kept; client IP forwarded)
const API_HOST = "eu.i.posthog.com";
const ASSET_HOST = "eu-assets.i.posthog.com";

type CacheLike = { match(r: Request): Promise<Response | undefined>; put(r: Request, res: Response): Promise<void> };
type Ctx = { waitUntil(p: Promise<unknown>): void };

export async function proxyIngest(request: Request, ctx?: Ctx, fetcher: typeof fetch = fetch, cache?: CacheLike): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/ingest/, "") || "/";
  const target = path + url.search;

  if (path.startsWith("/static/") || path.startsWith("/array/")) {
    const store = cache ?? (typeof caches !== "undefined" ? (caches as unknown as { default: CacheLike }).default : undefined);
    const hit = await store?.match(request);
    if (hit) return hit;
    const res = await fetcher(`https://${ASSET_HOST}${target}`);
    if (store && res.ok) {
      const put = store.put(request, res.clone());
      if (ctx) ctx.waitUntil(put);
      else await put;
    }
    return res;
  }

  const headers = new Headers(request.headers);
  headers.delete("cookie");
  if (!/^Bearer ph[csx]_/.test(headers.get("authorization") ?? "")) headers.delete("authorization");
  headers.set("X-Forwarded-For", request.headers.get("cf-connecting-ip") ?? "");
  headers.delete("host");
  return fetcher(
    new Request(`https://${API_HOST}${target}`, {
      method: request.method,
      headers,
      body: request.method !== "GET" && request.method !== "HEAD" ? await request.arrayBuffer() : null,
      redirect: "manual",
    })
  );
}
