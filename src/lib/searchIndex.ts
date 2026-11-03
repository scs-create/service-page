import { CLUSTERS, SERVICES } from "@/content/v2/catalogue";
import { portfolio } from "@/content/portfolio/data";
import { faqs } from "@/content/loaders";
import { INDUSTRIES } from "@/content/v2/industries";
import { AUDIENCES } from "@/content/v2/pages";
import { TOOLS } from "@/content/toolsList";
import { getAllPosts } from "@/lib/posts";
import type { SearchEntry } from "@/lib/search";

const PAGES: SearchEntry[] = [
  { title: "Services", text: "All 66 services in 7 areas, the Service Finder and managed support packages", href: "/services", kind: "Page" },
  { title: "Our process", text: "The six steps every engagement follows, and what we do and do not do", href: "/process", kind: "Page" },
  { title: "SCS Partnership", text: "A retainership plan agreed with each partner: one accountable coordinator", href: "/partnership", kind: "Page" },
  { title: "Remote operations partnership", text: "A Nigeria operations partner for international firms, on West Africa Time (UTC+1)", href: "/partnership/remote-operations", kind: "Page" },
  { title: "Clients", text: "Who we work with: founders, growing companies, NGOs, foreign companies, international firms", href: "/clients", kind: "Page" },
  { title: "Request a proposal", text: "Send a brief or tender and receive a written proposal", href: "/contact/proposal", kind: "Page" },
  { title: "Our standards", text: "Specialist vetting, management review, data protection, conflicts of interest and complaints", href: "/about/standards", kind: "Page" },
  { title: "Accessibility statement", text: "The accessibility standard this site works to, and how to report a problem", href: "/accessibility", kind: "Page" },
  { title: "Portfolio", text: "Selected client work and case studies", href: "/portfolio", kind: "Page" },
  { title: "Verification", text: "Client RC numbers and how to verify them on the CAC website", href: "/verification", kind: "Page" },
  { title: "Industries", text: "Sector-specific needs and relevant agencies", href: "/industries", kind: "Page" },
  { title: "Corporate College", text: "Request training; Stephen Corporate Academy; Corporate School blog", href: "/corporate-college", kind: "Page" },
  { title: "About SCS", text: "Leadership, approach, client journey and sectors", href: "/about", kind: "Page" },
  { title: "FAQ", text: "Answers to common questions about working with SCS", href: "/faq", kind: "Page" },
  { title: "Contact", text: "Book a Discovery Call, call, WhatsApp or email", href: "/contact", kind: "Page" },
  { title: "Career", text: "Apply to work or partner with SCS", href: "/career", kind: "Page" },
];

export function buildSearchIndex(): SearchEntry[] {
  return [
    ...PAGES,
    ...TOOLS.map((t) => ({ title: t.title, text: t.text, href: t.href, kind: "Tool" })),
    ...CLUSTERS.map((c) => ({ title: c.name, text: c.summary, href: c.path, kind: "Service area" })),
    ...SERVICES.map((s) => ({ title: s.name, text: `${s.clusterName}. ${s.summary}`, href: s.path, kind: "Service" })),
    ...portfolio.map((p) => ({ title: p.client, text: `${p.sector}. ${p.headline}`, href: `/portfolio/${p.slug}`, kind: "Case study" })),
    ...AUDIENCES.map((a) => ({ title: a.name, text: a.lead, href: `/clients/${a.slug}`, kind: "Clients" })),
    ...INDUSTRIES.map((i) => ({ title: i.name, text: `${i.summary} Includes ${i.includes.join(", ")}.`, href: i.path, kind: "Industry" })),
    ...faqs.map((f) => ({ title: f.question, text: f.answer, href: "/faq", kind: "FAQ" })),
    ...getAllPosts().map((p) => ({ title: p.title, text: p.excerpt, href: `/corporate-college/corporate-school/${p.slug}`, kind: "Article" })),
  ];
}
