import { OG_SIZE, OG_TYPE, ogImage } from "@/lib/ogImage";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_TYPE;
export const alt = "Our process: Stephen Corporate Services - SCS Ltd";

export default function Image() {
  return ogImage("Our process", "Every engagement follows the same six steps");
}
