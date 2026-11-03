"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";
import { CLUSTERS, PRIMARY_NAV, PROPOSAL_HREF, SERVICE_FINDER_HREF, isActive } from "@/lib/nav";

// v2 header, Direction B (docs/v2/design/Header.dc.html, 05-SITE-SPEC.md §2): logo, full name and RC; seven nav
// items with a 2px gold underline on the active one; "Request a proposal" and "Book a Discovery Call" on the right.
// Services opens a mega-menu of the 7 clusters (3 services each). Below 1360px a Menu button opens a full-height panel.
export default function Header() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close both menus on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMegaOpen(false);
    setMenuOpen(false);
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    // Escape closes whichever menu is open and returns focus to the button that opened it.
    const onEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMegaOpen((open) => {
        if (open) megaButtonRef.current?.focus();
        return false;
      });
      setMenuOpen((open) => {
        if (open) menuButtonRef.current?.focus();
        return false;
      });
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  // The full-height panel stops the page behind it from scrolling and takes focus when it opens.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  const navClass = (active: boolean) =>
    `inline-flex min-h-11 items-center border-b-2 py-2 text-[15px] whitespace-nowrap transition-colors ${
      active ? "border-accent text-text font-medium" : "border-transparent text-text hover:text-primary"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg">
      <div className="mx-auto flex min-h-[68px] max-w-[1280px] items-center justify-between gap-5 px-4 md:px-6 min-[1360px]:min-h-[84px] lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3 text-text">
          <Image src="/images/logo.png" alt="" width={40} height={45} priority className="h-[34px] w-auto min-[1360px]:h-[45px]" />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="text-[13px] font-semibold sm:whitespace-nowrap min-[1360px]:text-[15px]">{SITE.titleName}</span>
            <span className="tabular text-xs text-muted">RC {SITE.rc}</span>
          </span>
          <span className="sr-only">, home page</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 min-[1360px]:flex">
          {PRIMARY_NAV.map((item) =>
            item.href === "/services" ? (
              <div key={item.href} className="relative" ref={megaRef}>
                <button
                  ref={megaButtonRef}
                  type="button"
                  aria-expanded={megaOpen}
                  aria-controls="services-menu"
                  onClick={() => setMegaOpen((v) => !v)}
                  className={`${navClass(isActive(pathname, item.href))} gap-1`}
                >
                  {item.label}
                  <span aria-hidden="true" className="text-[10px]">{megaOpen ? "▲" : "▼"}</span>
                </button>
                {megaOpen && (
                  <div
                    id="services-menu"
                    className="absolute left-1/2 top-full mt-3 grid w-[880px] -translate-x-1/2 grid-cols-4 gap-x-6 gap-y-5 rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6 shadow-[var(--shadow-menu)]"
                  >
                    {CLUSTERS.map((c) => (
                      <div key={c.slug}>
                        <Link href={c.path} className="block border-b border-border pb-1 text-sm font-semibold text-text hover:text-primary">
                          {c.name}
                        </Link>
                        <ul className="mt-2 space-y-1">
                          {c.top.map((s) => (
                            <li key={s.href}>
                              <Link href={s.href} className="block py-0.5 text-sm text-muted hover:text-primary">{s.label}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="flex flex-col justify-end gap-2 border-l border-border pl-6">
                      <Link href="/services" className="text-sm font-medium text-primary hover:underline">All services →</Link>
                      <Link href={SERVICE_FINDER_HREF} className="text-sm font-medium text-primary hover:underline">Service Finder →</Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href} aria-current={isActive(pathname, item.href) ? "page" : undefined} className={navClass(isActive(pathname, item.href))}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-4 min-[1360px]:flex">
          <Link href={PROPOSAL_HREF} className="whitespace-nowrap text-sm font-medium text-primary hover:underline">Request a proposal</Link>
          <a
            href={SITE.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-booking=""
            data-location="header"
            className="inline-flex min-h-11 items-center whitespace-nowrap rounded-md bg-primary px-4 text-[15px] font-medium text-white transition-colors hover:bg-secondary"
          >
            Book a Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span>
          </a>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex min-h-11 flex-none items-center gap-2 rounded-md border border-border bg-bg px-3 text-[15px] font-medium text-text min-[1360px]:hidden"
        >
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      {menuOpen && (
        <div
          id="site-menu"
          ref={panelRef}
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 top-[68px] z-50 overflow-y-auto border-t border-border bg-bg px-4 pb-28 pt-4 outline-none md:px-6 min-[1360px]:hidden"
        >
          <nav aria-label="Main">
            <ul className="divide-y divide-border">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  {item.href === "/services" ? (
                    <details>
                      <summary className="flex min-h-12 cursor-pointer items-center justify-between text-base text-text">
                        Services <span aria-hidden="true">+</span>
                      </summary>
                      <ul className="pb-3 pl-3">
                        {CLUSTERS.map((c) => (
                          <li key={c.slug}>
                            <Link href={c.path} className="flex min-h-11 items-center text-sm text-text">{c.name}</Link>
                          </li>
                        ))}
                        <li><Link href="/services" className="flex min-h-11 items-center text-sm font-medium text-primary">All services →</Link></li>
                        <li><Link href={SERVICE_FINDER_HREF} className="flex min-h-11 items-center text-sm font-medium text-primary">Service Finder →</Link></li>
                      </ul>
                    </details>
                  ) : (
                    <Link
                      href={item.href}
                      aria-current={isActive(pathname, item.href) ? "page" : undefined}
                      className={`flex min-h-12 items-center text-base ${isActive(pathname, item.href) ? "font-medium text-primary" : "text-text"}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 flex flex-col gap-3">
            <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" data-location="mobile_menu" className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-4 font-medium text-white">
              Book a Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span>
            </a>
            <Link href={PROPOSAL_HREF} className="inline-flex min-h-12 items-center justify-center rounded-md border border-primary px-4 font-medium text-primary">
              Request a proposal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
