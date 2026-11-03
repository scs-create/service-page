// v2 industries: the 15 v1 industry pages merged into 6 (docs/v2/04-industries.v2.json, strategy §6). Each v2 industry
// combines the needs, agencies and services of the v1 pages it replaces, without duplicates. Summaries approved by the owner (3 November 2026).
import { industries as v1Industries } from "@/content/loaders";
import { v2LinkForV1 } from "@/content/v2/catalogue";
import pack from "@/content/v2/industries.v2.json";

const SUMMARY: Record<string, string> = {
  "agriculture-and-food": "Farms, agro-allied processors and food businesses, with the registrations, product approvals and records their supply chains ask for.",
  "education-and-non-profits": "Schools, colleges, foundations, NGOs and social enterprises, with the approvals, governance records and donor documentation they rely on.",
  "energy-construction-and-real-estate": "Energy, contracting, construction and property businesses, with the permits, safety documentation and contract records their projects need.",
  "financial-services": "Lenders, fintechs and investment companies, with the licences, governance and data protection their regulators and investors examine.",
  "health-and-manufacturing": "Healthcare, pharmaceutical and manufacturing businesses, with the product, premises and quality approvals their regulators require.",
  "technology-media-and-consumer": "Technology, media, retail and professional services businesses, with the registrations, data protection and brand records growth depends on.",
};

export type Industry = {
  slug: string;
  name: string;
  path: string;
  summary: string;
  includes: string[]; // the v1 sector names it replaces
  needs: string[];
  regulators: string[];
  notes: string[];
  services: { href: string; label: string; summary: string }[];
};

const uniq = <T,>(xs: T[]) => [...new Set(xs)];

export const INDUSTRIES: Industry[] = pack.industries.map((i) => {
  const parts = i.mergesV1.map((s) => {
    const v1 = v1Industries.find((x) => x.slug === s);
    if (!v1) throw new Error(`v2 industry ${i.slug}: v1 industry ${s} not found`);
    return v1;
  });
  const links = parts.flatMap((p) => p.services).map(v2LinkForV1).filter((s) => !!s);
  return {
    slug: i.slug,
    name: i.name,
    path: i.path,
    summary: SUMMARY[i.slug],
    includes: parts.map((p) => p.name),
    needs: uniq(parts.flatMap((p) => p.needs)),
    regulators: uniq(parts.flatMap((p) => p.regulators)),
    notes: uniq(parts.map((p) => p.note).filter((n): n is string => !!n)),
    services: [...new Map(links.map((s) => [s.href, s])).values()],
  };
});

export const getIndustry = (slug: string) => INDUSTRIES.find((i) => i.slug === slug);
