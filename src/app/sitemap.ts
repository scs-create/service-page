import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { services } from "@/content/services/data";
import { portfolio } from "@/content/portfolio/data";
import { industries } from "@/content/loaders";
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
  const pages = ["", "/services", "/portfolio", "/industries", "/tools", "/faq", "/verification", "/corporate-college", "/corporate-college/corporate-school", "/about", "/career", "/contact"];
  return [
    ...pages.map((r) => ({ url: `${SITE.url}${r}`, priority: r === "" ? 1 : 0.8 })),
    ...TOOLS.map((t) => ({ url: `${SITE.url}${t.href}`, priority: 0.7 })),
    ...services.map((s) => ({ url: `${SITE.url}/services/${s.slug}`, priority: 0.7 })),
    ...portfolio.map((p) => ({ url: `${SITE.url}/portfolio/${p.slug}`, priority: 0.6 })),
    ...industries.map((i) => ({ url: `${SITE.url}/industries/${i.slug}`, priority: 0.6 })),
    ...getAllPosts().map((p) => ({ url: `${SITE.url}/corporate-college/corporate-school/${p.slug}`, lastModified: new Date(p.date), priority: 0.6 })),
    ...legal,
  ];
}
