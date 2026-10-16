import { EMAILS, SITE } from "@/lib/site";
import type { LegalBlock, LegalDocumentData } from "@/lib/types";

// {{token}} values available inside src/content/legal/*.json.
// Change contact details in src/lib/site.ts and every legal page follows.
export const LEGAL_VARS: Record<string, string> = {
  company: SITE.legalName,
  address: SITE.address.full,
  phone: SITE.phone,
  domain: SITE.domain,
  rc: SITE.rc,
  email_contact: EMAILS.contact,
  email_info: EMAILS.info,
  email_privacy: EMAILS.privacy,
};

export const resolveTokens = (text: string) =>
  text.replace(/\{\{(\w+)\}\}/g, (m, key: string) => LEGAL_VARS[key] ?? m);

// Anything in [square brackets] that is not a [label](url) link is an unresolved placeholder.
const PLACEHOLDER = /\[[^\]]{1,120}\](?!\()/;

function blockTexts(b: LegalBlock): string[] {
  if (b.type === "p") return b.internal ? [] : [b.text];
  if (b.type === "list") return b.items;
  return b.rows.flat();
}

export function hasPlaceholders(doc: LegalDocumentData): boolean {
  const all = [...doc.intro, ...doc.sections.flatMap((s) => s.blocks)];
  return all.some((b) => blockTexts(b).some((t) => PLACEHOLDER.test(resolveTokens(t))));
}
