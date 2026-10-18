import type { PostHog } from "posthog-js";
import { SITE } from "@/lib/site";

// SINGLE PLACE for analytics configuration (PostHog Cloud, EU region).
// The project key is public by design (it can only send events), so it may live in the client bundle.
// NEXT_PUBLIC_POSTHOG_KEY overrides it, e.g. for a separate test project.
export const POSTHOG = {
  key: process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_virzGLMmYLWVEZ4t8y8TvkuxCeQqMhNkeqJCwhtRyfLE",
  apiHost: "/ingest", // proxied by netlify.toml to eu.i.posthog.com, so ad blockers don't drop it and the CSP stays same-origin
  uiHost: "https://eu.posthog.com",
  defaults: "2026-08-30", // PostHog's latest dated defaults (docs, October 2026)
} as const;

// Only the live domain is tracked: never localhost, Netlify deploy previews (*.netlify.app) or the CMS.
export function trackingAllowedHere(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  const live = host === SITE.domain || host === `www.${SITE.domain}`;
  return live && !window.location.pathname.startsWith("/admin");
}

// Do Not Track or Global Privacy Control: analytics is off by default and the banner says so. Only an explicit
// "Accept analytics" from the visitor turns it on.
export function privacySignal(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const w = typeof window !== "undefined" ? (window as Window & { doNotTrack?: string }) : undefined;
  return nav.globalPrivacyControl === true || [nav.doNotTrack, nav.msDoNotTrack, w?.doNotTrack].some((v) => v === "1" || v === "yes");
}

// The loaded instance (null until the visitor accepts analytics). Set by components/ui/Analytics.tsx.
let instance: PostHog | null = null;
export const getPosthog = () => instance;
export const setPosthog = (p: PostHog | null) => {
  instance = p;
};

// Removes everything PostHog stores on the device (ph_* / __ph* cookies, localStorage and sessionStorage),
// used when a visitor withdraws consent so nothing is left behind.
export function clearPosthogStorage() {
  if (typeof window === "undefined") return;
  const isPh = (k: string) => k.startsWith("ph_") || k.startsWith("__ph");
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      Object.keys(store).filter(isPh).forEach((k) => store.removeItem(k));
    } catch {
      /* storage unavailable */
    }
  }
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (!isPh(name)) continue;
    for (const domain of ["", `; domain=${window.location.hostname}`, `; domain=.${SITE.domain}`]) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain}`;
    }
  }
}
