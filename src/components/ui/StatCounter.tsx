"use client";

import { useEffect, useRef, useState } from "react";

type StatCounterProps = { value: number; suffix?: string; label: string };

// Count-up runs once when scrolled into view. The final value is what the server
// renders (SEO / no-JS), and prefers-reduced-motion users never see the animation.
export default function StatCounter({ value, suffix = "", label }: StatCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const duration = 1400;
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          setDisplay(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  const fmt = (n: number) => n.toLocaleString("en-US");

  return (
    <div ref={ref}>
      <p className="text-4xl md:text-5xl font-semibold text-white tabular-nums">
        <span aria-hidden="true">
          {fmt(display)}
          {suffix}
        </span>
        <span className="sr-only">
          {fmt(value)}
          {suffix}
        </span>
      </p>
      <p className="mt-1 text-sm md:text-base text-white/90">{label}</p>
    </div>
  );
}
