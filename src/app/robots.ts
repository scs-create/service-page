import type { MetadataRoute } from "next";

export const dynamic = "force-static"; // static export (v2 on Cloudflare)
import { IS_PRODUCTION, SITE } from "@/lib/site";

// Previews (*.workers.dev) are never indexed.
export default function robots(): MetadataRoute.Robots {
  if (!IS_PRODUCTION) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/__forms.html", "/ingest/"] },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
