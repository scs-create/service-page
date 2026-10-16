"use client";

import { useState } from "react";
import Image from "next/image";
import CertificateModal from "@/components/sections/CertificateModal";
import type { VerificationDocument } from "@/lib/types";

// Reads documents from src/content/verification/data.ts (passed in by the page).
export default function CertificateGallery({ documents }: { documents: VerificationDocument[] }) {
  const [active, setActive] = useState<VerificationDocument | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {documents.map((doc) => (
          <li key={doc.slug}>
            <button
              type="button"
              onClick={() => setActive(doc)}
              className="group block w-full text-left rounded-md border border-border bg-bg overflow-hidden hover:border-primary"
            >
              <span className="relative block aspect-[4/5] bg-surface">
                <Image src={doc.image} alt={doc.alt} fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
              </span>
              <span className="block p-3">
                <span className="block text-xs font-semibold uppercase tracking-wider text-primary">{doc.category}</span>
                <span className="block text-sm font-medium text-text">{doc.title}</span>
                {doc.issuingBody && <span className="block text-xs text-muted">{doc.issuingBody}</span>}
                {doc.badge && (
                  <span className="mt-2 inline-block rounded-sm border border-success px-2 py-0.5 text-xs font-semibold text-success">{doc.badge}</span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <CertificateModal doc={active} onClose={() => setActive(null)} />
    </>
  );
}
