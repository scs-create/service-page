import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import { hasPlaceholders } from "@/lib/legal";
import type { LegalDocumentData } from "@/lib/types";
import data from "@/content/legal/cookies.json";

const doc = data as unknown as LegalDocumentData;

// Stays out of search results until every [placeholder] in the JSON is resolved.
export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "The cookies and similar tools used on the SCS website, how we ask for consent, and how to change your choice.",
  robots: hasPlaceholders(doc) ? { index: false, follow: true } : undefined,
};

export default function Page() {
  return <LegalDocument doc={doc} />;
}
