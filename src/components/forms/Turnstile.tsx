"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

// Cloudflare Turnstile, managed widget, on form pages only (06-TECH-SPEC.md §3 step 3). The script loads when a form
// mounts, never site-wide. The widget writes its token into a hidden "cf-turnstile-response" input inside the form.
// The site key is public. Without NEXT_PUBLIC_TURNSTILE_SITE_KEY, non-production builds use Cloudflare's documented
// always-pass test key (developers.cloudflare.com/turnstile/troubleshooting/testing).
const TEST_KEY = "1x00000000000000000000AA";
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (process.env.NEXT_PUBLIC_SITE_ENV === "production" ? "" : TEST_KEY);

type TurnstileApi = { render(el: HTMLElement, opts: Record<string, unknown>): string; reset(id?: string): void; remove(id: string): void };
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let loading: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      loading = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(s);
  });
  return loading;
}

export type TurnstileHandle = { reset(): void };

const Turnstile = forwardRef<TurnstileHandle, { onError?: () => void }>(function Turnstile({ onError }, ref) {
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({ reset: () => window.turnstile?.reset(widget.current ?? undefined) }), []);

  useEffect(() => {
    let cancelled = false;
    if (!TURNSTILE_SITE_KEY) return;
    loadScript()
      .then(() => {
        if (cancelled || !box.current || !window.turnstile) return;
        widget.current = window.turnstile.render(box.current, { sitekey: TURNSTILE_SITE_KEY, theme: "light", size: "flexible", "error-callback": onError });
      })
      .catch(() => onError?.());
    return () => {
      cancelled = true;
      if (widget.current) window.turnstile?.remove(widget.current);
    };
  }, [onError]);

  return <div ref={box} className="min-h-[65px]" />;
});

export default Turnstile;
