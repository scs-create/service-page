"use client";

import Script from "next/script";
import { useSyncExternalStore } from "react";
import { getRawConsent, parseConsent, subscribeConsent } from "@/lib/consent";
import { SITE } from "@/lib/site";

// Plausible loads ONLY after the visitor accepts analytics (Cookie Policy §3: "Off until you accept").
export default function Analytics() {
  const raw = useSyncExternalStore(subscribeConsent, getRawConsent, () => null);
  if (!parseConsent(raw)?.analytics) return null;
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? SITE.domain;
  return <Script defer data-domain={domain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />;
}
