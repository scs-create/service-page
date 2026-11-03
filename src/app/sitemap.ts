import type { MetadataRoute } from "next";

export const dynamic = "force-static"; // static export (v2 on Cloudflare)
import { SITE } from "@/lib/site";
import { CLUSTERS, SERVICES } from "@/content/v2/catalogue";
import { portfolio } from "@/content/portfolio/data";
import { INDUSTRIES } from "@/content/v2/industries";
import { AUDIENCES } from "@/content/v2/pages";
import { TOPICS } from "@/content/v2/topics";
import { TOOLS } from "@/content/toolsList";
import { getAllPosts } from "@/lib/posts";
import { hasPlaceholders } from "@/lib/legal";
import type { LegalDocumentData } from "@/lib/types";
import terms from "@/content/legal/terms.json";
import privacy from "@/content/legal/privacy.json";
import cookies from "@/content/legal/cookies.json";

// lastModified is only set where a real date exists (posts). Static pages omit it rather than claim "now" (L-02).
// Legal pages are listed only once their placeholders are resolved (matches their noindex rule) (M-04).
export default function sitemap(): MetadataRoute.Sitemap {
  const legal = ([["/terms", terms], ["/privacy", privacy], ["/cookies", cookies]] as const)
    .filter(([, d]) => !hasPlaceholders(d as unknown as LegalDocumentData))
    .map(([path]) => ({ url: `${SITE.url}${path}`, priority: 0.3 }));
  const pages = ["", "/services", "/clients", "/process", "/partnership", "/partnership/remote-operations", "/portfolio", "/industries", "/tools", "/faq", "/verification", "/corporate-college", "/corporate-college/corporate-school", "/about", "/about/standards", "/career", "/contact", "/contact/proposal", "/accessibility", "/search", "/career/expert-network"];
  return [
    ...pages.map((r) => ({ url: `${SITE.url}${r}`, priority: r === "" ? 1 : 0.8 })),
    ...TOOLS.map((t) => ({ url: `${SITE.url}${t.href}`, priority: 0.7 })),
    ...CLUSTERS.map((c) => ({ url: `${SITE.url}${c.path}`, priority: 0.8 })),
    ...SERVICES.map((s) => ({ url: `${SITE.url}${s.path}`, priority: 0.7 })),
    ...portfolio.map((p) => ({ url: `${SITE.url}/portfolio/${p.slug}`, priority: 0.6 })),
    ...AUDIENCES.map((a) => ({ url: `${SITE.url}/clients/${a.slug}`, priority: 0.8 })),
    ...TOPICS.map((t) => ({ url: `${SITE.url}/corporate-college/corporate-school/topics/${t.slug}`, priority: 0.6 })),
    ...INDUSTRIES.map((i) => ({ url: `${SITE.url}${i.path}`, priority: 0.6 })),
    ...getAllPosts().map((p) => ({ url: `${SITE.url}/corporate-college/corporate-school/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 })),
    ...legal,
  ];
}
