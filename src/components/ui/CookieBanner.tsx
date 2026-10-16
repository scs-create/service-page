"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { COOKIE_CATEGORIES } from "@/content/cookies";
import { getRawConsent, parseConsent, saveConsent, subscribeConsent, onOpenCookieSettings } from "@/lib/consent";
import { SITE } from "@/lib/site";

const noopSubscribe = () => () => {};
const BTN = "inline-flex items-center justify-center rounded-md px-5 py-2.5 min-h-11 font-medium transition-colors";
// Accept and Reject are deliberately identical in size and style (Cookie Policy §4).
const EQUAL = `${BTN} bg-white text-secondary hover:bg-accent`;
const GHOST = `${BTN} border border-white/70 text-white hover:bg-white/10`;

export default function CookieBanner() {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const raw = useSyncExternalStore(subscribeConsent, getRawConsent, () => null);
  const stored = parseConsent(raw);
  const [reopened, setReopened] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // "Cookie settings" in the footer reopens the panel (Cookie Policy §7)
  useEffect(
    () =>
      onOpenCookieSettings(() => {
        setAnalytics(parseConsent(getRawConsent())?.analytics ?? false);
        setManage(true);
        setReopened(true);
      }),
    []
  );
  useEffect(() => {
    if (reopened) panelRef.current?.focus();
  }, [reopened]);

  if (!hydrated || (stored && !reopened)) return null;

  function choose(accept: boolean) {
    saveConsent({ analytics: accept, functional: false, marketing: false });
    setManage(false);
    setReopened(false);
  }
  function save() {
    saveConsent({ analytics, functional: false, marketing: false });
    setManage(false);
    setReopened(false);
  }

  const visible = COOKIE_CATEGORIES.filter((c) => c.inUse);

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-label="Cookie preferences"
      className="dark-surface fixed inset-x-0 bottom-0 z-[60] max-h-[90vh] overflow-y-auto border-t-4 border-accent bg-secondary text-white shadow-2xl"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-5">
        <h2 className="text-lg font-semibold">Your cookie choices</h2>
        {!manage ? (
          <>
            <p className="mt-2 max-w-[90ch] text-sm text-white/90">
              {SITE.legalName} is responsible for the cookies and similar tools on this website. Strictly necessary tools are always on.
              Performance and analytics tools stay off unless you accept them, and closing this banner is not consent. You can change your
              choice at any time with “Cookie settings” in the footer. Read our{" "}
              <Link href="/cookies" className="underline hover:text-accent">Cookie Policy</Link> and{" "}
              <Link href="/privacy" className="underline hover:text-accent">Privacy Notice</Link>.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => choose(true)} className={EQUAL}>Accept all</button>
              <button type="button" onClick={() => choose(false)} className={EQUAL}>Reject non-essential</button>
              <button type="button" onClick={() => setManage(true)} className={GHOST}>Manage preferences</button>
            </div>
          </>
        ) : (
          <>
            <fieldset className="mt-3 space-y-3">
              <legend className="sr-only">Cookie categories</legend>
              {visible.map((c) => (
                <label key={c.id} className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 accent-white"
                    checked={c.required ? true : analytics}
                    disabled={c.required}
                    onChange={(e) => setAnalytics(e.target.checked)}
                  />
                  <span>
                    <span className="block font-semibold">{c.label}{c.required && " (always on)"}</span>
                    <span className="block text-white/85">{c.description}</span>
                  </span>
                </label>
              ))}
            </fieldset>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={save} className={EQUAL}>Save preferences</button>
              <button type="button" onClick={() => { setManage(false); if (stored) setReopened(false); }} className={GHOST}>
                {stored ? "Cancel" : "Back"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
