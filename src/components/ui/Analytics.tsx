"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { CaptureResult } from "posthog-js";
import { getRawConsent, parseConsent, subscribeConsent } from "@/lib/consent";
import { flushQueue } from "@/lib/track";
import { POSTHOG, clearPosthogStorage, getPosthog, privacySignal, setPosthog, trackingAllowedHere } from "@/lib/analytics";

const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
const PHONE = /\+?\d[\d\s().-]{7,}\d/g;
// The only free-text properties: our own labels plus the clicked element's text. IDs, URLs and timestamps are never touched.
const FREE_TEXT = new Set(["cta_name", "link_label", "location_on_page", "service_interest", "service_name", "tool_name", "file_name", "$el_text", "$elements_chain"]);

// Last line of defence: nothing that looks like an email address or phone number leaves the browser,
// whatever a label or a clicked element's text happens to contain.
function scrub(event: CaptureResult | null): CaptureResult | null {
  if (!event?.properties) return event;
  for (const [k, v] of Object.entries(event.properties)) {
    if (FREE_TEXT.has(k) && typeof v === "string" && (EMAIL.test(v) || PHONE.test(v))) {
      event.properties[k] = v.replace(EMAIL, "[email]").replace(PHONE, "[number]");
    }
    EMAIL.lastIndex = 0;
    PHONE.lastIndex = 0;
  }
  return event;
}

// PostHog loads ONLY after the visitor accepts analytics, only on the live domain, and never when the browser
// sends Do Not Track / Global Privacy Control. Before that nothing is downloaded and nothing is stored.
// posthog-js is imported on demand, so it adds nothing to the page for visitors who have not accepted.
export default function Analytics() {
  const raw = useSyncExternalStore(subscribeConsent, getRawConsent, () => null);
  const accepted = !!parseConsent(raw)?.analytics;

  useEffect(() => {
    const allowed = accepted && trackingAllowedHere() && !privacySignal();
    const loaded = getPosthog();
    if (!allowed) {
      if (loaded) {
        loaded.opt_out_capturing();
        setPosthog(null);
      }
      clearPosthogStorage();
      return;
    }
    if (loaded) return;
    let cancelled = false;
    import("posthog-js").then(({ default: posthog }) => {
      if (cancelled) return;
      if (posthog.__loaded) {
        posthog.opt_in_capturing({ captureEventName: null });
      } else {
        posthog.init(POSTHOG.key, {
          api_host: POSTHOG.apiHost,
          ui_host: POSTHOG.uiHost,
          defaults: POSTHOG.defaults,
          person_profiles: "identified_only",
          persistence: "localStorage+cookie",
          cross_subdomain_cookie: false,
          secure_cookie: true,
          capture_pageview: "history_change",
          capture_pageleave: true,
          autocapture: { capture_copied_text: false },
          mask_all_element_attributes: false,
          disable_session_recording: true, // OFF. If enabled later: maskAllInputs: true, consent-only.
          disable_surveys: true,
          respect_dnt: true,
          before_send: scrub,
        });
      }
      setPosthog(posthog);
      flushQueue();
    });
    return () => {
      cancelled = true;
    };
  }, [accepted]);

  return null;
}
