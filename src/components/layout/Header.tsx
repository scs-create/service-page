"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import CTAButton from "@/components/ui/CTAButton";
import SearchPalette from "@/components/layout/SearchPalette";
import { CLUSTERS, ServiceCategoryData } from "@/lib/types";
import { SITE } from "@/lib/site";

const NAV = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/tools", label: "Free Tools" },
  { href: "/corporate-college", label: "Corporate College" },
  { href: "/about", label: "About" },
  { href: "/verification", label: "Verification" },
  { href: "/contact", label: "Contact" },
];

type HeaderProps = { services: ServiceCategoryData[] };

export default function Header({ services }: HeaderProps) {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const megaButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const byCluster = (cluster: string) => services.filter((s) => s.cluster === cluster);
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const navClass = (active: boolean) =>
    `py-2 text-[15px] border-b-2 transition-colors ${active ? "border-accent text-primary font-semibold" : "border-transparent text-text hover:text-primary"}`;

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
      setMobileOpen((open) => {
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

  return (
    <>
      {/* Utility bar — direct lead channels, desktop only */}
      <div className="dark-surface hidden lg:block bg-secondary text-white text-sm">
        <div className="max-w-[1280px] mx-auto px-8 py-2 flex items-center justify-between">
          <p className="text-accent font-medium">{SITE.tagline}</p>
          <p className="flex items-center gap-6">
            <a href={`tel:${SITE.phoneHref}`} className="hover:text-accent">{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="hover:text-accent">{SITE.email}</a>
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-50 bg-bg border-b border-border">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-[72px] md:h-20">
            <Link href="/" className="shrink-0">
              <Image src="/images/logo.png" alt="Stephen Corporate Services — Home" width={64} height={72} priority className="h-14 md:h-16 w-auto" />
            </Link>

            <nav aria-label="Primary" className="hidden xl:flex items-center gap-6">
              <Link href="/" aria-current={isActive("/") ? "page" : undefined} className={navClass(isActive("/"))}>Home</Link>
              <div className="relative" ref={megaRef}>
                <button ref={megaButtonRef} type="button" aria-expanded={megaOpen} aria-controls="services-mega-menu" onClick={() => setMegaOpen((v) => !v)} className={`${navClass(isActive("/services"))} flex items-center gap-1`}>
                  Services
                  <span aria-hidden="true" className="text-xs">{megaOpen ? "▲" : "▼"}</span>
                </button>
                {megaOpen && (
                  <div id="services-mega-menu" className="absolute left-0 top-full mt-3 w-[780px] bg-bg border border-border border-t-4 border-t-accent rounded-md shadow-lg p-6 grid grid-cols-3 gap-6">
                    {CLUSTERS.map((cluster) => (
                      <div key={cluster.slug}>
                        <p className="font-semibold text-sm text-secondary mb-2 pb-1 border-b border-border">{cluster.name}</p>
                        <ul className="space-y-1">
                          {byCluster(cluster.slug).map((s) => (
                            <li key={s.slug}>
                              <Link href={`/services/${s.slug}`} className="text-sm text-muted hover:text-primary" onClick={() => setMegaOpen(false)}>{s.title}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="col-span-3 pt-3 border-t border-border flex gap-6">
                      <Link href="/services" className="text-sm font-medium text-primary hover:underline" onClick={() => setMegaOpen(false)}>View all services →</Link>
                      <Link href="/industries" className="text-sm font-medium text-primary hover:underline" onClick={() => setMegaOpen(false)}>Industries →</Link>
                    </div>
                  </div>
                )}
              </div>
              {NAV.map((l) => (
                <Link key={l.href} href={l.href} aria-current={isActive(l.href) ? "page" : undefined} className={navClass(isActive(l.href))}>{l.label}</Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <SearchPalette />
              {/* Persistent conversion CTA: always visible, desktop and mobile */}
              <CTAButton booking label="Book a Discovery Call" shortLabel="Book a Call" />
              <button ref={menuButtonRef} type="button" aria-expanded={mobileOpen} aria-controls="mobile-menu" aria-label={mobileOpen ? "Close menu" : "Open menu"} onClick={() => setMobileOpen((v) => !v)} className="xl:hidden min-h-11 min-w-11 flex items-center justify-center">
                <span aria-hidden="true" className="text-2xl leading-none">{mobileOpen ? "✕" : "☰"}</span>
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div id="mobile-menu" className="xl:hidden border-t border-border bg-bg px-4 py-4 max-h-[80vh] overflow-y-auto">
            <nav aria-label="Mobile" className="flex flex-col">
              <Link href="/" className="py-3 text-text" onClick={() => setMobileOpen(false)}>Home</Link>
              <button type="button" aria-expanded={mobileServicesOpen} aria-controls="mobile-services" onClick={() => setMobileServicesOpen((v) => !v)} className="py-3 text-left text-text flex justify-between items-center">
                Services <span aria-hidden="true">{mobileServicesOpen ? "−" : "+"}</span>
              </button>
              {mobileServicesOpen && (
                <div id="mobile-services" className="pl-4 pb-2">
                  {CLUSTERS.map((cluster) => (
                    <details key={cluster.slug} className="mb-2">
                      <summary className="text-sm font-semibold text-secondary cursor-pointer py-2">{cluster.name}</summary>
                      <ul className="pl-3 mt-1">
                        {byCluster(cluster.slug).map((s) => (
                          <li key={s.slug}><Link href={`/services/${s.slug}`} className="text-sm text-muted block py-2" onClick={() => setMobileOpen(false)}>{s.title}</Link></li>
                        ))}
                      </ul>
                    </details>
                  ))}
                  <Link href="/services" className="text-sm font-medium text-primary block pt-1" onClick={() => setMobileOpen(false)}>View all services →</Link>
                </div>
              )}
              {NAV.map((l) => (
                <Link key={l.href} href={l.href} className="py-3 text-text" onClick={() => setMobileOpen(false)}>{l.label}</Link>
              ))}
              <Link href="/industries" className="py-3 text-text" onClick={() => setMobileOpen(false)}>Industries</Link>
              <Link href="/faq" className="py-3 text-text" onClick={() => setMobileOpen(false)}>FAQ</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
