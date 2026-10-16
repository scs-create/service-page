// Reads verification documents (scans/letters) uploaded via Decap CMS. Server-side only.
// Validated at build time, including that every referenced image exists in /public.
// Returns [] until documents are uploaded — the page shows an honest empty state.
import { assertPublicFile, loadJsonDir } from "@/lib/content";
import { verificationSchema } from "@/lib/schemas";
import { VerificationDocument } from "@/lib/types";

export const verificationDocuments = loadJsonDir("src/content/verification/documents", verificationSchema) as VerificationDocument[];
verificationDocuments.forEach((d) => assertPublicFile(d.image, `src/content/verification/documents/${d.slug}.json`, "image"));
