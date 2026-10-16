import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ProcessStepper from "@/components/ui/ProcessStepper";
import ContactChannel from "@/components/ui/ContactChannel";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";
import ConsultationForm from "@/components/sections/ConsultationForm";
import { industries } from "@/content/loaders";
import { ENGAGEMENT_STEPS } from "@/content/process";
import { PH, SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { SITE, MAPS_URL, EMAIL_ROUTING } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact Stephen Corporate Services Ltd in Abuja, Nigeria. Book a consultation, call ${SITE.phone}, message us on WhatsApp or email ${SITE.email}.`,
};

const WRAP = "max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8";

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Contact" title="Speak with SCS" intro="Choose whichever channel works best for you — we'll respond directly." />

      <section className={`${WRAP} py-14 grid lg:grid-cols-[380px_minmax(0,1fr)] gap-10 items-start`}>
        <div className="rounded-md border border-border border-t-4 border-t-primary bg-surface p-6">
          <h2 className="text-lg font-semibold text-text mb-2">Direct channels</h2>
          <div className="divide-y divide-border">
            <ContactChannel type="phone" value={SITE.phoneHref} label="Call SCS" detail={SITE.phone} />
            <ContactChannel type="whatsapp" value={SITE.whatsappHref} label="Message SCS on WhatsApp" detail={SITE.phone} />
            <ContactChannel type="email" value={SITE.email} label="Email SCS" detail={SITE.email} />
            <ContactChannel type="linkedin" value={SITE.linkedin} label="LinkedIn" detail="Stephen Corporate Services" />
            <ContactChannel type="instagram" value={SITE.instagram} label="Instagram" detail="@stephen_corporate_services" />
            <ContactChannel type="facebook" value={SITE.facebook} label="Facebook" detail="Stephen Corporate Services" />
            <ContactChannel type="threads" value={SITE.threads} label="Threads" detail="@stephen_corporate_services" />
          </div>
          <p className="mt-2 space-y-1"><ClientPlaceholder text={PH.whatsapp} /> <ClientPlaceholder text={PH.primaryEmail} /></p>

          <h2 className="text-lg font-semibold text-text mt-6 mb-2">Who to write to</h2>
          <ul className="space-y-2 text-sm">
            {EMAIL_ROUTING.map((e) => (
              <li key={e.address}>
                <span className="block text-muted">{e.label}</span>
                <a href={`mailto:${e.address}`} className="break-all text-primary hover:underline">{e.address}</a>
              </li>
            ))}
          </ul>

          <h2 className="text-lg font-semibold text-text mt-6 mb-1">Office</h2>
          <address className="not-italic text-sm text-muted">{SITE.address.full}</address>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">View on map<span className="sr-only"> (opens in new tab)</span> ↗</a>
          <p className="mt-1"><ClientPlaceholder text={PH.address} /></p>
          <p className="mt-4 text-sm text-muted">Nationwide Nigeria, with cross-border client support.</p>
        </div>

        <div id="enquiry">
          <h2 className="text-2xl font-semibold text-text">Book a complimentary consultation</h2>
          <span aria-hidden="true" className="block h-1 w-12 bg-accent rounded-sm mt-3 mb-6" />
          <div className="max-w-[640px]"><ConsultationForm sectors={industries.map((i) => i.name)} /></div>
        </div>
      </section>

      {(SITE.bookingUrl || SHOW_PLACEHOLDERS) && (
        <section className="py-10">
          <div className={WRAP}>
            <div className="rounded-md border border-border border-l-4 border-l-accent bg-surface p-6">
              <h2 className="text-xl font-semibold text-text">Prefer to pick a time yourself?</h2>
              {SITE.bookingUrl ? (
                <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-track="Open booking calendar" className="mt-3 inline-flex min-h-11 items-center rounded-md bg-primary px-6 py-3 font-medium text-white hover:bg-secondary">Open the booking calendar<span className="sr-only"> (opens in new tab)</span> ↗</a>
              ) : (
                <p className="mt-3"><ClientPlaceholder text={PH.booking} /></p>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="bg-surface py-14">
        <div className={WRAP}>
          <SectionHeading eyebrow="What happens next" title="A Clear Path, Every Time" intro="Whichever channel you use, this is how every engagement runs." />
          <ProcessStepper steps={ENGAGEMENT_STEPS} />
        </div>
      </section>

      <section className={`${WRAP} py-10`}>
        <p className="text-sm text-muted">Looking to work with us? <Link href="/career" className="text-primary font-medium hover:underline">Join Us / Career</Link></p>
      </section>
    </>
  );
}
