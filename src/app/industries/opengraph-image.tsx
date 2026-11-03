import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/ogImage";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Industries: Stephen Corporate Services - SCS Ltd";

export default function Image() {
  return ogImage("Industries", "Support that understands your sector");
}
