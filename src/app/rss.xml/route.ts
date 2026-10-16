import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/site";

export const dynamic = "force-static";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = getAllPosts().map((p) => `<item><title>${esc(p.title)}</title><link>${SITE.url}/corporate-college/corporate-school/${p.slug}</link><guid>${SITE.url}/corporate-college/corporate-school/${p.slug}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.excerpt)}</description></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(SITE.name)} — Corporate School</title><link>${SITE.url}/corporate-college/corporate-school</link><description>Insights on our services, corporate-world updates, and business learnings.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
