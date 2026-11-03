// v2 services: 66 services in 7 clusters (docs/v2/02-DECISIONS.md §5).
//   services.v2.json         the catalogue: ids, names, clusters, paths, summaries, most-requested flags (single source of truth)
//   services/<ID>.json       each service's page copy, one file per service (CMS-editable), status "draft" until approved
// Both are validated at build time; a missing or malformed file fails the build naming the service.
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import catalogue from "@/content/v2/services.v2.json";
import v1Links from "@/content/v2/v1-links.json";

const copySchema = z.object({
  id: z.string(),
  status: z.enum(["draft", "approved"]),
  whoFor: z.string().min(1),
  benefits: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })).length(3),
  whatYouReceive: z.array(z.string().min(1)),
  whatYouProvide: z.array(z.string().min(1)).min(1),
  doesNotInclude: z.array(z.string().min(1)).min(1),
  // Five services keep their v1 service lines by owner decision (SA-11, CS-07, CR-07, FA-08, HO-09).
  v1Retained: z.object({ framing: z.string(), intro: z.string(), lines: z.array(z.string()).min(1), closing: z.string() }).optional(),
});
export type ServiceCopy = z.infer<typeof copySchema>;

type CatalogueEntry = (typeof catalogue.services)[number];
export type Cluster = (typeof catalogue.clusters)[number];
export type Service = Omit<CatalogueEntry, "summary"> & { summary: string; copy: ServiceCopy; clusterName: string };

// The catalogue marks the five retained services in their summary; that note is for the build, never for visitors.
const cleanSummary = (s: string) => s.replace(/\s*\(v1 wording retained by owner decision\)/, "");

const COPY_DIR = path.join(process.cwd(), "src/content/v2/services");
function loadCopy(id: string): ServiceCopy {
  const file = path.join(COPY_DIR, `${id}.json`);
  if (!fs.existsSync(file)) throw new Error(`v2 service ${id}: missing ${path.relative(process.cwd(), file)}`);
  const parsed = copySchema.safeParse(JSON.parse(fs.readFileSync(file, "utf8")));
  if (!parsed.success) throw new Error(`v2 service ${id}: ${parsed.error.issues.map((i) => `${i.path.join(".")} ${i.message}`).join("; ")}`);
  if (parsed.data.id !== id) throw new Error(`v2 service ${id}: file id is ${parsed.data.id}`);
  if (!parsed.data.v1Retained && parsed.data.whatYouReceive.length === 0) throw new Error(`v2 service ${id}: whatYouReceive is empty`);
  return parsed.data;
}

export const CLUSTERS: Cluster[] = catalogue.clusters;
const clusterName = Object.fromEntries(CLUSTERS.map((c) => [c.slug, c.name]));

export const SERVICES: Service[] = catalogue.services.map((s) => ({
  ...s,
  summary: cleanSummary(s.summary),
  clusterName: clusterName[s.cluster],
  copy: loadCopy(s.id),
}));

export const getCluster = (slug: string) => CLUSTERS.find((c) => c.slug === slug);
export const getService = (cluster: string, slug: string) => SERVICES.find((s) => s.cluster === cluster && s.slug === slug);
export const getServiceById = (id: string) => SERVICES.find((s) => s.id === id);

// Most-requested first, then catalogue order (the cluster hubs and the menu use the same order).
export function servicesInCluster(cluster: string): Service[] {
  const all = SERVICES.filter((s) => s.cluster === cluster);
  return [...all.filter((s) => s.mostRequested), ...all.filter((s) => !s.mostRequested)];
}

// v1 linked to its 21 service categories. Guides, case studies and industry pages still name those slugs, so they
// are resolved here: the page a v1 category now lives at (src/content/v2/v1-links.json, the same table as the 301s in docs/v2/04-redirects.csv),
// and the v2 services that came from it (for related guides and case studies).
const V1_TARGET: Record<string, string> = v1Links.links;

export function v2LinkForV1(v1Slug: string): { href: string; label: string; summary: string } | undefined {
  const href = V1_TARGET[v1Slug];
  if (!href) return undefined;
  const [, , cluster, slug] = href.split("/");
  const svc = slug ? getService(cluster, slug) : undefined;
  const c = getCluster(cluster);
  return { href, label: svc ? svc.name : (c?.name ?? cluster), summary: svc ? svc.summary : (c?.summary ?? "") };
}

export const servicesFromV1 = (v1Slug: string) => SERVICES.filter((s) => s.v1Category === v1Slug);
