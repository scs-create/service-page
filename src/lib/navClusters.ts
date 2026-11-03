// The 7 service clusters for the header and footer menus. They come from src/content/v2/services.v2.json, the single
// source of truth (a copy of docs/v2/03-services.v2.json). Server-only use: the layout passes them to the client
// header as a prop, so visitors download only these 7 entries, not the whole catalogue (QA, PR 9).
import catalogue from "@/content/v2/services.v2.json";
import type { NavLink } from "@/lib/nav";

export type NavCluster = { slug: string; name: string; summary: string; path: string; top: NavLink[] };

// Each cluster shows 3 services in the menu: the ones flagged mostRequested first, then the rest in catalogue order.
export const CLUSTERS: NavCluster[] = catalogue.clusters.map((c) => {
  const inCluster = catalogue.services.filter((s) => s.cluster === c.slug);
  const ordered = [...inCluster.filter((s) => s.mostRequested), ...inCluster.filter((s) => !s.mostRequested)];
  return { ...c, top: ordered.slice(0, 3).map((s) => ({ href: s.path, label: s.name })) };
});
