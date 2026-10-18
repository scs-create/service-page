import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ProcessStepper from "@/components/ui/ProcessStepper";
import SocialLinks from "@/components/ui/SocialLinks";
import ContactChannel from "@/components/ui/ContactChannel";
import CTAButton from "@/components/ui/CTAButton";
import ConsultationForm from "@/components/sections/ConsultationForm";
import { industries } from "@/content/loaders";
import { ENGAGEMENT_STEPS } from "@/content/process";
import { SITE, MAPS_URL, EMAIL_ROUTING } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact Stephen Corporate Services Ltd in Abuja, Nigeria. Book a free Discovery Call, call ${SITE.phone}, message us on WhatsApp or email ${SITE.email}.`,
};

const WRAP = "max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8";

export default function ContactPage() {
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Contact" }]} eyebrow="Contact" title="Speak with SCS" intro="Choose whichever channel works best for you, and we'll respond directly." />

      <section className={`${WRAP} py-14 grid lg:grid-cols-[380px_minmax(0,1fr)] gap-10 items-start`}>
        <div data-location="contact_channels" className="rounded-md border border-border border-t-4 border-t-primary bg-surface p-6">
          <h2 className="text-lg font-semibold text-text mb-2">Direct channels</h2>
          <div className="divide-y divide-border">
            <ContactChannel type="phone" value={SITE.phoneHref} label="Call SCS" detail={SITE.phone} />
            <ContactChannel type="whatsapp" value={SITE.whatsappHref} label="Message SCS on WhatsApp" detail={SITE.phone} />
            <ContactChannel type="email" value={SITE.email} label="Email SCS" detail={SITE.email} />
          </div>
          <h2 className="text-lg font-semibold text-text mt-6 mb-2">Follow us</h2>
          <SocialLinks />

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
          <p className="mt-4 text-sm text-muted">Nationwide Nigeria, with cross-border client support.</p>
        </div>

        <div>
          <div data-location="contact_booking" className="mb-10 rounded-md border border-border border-t-4 border-t-accent bg-bg p-6">
            <h2 className="text-2xl font-semibold text-text">Book a free Discovery Call</h2>
            <p className="mt-2 text-muted">Pick a 30-minute slot that suits you on our Cal.com calendar. We will talk through what your business needs and the right next step.</p>
            <div className="mt-4"><CTAButton booking label="Book a Discovery Call" /></div>
          </div>
          <h2 id="enquiry" className="scroll-mt-28 text-2xl font-semibold text-text">Or send us an enquiry</h2>
          <span aria-hidden="true" className="block h-1 w-12 bg-accent rounded-sm mt-3 mb-6" />
          <div className="max-w-[640px]"><ConsultationForm sectors={industries.map((i) => i.name)} /></div>
        </div>
      </section>

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
