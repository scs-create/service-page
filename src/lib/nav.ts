// Site navigation for v2 (docs/v2/02-DECISIONS.md §4, 05-SITE-SPEC.md §2). The service clusters for the menus are in
// navClusters.ts, so the client header does not bundle the service catalogue.

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

// Strategy §6: these sit in the footer and the mobile menu, not the top bar.
export const SECONDARY_NAV: NavLink[] = [
  { href: "/contact", label: "Contact" },
  { href: "/tools", label: "Tools" },
  { href: "/portfolio", label: "Case studies" },
  { href: "/corporate-college", label: "Corporate College" },
  { href: "/career", label: "Join us" },
  { href: "/search", label: "Search" },
];

export const PROPOSAL_HREF = "/contact/proposal";
export const SERVICE_FINDER_HREF = "/find-my-service";

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
  { href: "/search", label: "Search" },
];

// "/" is active only on the home page; any other item is active on its own page and the pages below it.
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}
