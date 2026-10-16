import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// PWA basics. Colour literals are required here (a manifest cannot read CSS variables): they mirror
// --color-secondary / --color-bg in globals.css.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.legalName, short_name: "SCS", description: SITE.tagline, start_url: "/", display: "standalone",
    background_color: "#ffffff", theme_color: "#011550",
    icons: [{ src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }, { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" }, { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }],
  };
}
