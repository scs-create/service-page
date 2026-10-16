"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { VerificationDocument } from "@/lib/types";

// Watermark overlay is the .cert-watermark class in globals.css (token colours live only there).
type Props = { doc: VerificationDocument | null; onClose: () => void };

// Native <dialog>.showModal(): focus trap, Esc to close and an inert background for free.
export default function CertificateModal({ doc, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (doc && !dialog.open) dialog.showModal();
    if (!doc && dialog.open) dialog.close();
  }, [doc]);

  return (
    <dialog
      ref={ref}
      aria-label={doc ? `${doc.category}: ${doc.title}` : "Document viewer"}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className="m-auto w-[min(94vw,920px)] max-h-[94vh] rounded-md bg-bg p-0 text-text"
    >
      {doc && (
        <div>
          <div className="flex items-start justify-between gap-4 border-b border-border p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{doc.category}</p>
              <h2 className="text-lg font-semibold">{doc.title}</h2>
              <p className="text-sm text-muted">
                {[doc.issuingBody && `Issued by ${doc.issuingBody}`, doc.client, doc.issued].filter(Boolean).join(" · ")}
              </p>
              {doc.badge && (
                <p className="mt-2 inline-block rounded-sm border border-success px-2 py-0.5 text-xs font-semibold text-success">{doc.badge}</p>
              )}
            </div>
            <button type="button" onClick={onClose} className="min-h-11 rounded-md border border-border px-4 text-sm font-medium hover:border-primary">
              Close
            </button>
          </div>
          <div className="relative h-[70vh] bg-surface" onContextMenu={(e) => e.preventDefault()}>
            <Image src={doc.image} alt={doc.alt} fill sizes="92vw" className="object-contain select-none" draggable={false} />
            <div aria-hidden="true" className="cert-watermark pointer-events-none absolute inset-0" />
          </div>
        </div>
      )}
    </dialog>
  );
}
