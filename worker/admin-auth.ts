// Password gate for /admin (Decap CMS), in front of the CMS's own GitHub login. Carried over from v1 so /admin is
// never less protected than today; Cloudflare Access replaces it in the CMS PR.
// The username and password live ONLY in the Worker secrets ADMIN_USER and ADMIN_PASSWORD (set with
// `wrangler secret put` or in the Cloudflare dashboard), never in the repository.
// If either is missing, /admin stays locked (fail closed) instead of falling open.

// Compares in time that does not depend on where the strings differ.
export function safeEqual(a: string, b: string): boolean {
  const x = new TextEncoder().encode(a);
  const y = new TextEncoder().encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  return diff === 0;
}

// "Basic base64(user:pass)" → true when both match. The password may itself contain ":".
export function checkBasicAuth(header: string | null, user: string, pass: string): boolean {
  if (!header?.startsWith("Basic ")) return false;
  let decoded: string;
  try {
    decoded = new TextDecoder().decode(Uint8Array.from(atob(header.slice(6).trim()), (c) => c.charCodeAt(0)));
  } catch {
    return false;
  }
  const i = decoded.indexOf(":");
  if (i < 0) return false;
  const userOk = safeEqual(decoded.slice(0, i), user);
  const passOk = safeEqual(decoded.slice(i + 1), pass);
  return userOk && passOk;
}

// null = let the request through; otherwise the locked or challenge response (headers are added by the caller).
export function adminGate(request: Request, user: string | undefined, pass: string | undefined): Response | null {
  const text = { "content-type": "text/plain; charset=utf-8" };
  if (!user || !pass) {
    return new Response("The admin area is locked: set the ADMIN_USER and ADMIN_PASSWORD Worker secrets.", { status: 503, headers: text });
  }
  if (checkBasicAuth(request.headers.get("authorization"), user, pass)) return null;
  return new Response("Authentication required.", {
    status: 401,
    headers: { ...text, "www-authenticate": 'Basic realm="SCS admin", charset="UTF-8"' },
  });
}
