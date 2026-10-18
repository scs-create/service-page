"use client";

import { useEffect } from "react";

// Netlify's free plan injects a fixed "Powered by Netlify" badge (iframe #nl-badge-frame) in the bottom-right
// corner, above everything, and it cannot be hidden on that plan. This measures it and publishes its height as
// --badge-h on <html>, so the cookie banner, the mobile contact bar and the WhatsApp button sit above it instead
// of under it. With no badge (paid plan, local, previews) the offset is 0.
export default function BadgeOffset() {
  useEffect(() => {
    const root = document.documentElement;
    let frame: HTMLElement | null = null;
    const resize = new ResizeObserver(() => apply());
    function apply() {
      const h = frame && frame.isConnected ? Math.ceil(frame.getBoundingClientRect().height) : 0;
      root.style.setProperty("--badge-h", `${h}px`);
    }
    function find() {
      const f = document.getElementById("nl-badge-frame");
      if (f === frame) return;
      if (frame) resize.unobserve(frame);
      frame = f;
      if (frame) resize.observe(frame);
      apply();
    }
    const watch = new MutationObserver(find);
    watch.observe(document.body, { childList: true });
    find();
    return () => {
      watch.disconnect();
      resize.disconnect();
    };
  }, []);
  return null;
}
