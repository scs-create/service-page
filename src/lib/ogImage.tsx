import { ImageResponse } from "next/og";

// Open Graph image per section (docs/v2/05-SITE-SPEC.md §6), rendered once at build time into a static PNG. Brand
// colours from the tokens; the gold rule from the design; no photography.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

export function ogImage(section: string, line: string) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#011550", padding: "72px 80px", borderTop: "16px solid #f9b91a" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ color: "#f9b91a", fontSize: 30, fontWeight: 600, letterSpacing: 3, textTransform: "uppercase" }}>{section}</div>
          <div style={{ marginTop: 28, color: "#ffffff", fontSize: 64, fontWeight: 600, lineHeight: 1.15, maxWidth: 980 }}>{line}</div>
          <div style={{ marginTop: 36, width: 112, height: 8, background: "#f9b91a", borderRadius: 4 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", color: "#ffffff" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 32, fontWeight: 600 }}>Stephen Corporate Services - SCS Ltd</div>
            <div style={{ marginTop: 8, fontSize: 24, color: "rgba(255,255,255,0.85)" }}>RC 9041457 · Abuja, serving clients worldwide</div>
          </div>
          <div style={{ fontSize: 24, color: "#f9b91a" }}>Elevate Your Company, Go Global.</div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
