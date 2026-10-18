"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { COOKIE_CATEGORIES } from "@/content/cookies";
import { getRawConsent, parseConsent, saveConsent, subscribeConsent, onOpenCookieSettings } from "@/lib/consent";
import { privacySignal } from "@/lib/analytics";

const noopSubscribe = () => () => {};
const BTN = "inline-flex items-center justify-center rounded-md px-5 py-2.5 min-h-11 font-medium transition-colors";
// Accept and Decline are deliberately identical in size and style: declining is never harder (Cookie Policy §5).
const EQUAL = `${BTN} bg-white text-secondary hover:bg-accent`;
const GHOST = `${BTN} border border-white/70 text-white hover:bg-white/10`;
const LINK = "underline hover:text-accent";

export default function CookieBanner() {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const raw = useSyncExternalStore(subscribeConsent, getRawConsent, () => null);
  const signal = useSyncExternalStore(noopSubscribe, privacySignal, () => false);
  const stored = parseConsent(raw);
  const [reopened, setReopened] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // "Cookie settings" in the footer reopens the panel at any time (Cookie Policy §8.1).
  useEffect(
    () =>
      onOpenCookieSettings(() => {
        setAnalytics(parseConsent(getRawConsent())?.analytics ?? false);
        setReopened(true);
      }),
    []
  );
  useEffect(() => {
    if (reopened) panelRef.current?.focus();
  }, [reopened]);

  // Do Not Track / Global Privacy Control already say "no": analytics never loads, so there is nothing to ask.
  if (!hydrated || ((stored || signal) && !reopened)) return null;

  function choose(accept: boolean) {
    saveConsent({ analytics: accept, functional: false, marketing: false });
    setReopened(false);
  }

  const visible = COOKIE_CATEGORIES.filter((c) => c.inUse);

  return (
    <div
      ref={panelRef}
      tabIndex={-1}
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-text"
      className="dark-surface fixed inset-x-0 bottom-0 z-[60] max-h-[90vh] overflow-y-auto border-t-4 border-accent bg-secondary text-white shadow-2xl"
    >
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-5">
        <h2 id="cookie-banner-title" className="text-lg font-semibold">{reopened ? "Cookie settings" : "Your cookie choice"}</h2>
        {!reopened ? (
          <>
            <p id="cookie-banner-text" className="mt-2 max-w-[90ch] text-sm text-white/90">
              With your permission, we use analytics cookies to see how visitors use this site, so we can improve it. They stay off unless
              you accept, and you can change your mind at any time with &ldquo;Cookie settings&rdquo; in the footer. See our{" "}
              <Link href="/privacy" prefetch={false} className={LINK}>Privacy Notice</Link> and{" "}
              <Link href="/cookies" prefetch={false} className={LINK}>Cookie Policy</Link>.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => choose(true)} className={EQUAL}>Accept analytics</button>
              <button type="button" onClick={() => choose(false)} className={EQUAL}>Decline</button>
            </div>
          </>
        ) : signal ? (
          <>
            <p id="cookie-banner-text" className="mt-2 max-w-[90ch] text-sm text-white/90">
              Your browser is sending a privacy signal (Do Not Track or Global Privacy Control), so analytics stays off on this site and
              nothing is stored on your device. To change this, turn the signal off in your browser settings.
            </p>
            <div className="mt-4">
              <button type="button" onClick={() => setReopened(false)} className={GHOST}>Close</button>
            </div>
          </>
        ) : (
          <>
            <p id="cookie-banner-text" className="sr-only">Choose which cookies this site may use.</p>
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
              <button type="button" onClick={() => choose(analytics)} className={EQUAL}>Save choice</button>
              <button type="button" onClick={() => setReopened(false)} className={GHOST}>{stored ? "Cancel" : "Back"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
