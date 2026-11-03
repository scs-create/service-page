// Related guides and case studies for a v2 service or cluster. Guides and case studies still name v1 service
// categories, so they are matched through each v2 service's v1 category (docs/v2/03-services.v2.json "v1Category").
import { getAllPosts, type Post } from "@/lib/posts";
import { getPortfolioForService } from "@/content/portfolio/data";
import type { PortfolioEntry } from "@/lib/types";
import type { Service } from "@/content/v2/catalogue";

export function guidesFor(services: Service[], limit = 3): Post[] {
  const v1 = new Set(services.map((s) => s.v1Category).filter(Boolean));
  return getAllPosts().filter((p) => (p.services ?? []).some((s) => v1.has(s))).slice(0, limit);
}

export function caseStudiesFor(services: Service[], limit = 1): PortfolioEntry[] {
  const seen = new Set<string>();
  const out: PortfolioEntry[] = [];
  for (const s of services) {
    if (!s.v1Category) continue;
    for (const p of getPortfolioForService(s.v1Category)) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      out.push(p);
    }
  }
  // Entries with a registration number first: they can be checked on the public register.
  return out.sort((a, b) => Number(!!b.rc) - Number(!!a.rc)).slice(0, limit);
}
