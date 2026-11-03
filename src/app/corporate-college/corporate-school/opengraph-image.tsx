import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/ogImage";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Corporate School: Stephen Corporate Services - SCS Ltd";

export default function Image() {
  return ogImage("Corporate School", "Practical guides, dated and sourced");
}
