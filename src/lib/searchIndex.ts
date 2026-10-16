import { services } from "@/content/services/data";
import { portfolio } from "@/content/portfolio/data";
import { faqs, industries } from "@/content/loaders";
import { TOOLS } from "@/content/toolsList";
import { getAllPosts } from "@/lib/posts";
import type { SearchEntry } from "@/lib/search";

const PAGES: SearchEntry[] = [
  { title: "Services", text: "All service areas and managed support packages", href: "/services", kind: "Page" },
  { title: "Portfolio", text: "Selected client work and case studies", href: "/portfolio", kind: "Page" },
  { title: "Verification", text: "Client RC numbers and how to verify them on the CAC website", href: "/verification", kind: "Page" },
  { title: "Industries", text: "Sector-specific needs and relevant agencies", href: "/industries", kind: "Page" },
  { title: "Corporate College", text: "Request training; Stephen Corporate Academy; Corporate School blog", href: "/corporate-college", kind: "Page" },
  { title: "About SCS", text: "Leadership, approach, client journey and sectors", href: "/about", kind: "Page" },
  { title: "FAQ", text: "Answers to common questions about working with SCS", href: "/faq", kind: "Page" },
  { title: "Contact", text: "Book a consultation, call, WhatsApp or email", href: "/contact", kind: "Page" },
  { title: "Career", text: "Apply to work or partner with SCS", href: "/career", kind: "Page" },
];

export function buildSearchIndex(): SearchEntry[] {
  return [
    ...PAGES,
    ...TOOLS.map((t) => ({ title: t.title, text: t.text, href: t.href, kind: "Tool" })),
    ...services.map((s) => ({ title: s.title, text: s.framingSentence, href: `/services/${s.slug}`, kind: "Service" })),
    ...portfolio.map((p) => ({ title: p.client, text: `${p.sector}. ${p.headline}`, href: `/portfolio/${p.slug}`, kind: "Case study" })),
    ...industries.map((i) => ({ title: i.name, text: i.summary, href: `/industries/${i.slug}`, kind: "Industry" })),
    ...faqs.map((f) => ({ title: f.question, text: f.answer, href: "/faq", kind: "FAQ" })),
    ...getAllPosts().map((p) => ({ title: p.title, text: p.excerpt, href: `/corporate-college/corporate-school/${p.slug}`, kind: "Article" })),
  ];
}
