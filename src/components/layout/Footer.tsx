import Link from "next/link";
import Image from "next/image";
import { services } from "@/content/services/data";
import ContactChannel from "@/components/ui/ContactChannel";
import CookieSettingsButton from "@/components/ui/CookieSettingsButton";
import { SITE, MAPS_URL } from "@/lib/site";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/verification", label: "Verification" },
  { href: "/tools", label: "Free Tools" },
  { href: "/industries", label: "Industries" },
  { href: "/corporate-college", label: "Corporate College" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/career", label: "Career" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const linkCls = "text-white/85 hover:text-accent";
  const headCls = "text-sm font-semibold uppercase tracking-wider text-accent mb-3";

  const serviceLinks = services.map((s) => (
    <li key={s.slug}>
      <Link href={`/services/${s.slug}`} className={linkCls}>
        {s.title}
      </Link>
    </li>
  ));

  return (
    <footer className="dark-surface bg-secondary text-white border-t-4 border-accent">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          {/* White tile: the logo's navy lettering needs a light ground */}
          <span className="inline-block rounded-md bg-white p-2">
            <Image src="/images/logo.png" alt="Stephen Corporate Services" width={72} height={81} className="h-16 w-auto" />
          </span>
          <p className="mt-4 text-accent font-medium">{SITE.tagline}</p>
          <p className="mt-2 text-sm text-white/85">
            Corporate services, regulatory compliance and business development support for Nigeria and cross-border markets.
          </p>
        </div>

        <div>
          <h2 className={headCls}>Quick Links</h2>
          <ul className="space-y-2 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkCls}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={headCls}>All Services</h2>
          <details className="md:hidden">
            <summary className="text-sm cursor-pointer text-white/85 mb-2">Show all {services.length} services</summary>
            <ul className="space-y-1.5 text-sm mt-2">{serviceLinks}</ul>
          </details>
          <ul className="hidden md:block space-y-1.5 text-sm max-h-72 overflow-y-auto pr-2">{serviceLinks}</ul>
        </div>

        <div>
          <h2 className={headCls}>Contact</h2>
          <address className="not-italic text-sm text-white/85 space-y-1">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {SITE.address.full}
              <span className="sr-only"> (opens map in new tab)</span>
            </a>
          </address>
          <div className="mt-2 flex flex-col">
            <ContactChannel tone="dark" type="phone" value={SITE.phoneHref} label={SITE.phone} />
            <ContactChannel tone="dark" type="email" value={SITE.email} label={SITE.email} />
            <ContactChannel tone="dark" type="linkedin" value={SITE.linkedin} label="LinkedIn" />
            <ContactChannel tone="dark" type="instagram" value={SITE.instagram} label="Instagram" />
            <ContactChannel tone="dark" type="facebook" value={SITE.facebook} label="Facebook" />
            <ContactChannel tone="dark" type="threads" value={SITE.threads} label="Threads" />
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:justify-between gap-2">
          <p className="text-xs text-white/80">© {year} {SITE.legalName} · RC {SITE.rc}. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs">
            <Link href="/terms" className={linkCls}>Terms of Use</Link>
            <Link href="/privacy" className={linkCls}>Privacy Notice</Link>
            <Link href="/cookies" className={linkCls}>Cookie Policy</Link>
            <CookieSettingsButton className="text-white/85 hover:text-accent min-h-11 text-xs underline" />
          </nav>
        </div>
      </div>
    </footer>
  );
}
