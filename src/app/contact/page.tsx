import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SocialLinks from "@/components/ui/SocialLinks";
import ConsultationForm from "@/components/sections/ConsultationForm";
import { industries } from "@/content/loaders";
import { PROPOSAL_HREF } from "@/lib/nav";
import { SITE, MAPS_URL, EMAIL_ROUTING } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE.titleName} in Abuja, Nigeria. Book a Discovery Call, send an enquiry, call or WhatsApp ${SITE.phone} or email ${SITE.email}. ${SITE.responsePromise}`,
  alternates: { canonical: "/contact" },
};

const WRAP = "mx-auto max-w-[1280px] px-4 md:px-6 lg:px-8";
const AFTER = ["You receive a reference number by email.", "The right person at SCS reviews your enquiry.", "We reply within 24 hours.", "We arrange a call or prepare a proposal."];

// F: Contact (05-SITE-SPEC.md §3, design/Contact.dc.html). Office hours are text only; there is no "open now" indicator.
// The enquiry form moves to the Worker (Turnstile, D1, reference number, What happens next panel) in the forms PR.
export default function ContactPage() {
  const card = "flex flex-col rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6";
  return (
    <>
      <PageHero breadcrumbs={[{ label: "Contact" }]} eyebrow="Contact" title="Talk to SCS" intro={`Choose whichever suits you. ${SITE.responsePromise}`}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className={card}>
            <h2 className="font-sans text-lg font-semibold text-text">Book a Discovery Call</h2>
            <p className="mb-4 mt-1 flex-1 text-sm text-muted">30 minutes by video, at a time that suits you.</p>
            <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-booking="" data-location="contact_options" className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 font-medium text-white hover:bg-secondary">
              Book a Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span>
            </a>
          </div>
          <div className={card}>
            <h2 className="font-sans text-lg font-semibold text-text">Send an enquiry</h2>
            <p className="mb-4 mt-1 flex-1 text-sm text-muted">Tell us what you need in a few lines.</p>
            <a href="#enquiry" className="font-medium text-primary hover:underline">Go to the form →</a>
          </div>
          <div className={card}>
            <h2 className="font-sans text-lg font-semibold text-text">Request a proposal</h2>
            <p className="mb-4 mt-1 flex-1 text-sm text-muted">For organisations with a formal brief or tender.</p>
            <Link href={PROPOSAL_HREF} className="font-medium text-primary hover:underline">Request a proposal →</Link>
          </div>
        </div>
      </PageHero>

      <div className={`${WRAP} grid items-start gap-12 py-12 md:py-20 lg:grid-cols-[minmax(0,1fr)_380px]`}>
        <section aria-labelledby="enquiry">
          <h2 id="enquiry" className="type-h2 scroll-mt-28 text-text">Send an enquiry</h2>
          <span aria-hidden="true" className="mb-6 mt-4 block h-1 w-14 rounded-sm bg-accent" />
          <div className="max-w-[640px]"><ConsultationForm sectors={industries.map((i) => i.name)} /></div>
        </section>

        <aside aria-label="Other ways to reach us" className="flex flex-col gap-6">
          <div data-location="contact_channels" className="rounded-sm border border-border bg-surface p-6">
            <h2 className="font-sans text-lg font-semibold text-text">Reach a person</h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-muted">Phone and WhatsApp</dt>
                <dd className="font-medium">
                  <a href={`tel:${SITE.phoneHref}`} data-track="Contact Call" className="text-primary hover:underline">{SITE.phone}</a> ·{" "}
                  <a href={`https://wa.me/${SITE.whatsappHref}`} target="_blank" rel="noopener noreferrer" data-track="Contact WhatsApp" className="text-primary hover:underline">
                    WhatsApp<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in new tab)</span>
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd><a href={`mailto:${SITE.email}`} className="break-all font-medium text-primary hover:underline">{SITE.email}</a></dd>
              </div>
              <div>
                <dt className="text-muted">Office</dt>
                <dd className="text-text">
                  {SITE.address.full}{" "}
                  <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="whitespace-nowrap font-medium text-primary hover:underline">
                    Map<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in new tab)</span>
                  </a>
                </dd>
              </div>
              <div><dt className="text-muted">Office hours</dt><dd className="text-text">{SITE.hours}</dd></div>
            </dl>
            <h3 className="mb-2 mt-6 text-sm font-semibold text-text">Who to write to</h3>
            <ul className="space-y-2 text-sm">
              {EMAIL_ROUTING.map((e) => (
                <li key={e.address}><span className="block text-muted">{e.label}</span><a href={`mailto:${e.address}`} className="break-all text-primary hover:underline">{e.address}</a></li>
              ))}
            </ul>
            <h3 className="mb-2 mt-6 text-sm font-semibold text-text">Follow SCS</h3>
            <SocialLinks />
          </div>
          <div className="rounded-sm border border-border border-t-4 border-t-accent bg-bg p-6">
            <h2 className="font-sans text-lg font-semibold text-text">What happens after you contact us</h2>
            <ol className="mt-4 space-y-3 text-sm">
              {AFTER.map((t, i) => (
                <li key={t} className="flex gap-3"><span className="tabular w-5 flex-none font-semibold text-primary">{i + 1}</span><span>{t}</span></li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </>
  );
}
