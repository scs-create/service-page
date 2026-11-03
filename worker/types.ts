// The slices of the Cloudflare bindings the Worker uses, written structurally so the Worker typechecks both with
// @cloudflare/workers-types (worker/tsconfig.json) and in the site's own TypeScript program (which imports the Worker
// in its tests). The real D1Database, R2Bucket and RateLimit bindings satisfy these.
export interface D1Like {
  prepare(sql: string): { bind(...values: unknown[]): { run(): Promise<unknown>; all<T = Record<string, unknown>>(): Promise<{ results: T[] }> } };
}
export interface R2Like {
  put(key: string, value: ArrayBuffer | Uint8Array, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  delete(keys: string | string[]): Promise<void>;
  get(key: string): Promise<{ body: ReadableStream | null; httpMetadata?: { contentType?: string } } | null>;
}
export interface RateLimitLike {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  DB?: D1Like;
  UPLOADS?: R2Like;
  RATE_LIMITER?: RateLimitLike;
  // Secrets (Cloudflare dashboard or `wrangler secret put`), never in the repository.
  ADMIN_USER?: string;
  ADMIN_PASSWORD?: string;
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  GITHUB_CLIENT_ID?: string; // CMS sign-in (GitHub OAuth App, owner checklist step 12)
  GITHUB_CLIENT_SECRET?: string;
  FILE_LINK_SECRET?: string; // signs the 15-minute file links in /admin/submissions
  // Cloudflare Access (owner checklist steps 10–11); not secret, but kept out of the repository with the rest.
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  // Plain vars (wrangler.jsonc).
  MAIL_FROM?: string;
  MAIL_REPLY_TO?: string;
  NOTIFY_SALES?: string;
  NOTIFY_CONTACT?: string;
  SITE_URL?: string;
  BOOKING_URL?: string;
}
