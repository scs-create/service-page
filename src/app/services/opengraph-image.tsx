import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/ogImage";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Services: Stephen Corporate Services - SCS Ltd";

export default function Image() {
  return ogImage("Services", "66 services in 7 areas, scoped in writing before work starts");
}
