"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

// One delegated listener: any element with data-track="Label" reports a "CTA Click";
// links marked data-booking (the Cal.com Discovery Call) also report a "Booking Click".
export default function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest("[data-track],[data-booking]");
      if (!el) return;
      const label = el.getAttribute("data-track") ?? "";
      if (el.hasAttribute("data-track")) track("CTA Click", { label });
      if (el.hasAttribute("data-booking")) track("Booking Click", { label, page: window.location.pathname });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
