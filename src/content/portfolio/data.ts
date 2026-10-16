// Reads one JSON file per case study (editable via Decap CMS), server-side only.
import { loadJsonDir } from "@/lib/content";
import { portfolioSchema } from "@/lib/schemas";
import { PortfolioEntry } from "@/lib/types";
import { SERVICE_LINE_TO_SLUG } from "./serviceLines";

export const portfolio: PortfolioEntry[] = (loadJsonDir("src/content/portfolio/entries", portfolioSchema) as PortfolioEntry[]).sort(
  (a, b) => a.order - b.order
);
export const getPortfolioBySlug = (slug: string) => portfolio.find((p) => p.slug === slug);
export const featuredPortfolio = portfolio.filter((p) => p.featured);

export function getPortfolioForService(serviceSlug: string): PortfolioEntry[] {
  return portfolio.filter((p) =>
    p.serviceLines.some((l) => SERVICE_LINE_TO_SLUG[l] === serviceSlug)
  );
}
