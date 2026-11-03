import Link from "next/link";
import CookieSettingsButton from "@/components/ui/CookieSettingsButton";
import { SITE } from "@/lib/site";
import { CLUSTERS, COMPANY_LINKS, POLICY_LINKS } from "@/lib/nav";

const SOCIAL = [
  { label: "LinkedIn", href: SITE.linkedin },
  { label: "Instagram", href: SITE.instagram },
  { label: "Facebook", href: SITE.facebook },
  { label: "Threads", href: SITE.threads },
  { label: "X", href: SITE.x },
];

// v2 footer, Direction B (docs/v2/design/Footer.dc.html, 05-SITE-SPEC.md §2): a navy band with a 4px gold top edge.
// The service list is printed once (the 7 clusters); social links are text labels, never raw URLs.
export default function Footer() {
  const year = new Date().getFullYear();
  const link = "text-white hover:text-accent hover:underline";
  const head = "mb-3 text-base font-semibold text-white";

  return (
    <footer className="dark-surface border-t-4 border-accent bg-secondary text-sm leading-relaxed text-white">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-10 px-4 pb-8 pt-14 sm:grid-cols-2 md:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <p className={head}>{SITE.titleName}</p>
          <p className="tabular text-white/85">RC {SITE.rc}</p>
          <address className="not-italic">
            <p className="text-white/85">{SITE.address.full}</p>
            <p className="mt-3 text-white/85">{SITE.hours}</p>
            <p className="mt-3">
              <a href={`tel:${SITE.phoneHref}`} className={link}>{SITE.phone}</a>{" "}
              <span className="text-white/85">(phone and WhatsApp)</span>
            </p>
            <p><a href={`mailto:${SITE.email}`} className={`${link} break-all`}>{SITE.email}</a></p>
          </address>
          <p className="mt-3 text-white/85">{SITE.responsePromise}</p>
        </div>

        <nav aria-label="Services">
          <p className={head}>Services</p>
          <ul className="space-y-1.5">
            {CLUSTERS.map((c) => (
              <li key={c.slug}><Link href={c.path} className={link}>{c.name}</Link></li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Company">
          <p className={head}>SCS</p>
          <ul className="space-y-1.5">
            {COMPANY_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div>
          <nav aria-label="Policies">
            <p className={head}>Policies</p>
            <ul className="space-y-1.5">
              {POLICY_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className={link}>{l.label}</Link></li>
              ))}
              <li><CookieSettingsButton className="min-h-11 text-left text-white underline hover:text-accent" /></li>
            </ul>
          </nav>
          <nav aria-label="Social media" className="mt-6">
            <p className={head}>Follow SCS</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {s.label}<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-2 px-4 py-5 text-white/85 md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p>© {year} {SITE.titleName}. {SITE.tagline}</p>
          <a href={SITE.academyUrl} target="_blank" rel="noopener noreferrer" className={link}>
            Stephen Corporate Academy (SCA)<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in new tab)</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
