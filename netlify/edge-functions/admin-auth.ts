// Password gate for /admin (Decap CMS), in front of the CMS's own GitHub login.
// The username and password live ONLY in Netlify environment variables ADMIN_USER and ADMIN_PASSWORD
// (Site configuration → Environment variables, marked secret), never in the repository.
// If either is missing, /admin stays locked (fail closed) instead of falling open.

declare const Netlify: { env: { get(name: string): string | undefined } };

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

const NO_STORE = { "cache-control": "no-store", "x-robots-tag": "noindex" };

export default async function adminAuth(request: Request, context: { next: () => Promise<Response> }) {
  const user = Netlify.env.get("ADMIN_USER");
  const pass = Netlify.env.get("ADMIN_PASSWORD");
  if (!user || !pass) {
    return new Response("The admin area is locked: set ADMIN_USER and ADMIN_PASSWORD in Netlify, then redeploy.", {
      status: 503,
      headers: { ...NO_STORE, "content-type": "text/plain; charset=utf-8" },
    });
  }
  if (checkBasicAuth(request.headers.get("authorization"), user, pass)) return context.next();
  return new Response("Authentication required.", {
    status: 401,
    headers: { ...NO_STORE, "content-type": "text/plain; charset=utf-8", "www-authenticate": 'Basic realm="SCS admin", charset="UTF-8"' },
  });
}

export const config = { path: ["/admin", "/admin/*"] };
