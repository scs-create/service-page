"use client";

import { useEffect } from "react";
import { contextOf, toSnake, track } from "@/lib/track";
import { SITE } from "@/lib/site";

const FILE = /\.(pdf|docx?|xlsx?|pptx?|csv|zip)$/i;

// Where the click happened: an explicit data-location on a wrapper wins, otherwise the page landmark.
function locationOf(el: Element): string {
  const tagged = el.closest<HTMLElement>("[data-location]");
  if (tagged?.dataset.location) return tagged.dataset.location;
  if (el.closest('nav[aria-label="Quick contact"]')) return "mobile_dock";
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  if (el.closest("aside")) return "sidebar";
  if (el.closest('[role="dialog"]')) return "dialog";
  return "main";
}

// One delegated listener for the whole site (v2 event names, 05-SITE-SPEC.md §7):
//   inside the post-submit success panel                   -> post_submit_next_step { cta_name }
//   tel: -> call_click · WhatsApp -> whatsapp_click · the Cal.com booking link -> booking_click
//   data-track="partnership_cta"                           -> partnership_cta
//   mailto: -> cta_click { cta_name: "email" }
//   files (.pdf, .docx …) or links with a download attribute -> file_downloaded
//   any other site (socials, CAC, regulators …)            -> outbound_link_clicked
//   elements with data-track="Label"                       -> cta_click { cta_name: "label" }
// Every event carries the service_id / audience of the clicked element's context.
// Labels for phone and email links are fixed names, never the number or address itself.
export default function TrackClicks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest("a[href], [data-track]");
      if (!el) return;
      const location_on_page = locationOf(el);
      const ctx = contextOf(el);
      const href = el instanceof HTMLAnchorElement ? el.href : "";
      const label = el.getAttribute("data-track") ?? "";

      if (location_on_page === "form_success") {
        const text = (el.textContent || "").replace(/\(opens.*?\)/gi, "").replace(/[↗→]/g, "");
        return track("post_submit_next_step", { cta_name: toSnake(text), ...ctx });
      }
      if (href.startsWith("tel:")) return track("call_click", { location_on_page, ...ctx });
      if (href.startsWith("mailto:")) return track("cta_click", { cta_name: "email", location_on_page, ...ctx });
      if (label === "partnership_cta") return track("partnership_cta", { location_on_page, ...ctx });
      if (!href) return label ? track("cta_click", { cta_name: toSnake(label), location_on_page, ...ctx }) : undefined;

      let url: URL;
      try {
        url = new URL(href);
      } catch {
        return;
      }
      if (url.hostname === "wa.me" || url.hostname.endsWith("whatsapp.com")) return track("whatsapp_click", { location_on_page, ...ctx });
      if (el.hasAttribute("data-booking") || href.startsWith(SITE.bookingUrl)) return track("booking_click", { location_on_page, ...ctx });
      if ((el as HTMLAnchorElement).hasAttribute("download") || FILE.test(url.pathname)) {
        return track("file_downloaded", { file_name: decodeURIComponent(url.pathname.split("/").pop() ?? "") });
      }
      if (url.hostname !== window.location.hostname) {
        const text = (el.getAttribute("aria-label") || el.textContent || "").replace(/\(opens.*?\)/gi, "").replace(/[↗→]/g, "");
        return track("outbound_link_clicked", { destination_domain: url.hostname.replace(/^www\./, ""), link_label: text, location_on_page, ...ctx });
      }
      if (label) track("cta_click", { cta_name: toSnake(label), location_on_page, ...ctx });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
