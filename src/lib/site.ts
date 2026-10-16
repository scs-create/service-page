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
  privacy: `info@${DOMAIN}`,
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
  whatsappHref: "2349064035713", // wa.me/<number> — confirm this number is active on WhatsApp
  // ⚠ Address variants in client documents: "Karsana" (portfolio, legal docs) vs "Gwarinpa" (Growth Portfolio deck);
  //   "Benhen" vs "Belham" Estate. Awaiting client confirmation — change here and legal pages follow.
  address: {
    street: "SD20 Benhen Estate, Karsana",
    region: "FCT",
    city: "Abuja",
    country: "Nigeria",
    full: "SD20 Benhen Estate, Karsana, FCT, Abuja, Nigeria",
  },
  linkedin: "https://www.linkedin.com/company/stephen-corporate-services/",
  threads: "https://www.threads.com/@stephen_corporate_services",
  instagram: "https://www.instagram.com/stephen_corporate_services",
  facebook: "https://web.facebook.com/profile.php?id=61593570197715",
  // Optional online booking page (Cal.com / Calendly). Set NEXT_PUBLIC_BOOKING_URL in Netlify; empty = placeholder.
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
  academyUrl: "https://stephencorporateservicesacademy.com",
  // CAC website only. The old deep link to the public-search portal returned 404, so visitors are given instructions instead.
  cacUrl: "https://www.cac.gov.ng",
  rc: "9041457", // SCS's own CAC registration number (confirmed by the client)
} as const;

export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(SITE.address.full);
