"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// One delegated listener: any element with data-track="Label" reports a "CTA Click" to Plausible.
export default function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest("[data-track]");
      if (el) track("CTA Click", { label: el.getAttribute("data-track") ?? "" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
