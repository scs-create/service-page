// SINGLE SOURCE OF TRUTH for verified business details.
// Header, Footer, Contact page, legal pages, JSON-LD and the sitemap all read from here.

const DOMAIN = "stephencorporateservices-scs.com";

// Google Workspace mailboxes. Who gets what:
//  contact  → default public address (header, footer, JSON-LD, CTAs) + career applications
//  sales    → consultations, assessments, training requests (all lead forms)
//  info     → information, partnerships, complaints
//  accounts → invoices and payments
//  admin    → INTERNAL ONLY (Workspace admin, Netlify/CMS/Plausible accounts). Never rendered on the site.
export const EMAILS = {
  admin: `admin@${DOMAIN}`,
  contact: `contact@${DOMAIN}`,
  info: `info@${DOMAIN}`,
  sales: `sales@${DOMAIN}`,
  accounts: `accounts@${DOMAIN}`,
  // No privacy@ alias exists yet, so data-protection requests use info@.
  // Create privacy@ in Google Workspace, then change ONLY this line.
  privacy: `privacy@${DOMAIN}`,
} as const;

// Shown on the Contact page ("Who to write to").
export const EMAIL_ROUTING = [
  { address: EMAILS.sales, label: "Consultations & new business" },
  { address: EMAILS.info, label: "Information, partnerships & complaints" },
  { address: EMAILS.accounts, label: "Invoices & payments" },
] as const;

export const SITE = {
  name: "Stephen Corporate Services",
  legalName: "Stephen Corporate Services Ltd",
  shortName: "SCS",
  tagline: "Elevate Your Company, Go Global.",
  domain: DOMAIN,
  // Netlify injects URL at build time; NEXT_PUBLIC_SITE_URL overrides it.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? `https://${DOMAIN}`,
  email: EMAILS.contact,
  phone: "+234 906 403 5713",
  phoneHref: "+2349064035713",
  whatsappHref: "2349064035713", // wa.me/<number> — active on WhatsApp (confirmed by the client)
  // Confirmed by the client (18 October 2026): Belham Estate, Karsana. Legal pages read it from here.
  address: {
    street: "SD20 Belham Estate, Karsana",
    region: "FCT",
    city: "Abuja",
    country: "Nigeria",
    full: "SD20 Belham Estate, Karsana, FCT, Abuja, Nigeria",
  },
  linkedin: "https://www.linkedin.com/company/stephen-corporate-services/",
  threads: "https://www.threads.com/@stephen_corporate_services",
  instagram: "https://www.instagram.com/stephen_corporate_services",
  facebook: "https://web.facebook.com/profile.php?id=61593570197715",
  // Discovery Call on Cal.com (free). Every "Book" call to action opens it in a new tab.
  // NEXT_PUBLIC_BOOKING_URL in Netlify overrides it; an empty value falls back to this default.
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || "https://cal.com/support-stephen-corporate-services-scs/30min",
  academyUrl: "https://stephencorporateservicesacademy.com",
  // CAC website only. The old deep link to the public-search portal returned 404, so visitors are given instructions instead.
  cacUrl: "https://www.cac.gov.ng",
  rc: "9041457", // SCS's own CAC registration number (confirmed by the client)
} as const;

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(SITE.address.full);
