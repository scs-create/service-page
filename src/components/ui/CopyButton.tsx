"use client";

import { useState } from "react";

export default function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the number is still visible on screen */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy RC number for ${label}`}
      className="text-sm text-primary hover:underline min-h-11 px-2"
    >
      {copied ? "Copied" : "Copy"}
      <span role="status" className="sr-only">
        {copied ? "RC number copied to clipboard" : ""}
      </span>
    </button>
  );
}
