// SINGLE SOURCE OF TRUTH for all service categories.
// Reads each service from its own JSON file in ./entries/ at build time (Decap CMS edits these files).
// Every record is schema-validated; a bad record fails the build naming the file and field (M-05).
import { loadJsonDir } from "@/lib/content";
import { serviceSchema } from "@/lib/schemas";
import { ServiceCategoryData } from "@/lib/types";

export const services = (loadJsonDir("src/content/services/entries", serviceSchema) as ServiceCategoryData[]).sort((a, b) =>
  a.title.localeCompare(b.title)
);

export function getServiceBySlug(slug: string): ServiceCategoryData | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCluster(cluster: string): ServiceCategoryData[] {
  return services.filter((s) => s.cluster === cluster);
}
