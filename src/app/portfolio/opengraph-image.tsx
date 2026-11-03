import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/ogImage";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Case studies: Stephen Corporate Services - SCS Ltd";

export default function Image() {
  return ogImage("Case studies", "23 engagements you can check on the public register");
}
