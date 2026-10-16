import type { Metadata } from "next";
import LegalDocument from "@/components/sections/LegalDocument";
import { hasPlaceholders } from "@/lib/legal";
import type { LegalDocumentData } from "@/lib/types";
import data from "@/content/legal/terms.json";

const doc = data as unknown as LegalDocumentData;

// Stays out of search results until every [placeholder] in the JSON is resolved.
export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that govern SCS services, data protection responsibilities, liability and dispute resolution.",
  robots: hasPlaceholders(doc) ? { index: false, follow: true } : undefined,
};

export default function Page() {
  return <LegalDocument doc={doc} />;
}
