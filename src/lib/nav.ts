// Site navigation for v2 (docs/v2/02-DECISIONS.md §4, 05-SITE-SPEC.md §2). The 7 service clusters and their
// services come from src/content/v2/services.v2.json, the single source of truth (a copy of docs/v2/03-services.v2.json).
import catalogue from "@/content/v2/services.v2.json";

export type NavLink = { href: string; label: string };

export const PRIMARY_NAV: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/clients", label: "Clients" },
  { href: "/process", label: "Process" },
  { href: "/partnership", label: "Partnership" },
  { href: "/corporate-college/corporate-school", label: "Insights" },
  { href: "/about", label: "About" },
];

export const PROPOSAL_HREF = "/contact/proposal";
export const SERVICE_FINDER_HREF = "/find-my-service";

export type NavCluster = { slug: string; name: string; summary: string; path: string; top: NavLink[] };

// Each cluster shows 3 services in the menu: the ones flagged mostRequested first, then the rest in catalogue order.
export const CLUSTERS: NavCluster[] = catalogue.clusters.map((c) => {
  const inCluster = catalogue.services.filter((s) => s.cluster === c.slug);
  const ordered = [...inCluster.filter((s) => s.mostRequested), ...inCluster.filter((s) => !s.mostRequested)];
  return { ...c, top: ordered.slice(0, 3).map((s) => ({ href: s.path, label: s.name })) };
});

export const COMPANY_LINKS: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/about/standards", label: "Our standards" },
  { href: "/portfolio", label: "Case studies" },
  { href: "/verification", label: "Verification" },
  { href: "/tools", label: "Tools" },
  { href: "/corporate-college", label: "Corporate College" },
  { href: "/career", label: "Join us" },
  { href: "/contact", label: "Contact" },
];

export const POLICY_LINKS: NavLink[] = [
  { href: "/privacy", label: "Privacy notice" },
  { href: "/cookies", label: "Cookie notice" },
  { href: "/terms", label: "Website terms" },
  { href: "/accessibility", label: "Accessibility statement" },
];

// "/" is active only on the home page; any other item is active on its own page and the pages below it.
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
