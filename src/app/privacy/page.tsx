import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import { hasPlaceholders } from "@/lib/legal";
import type { LegalDocumentData } from "@/lib/types";
import data from "@/content/legal/privacy.json";

const doc = data as unknown as LegalDocumentData;

// Stays out of search results until every [placeholder] in the JSON is resolved.
export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Stephen Corporate Services Ltd collects, uses, shares and protects personal data, and your rights under Nigerian data protection law.",
  robots: hasPlaceholders(doc) ? { index: false, follow: true } : undefined,
};

export default function Page() {
  return <LegalDocument doc={doc} />;
}
