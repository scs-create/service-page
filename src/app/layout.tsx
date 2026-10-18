import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/ui/JsonLd";
import Analytics from "@/components/ui/Analytics";
import CookieBanner from "@/components/ui/CookieBanner";
import ContactDock from "@/components/layout/ContactDock";
import TrackClicks from "@/components/ui/TrackClicks";
import { services } from "@/content/services/data";
import { SITE } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const DESCRIPTION =
  "Stephen Corporate Services Ltd (SCS) is a multidisciplinary corporate services, business support, consulting and advisory company providing integrated solutions to businesses, entrepreneurs, organisations, investors and institutions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
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
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${SITE.name} — ${SITE.tagline}` }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#011550" };

const organisationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE.legalName,
  alternateName: SITE.name,
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
  areaServed: "Nigeria",
  identifier: `RC ${SITE.rc}`,
  sameAs: [SITE.linkedin, SITE.instagram, SITE.facebook, SITE.threads, SITE.x],
  founder: { "@type": "Person", name: "Stephen Onyekeja" },
};

const navServices = services.map(({ slug, title, cluster }) => ({ slug, title, cluster }));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <JsonLd data={organisationSchema} />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        {/* First in the focus order (after the skip link) so keyboard users reach the choice straight away; it is fixed to the bottom visually. */}
        <CookieBanner />
        <Header services={navServices} />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <ContactDock />
        <TrackClicks />
        <Analytics />
      </body>
    </html>
  );
}
