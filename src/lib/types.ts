// Shared content types — one source of truth for the ServiceCategory
// master component (PROJECT STATE Module 7) and everything that consumes it:
// mega-menu, Services index, individual service pages, Footer list.

export type ClusterSlug =
  | "start-and-structure"
  | "compliance-and-regulatory"
  | "finance-and-tax"
  | "people-and-operations"
  | "technology-and-data"
  | "growth-and-market-presence";

export interface ServiceCategoryData {
  slug: string;
  title: string;
  cluster: ClusterSlug;
  framingSentence: string;
  introLine: string;
  services: string[];
  supportingStatement?: string;
  closingStatement?: string;
}

export interface ClusterInfo {
  slug: ClusterSlug;
  name: string;
}

export const CLUSTERS: ClusterInfo[] = [
  { slug: "start-and-structure", name: "Start & Structure" },
  { slug: "compliance-and-regulatory", name: "Compliance & Regulatory" },
  { slug: "finance-and-tax", name: "Finance & Tax" },
  { slug: "people-and-operations", name: "People & Operations" },
  { slug: "technology-and-data", name: "Technology & Data" },
  { slug: "growth-and-market-presence", name: "Growth & Market Presence" },
];

// ---------------------------------------------------------------
// Portfolio, leadership and verification types
// ---------------------------------------------------------------
export type PortfolioFilter =
  | "healthcare-pharma"
  | "real-estate"
  | "tech-digital"
  | "logistics-transport"
  | "hospitality"
  | "agribusiness"
  | "non-profit"
  | "manufacturing"
  | "media-retail-professional"
  | "finance-investment"
  | "education";

export const PORTFOLIO_FILTERS: { slug: PortfolioFilter; label: string }[] = [
  { slug: "healthcare-pharma", label: "Healthcare & Pharma" },
  { slug: "real-estate", label: "Real Estate & Construction" },
  { slug: "tech-digital", label: "Tech & Digital" },
  { slug: "logistics-transport", label: "Logistics & Transport" },
  { slug: "hospitality", label: "Hospitality" },
  { slug: "agribusiness", label: "Agribusiness" },
  { slug: "non-profit", label: "Non-Profit" },
  { slug: "manufacturing", label: "Manufacturing" },
  { slug: "media-retail-professional", label: "Media, Retail & Professional" },
  { slug: "finance-investment", label: "Finance & Investment" },
  { slug: "education", label: "Education" },
];

export interface PortfolioEntry {
  order: number;
  slug: string;
  client: string;
  rc?: string; // empty until supplied
  regType?: "RC" | "BN"; // default RC; BN for business names
  sector: string;
  filter: PortfolioFilter;
  featured?: boolean;
  headline: string;
  challenge: string;
  delivered: string[];
  impact: string;
  serviceLines: string[];
}

export interface LeadershipProfile {
  slug: string;
  name: string;
  role: string;
  initials: string;
  credentials: string;
  focus: string[];
  linkedin: string;
  bio?: string; // add once the founders approve wording
  photo?: string; // path under /public, e.g. /images/team/stephen.jpg
}

export type VerificationCategory =
  | "Certificate of Incorporation"
  | "Regulatory Permit"
  | "Client Acknowledgment Letter";

export interface VerificationDocument {
  slug: string;
  title: string;
  category: VerificationCategory;
  client?: string;
  image: string; // path under /public, e.g. /verification/example.jpg
  alt: string;
  issued?: string;
  issuingBody?: string; // e.g. "Corporate Affairs Commission"
  badge?: string; // e.g. "Verifiable on CAC public search" — shown as a green pill
}

// ---------------------------------------------------------------
// Legal documents (src/content/legal/*.json), proof points, packages
// ---------------------------------------------------------------
export type LegalBlock =
  | { type: "p"; text: string; internal?: boolean } // internal = drafting note, never rendered
  | { type: "list"; items: string[] }
  | { type: "table"; rows: string[][] };

export interface LegalSection {
  id: string;
  heading: string;
  level: 2 | 3;
  blocks: LegalBlock[];
}

export interface LegalDocumentData {
  slug: "terms" | "privacy" | "cookies";
  title: string;
  effective?: string | null; // the only date shown (client decision, 18 October 2026: no "last updated")
  intro: LegalBlock[];
  sections: LegalSection[];
}

export interface ProofPoint {
  value: string;
  label: string;
}

export interface SupportPackage {
  id: string;
  name: string;
  audience: string;
  includes: string;
}

// "RC 1234567" / "BN 1234567", or null while the number has not been supplied.
export const registrationLabel = (e: { rc?: string; regType?: "RC" | "BN" }) => (e.rc ? `${e.regType ?? "RC"} ${e.rc}` : null);
