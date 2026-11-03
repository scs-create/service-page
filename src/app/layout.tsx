import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { CLUSTERS } from "@/lib/navClusters";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/ui/JsonLd";
import Analytics from "@/components/ui/Analytics";
import CookieBanner from "@/components/ui/CookieBanner";
import MobileBar from "@/components/layout/MobileBar";
import TrackClicks from "@/components/ui/TrackClicks";
import UtmCapture from "@/components/ui/UtmCapture";
import { SITE, IS_PRODUCTION } from "@/lib/site";

// Self-hosted at build time by next/font (no request to Google from visitors), font-display swap. Only the Latin
// subset is preloaded; Latin Extended (and the others) stay declared by unicode-range and load only on a page that
// uses those characters (QA: preloading Latin Extended cost about 106 KB on every page). Direction B: Source Serif 4
// 600 for H1/H2, Inter for everything else.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});

const DESCRIPTION =
  "Stephen Corporate Services - SCS Ltd is a multidisciplinary corporate services, business support, consulting and advisory company providing integrated solutions to businesses, entrepreneurs, organisations, investors and institutions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...(IS_PRODUCTION ? {} : { robots: { index: false, follow: false } }), // previews are never indexed
  title: {
    default: `${SITE.titleName} | Corporate Services Partner`,
    template: `%s | ${SITE.titleName}`,
  },
  description: DESCRIPTION,
  applicationName: SITE.name,
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_NG",
    title: `${SITE.titleName} | Corporate Services Partner`,
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${SITE.name}: ${SITE.tagline}` }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#011550" };

// Organization + ProfessionalService (05-SITE-SPEC.md §6; 02-DECISIONS.md §3: never a legal-service type).
const organisationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE.url}/#organization`,
  name: SITE.legalName,
  legalName: SITE.legalName,
  alternateName: SITE.shortName,
  slogan: SITE.tagline,
  url: SITE.url,
  logo: `${SITE.url}/images/logo.png`,
  image: `${SITE.url}/og-image.png`,
  email: SITE.email,
  telephone: SITE.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    addressCountry: "NG",
  },
  areaServed: ["Nigeria", "Worldwide"],
  identifier: { "@type": "PropertyValue", propertyID: "RC (Corporate Affairs Commission, Nigeria)", value: SITE.rc },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "17:00",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: "+234-812-813-8222",
    email: SITE.email,
    areaServed: "Worldwide",
    availableLanguage: ["English"],
    hoursAvailable: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" },
  },
  sameAs: [SITE.linkedin, SITE.instagram, SITE.facebook, SITE.threads, SITE.x],
  founder: { "@type": "Person", name: "Stephen Onyekeja" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable} h-full`}>
      <body className="min-h-full flex flex-col pb-[calc(70px+env(safe-area-inset-bottom))] md:pb-0">
        <JsonLd data={organisationSchema} />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {/* First in the focus order (after the skip link) so keyboard users reach the choice straight away; it is fixed to the bottom visually. */}
        <CookieBanner />
        <Header clusters={CLUSTERS} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <MobileBar />
        <TrackClicks />
        <UtmCapture />
        <Analytics />
      </body>
    </html>
  );
}
