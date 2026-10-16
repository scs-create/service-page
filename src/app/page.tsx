import Link from "next/link";
import CTAButton from "@/components/ui/CTAButton";
import StatCounter from "@/components/ui/StatCounter";
import SectionHeading from "@/components/ui/SectionHeading";
import ProcessStepper from "@/components/ui/ProcessStepper";
import CaseStudyCard from "@/components/ui/CaseStudyCard";
import IconTextItem from "@/components/ui/IconTextItem";
import ClosingStatement from "@/components/ui/ClosingStatement";
import DeliveryModes from "@/components/sections/DeliveryModes";
import LeadCapture from "@/components/sections/LeadCapture";
import HeroSkyline from "@/components/sections/HeroSkyline";
import ToolsTeaser from "@/components/sections/ToolsTeaser";
import Testimonials from "@/components/sections/Testimonials";
import { CLUSTERS } from "@/lib/types";
import { SITE } from "@/lib/site";
import { services } from "@/content/services/data";
import { featuredPortfolio } from "@/content/portfolio/data";
import { APPROACH_STAGES } from "@/content/process";

const DIFFERENTIATORS = [
  { label: "Multidisciplinary", text: "Multiple professional capabilities coordinated around one client objective." },
  { label: "Business-Centric", text: "We focus on practical business outcomes, not merely paperwork." },
  { label: "Technology-Enabled", text: "We use modern digital tools, automation, data and technology to improve how professional services are delivered." },
  { label: "Integrated", text: "Clients can access multiple corporate solutions through one coordinated platform." },
  { label: "Scalable", text: "Our solutions are designed for entrepreneurs, SMEs, growing companies, established enterprises and organisations with complex requirements." },
  { label: "Practical", text: "We translate complex corporate and regulatory requirements into understandable, actionable processes." },
  { label: "Continuous", text: "Our relationship does not have to end when the initial assignment is completed. We can continue supporting the business through recurring compliance, administration, operations, advisory and growth requirements." },
];

const WRAP = "max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="dark-surface bg-secondary">
        <div className={`${WRAP} py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center`}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">{SITE.tagline}</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              Build with structure. Operate with confidence. Grow with purpose.
            </h1>
            <p className="text-lg md:text-xl text-white/85 mt-5">
              One partner. Multiple solutions. One business objective.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href="/services" label="Explore Services" variant="accent" size="large" />
              <CTAButton booking label="Book a Discovery Call" variant="outlineLight" size="large" />
            </div>
            <p className="mt-8 text-sm text-white/80">
              Company formation · Regulatory compliance · Tax · Data protection · Operations · Growth
            </p>
          </div>
          <div className="hidden md:block"><HeroSkyline /></div>
        </div>
      </section>

      {/* METRICS */}
      <section aria-label="SCS in numbers" className="dark-surface bg-primary">
        <div className={`${WRAP} py-10 grid grid-cols-2 lg:grid-cols-4 gap-8`}>
          <StatCounter value={3000} suffix="+" label="Business registrations guided through the CAC by our founding team" />
          <StatCounter value={1800} suffix="+" label="Agreements processed" />
          <StatCounter value={1200} suffix="+" label="Client &amp; admin engagements" />
          <StatCounter value={10} suffix="+" label="Sectors actively served" />
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className={`${WRAP} py-16 md:py-20 grid lg:grid-cols-2 gap-10 items-start`}>
        <SectionHeading eyebrow="Who we are" title="A Business Support Partner, Not Just a Registration Office" />
        <div className="space-y-4 text-base text-muted">
          <p>
            Stephen Corporate Services Ltd (SCS) is a business-support company providing integrated solutions to businesses, entrepreneurs, organisations, investors and institutions. Before SCS launched, its founding team had already guided more than 3,000 businesses through CAC registration. Building on this experience, SCS helps clients in Nigeria and across borders establish appropriate corporate structures, meet their regulatory and compliance obligations, and achieve sustainable growth. Through integrated corporate, regulatory and operational support, we provide one accountable point of coordination, simplifying business administration and reducing the need to manage multiple service providers.
          </p>
          <p>
            We exist because most businesses do not fail from a lack of ambition — they fail from a lack of structure. SCS builds that structure: the documents, the filings, the policies, the systems and the compliance posture that let a business function, scale and survive scrutiny.
          </p>
          <CTAButton href="/about" label="About SCS →" variant="text" />
        </div>
      </section>

      {/* SERVICE HUB */}
      <section className="bg-surface py-16 md:py-20">
        <div className={WRAP}>
          <SectionHeading
            eyebrow="What we do"
            title="Corporate services for every stage of the business"
            intro="Six areas of support, one accountable partner — from formation to long-term growth."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {CLUSTERS.map((cluster) => {
              const items = services.filter((s) => s.cluster === cluster.slug);
              const shown = items.slice(0, 4);
              return (
                <article key={cluster.slug} className="bg-bg border border-border border-t-4 border-t-primary rounded-md p-6">
                  <h3 className="text-lg font-semibold text-text">{cluster.name}</h3>
                  <p className="text-sm text-muted mt-1">{items.length} service areas</p>
                  <ul className="mt-4 space-y-2">
                    {shown.map((s) => (
                      <li key={s.slug}>
                        <Link href={`/services/${s.slug}`} className="text-sm text-primary hover:underline">
                          {s.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  {items.length > shown.length && (
                    <Link href={`/services#${cluster.slug}`} className="mt-4 inline-block text-sm font-medium text-secondary hover:underline">
                      + {items.length - shown.length} more in {cluster.name} →
                    </Link>
                  )}
                </article>
              );
            })}
          </div>
          <div className="mt-8">
            <CTAButton href="/services" label="View all services" variant="secondary" />
          </div>
        </div>
      </section>

      <ToolsTeaser />

      {/* PROCESS */}
      <section className="dark-surface bg-secondary py-16 md:py-20">
        <div className={WRAP}>
          <SectionHeading
            tone="dark"
            eyebrow="The SCS Enterprise Scale System™"
            title="From Idea to Institution"
            intro="Every engagement follows the same disciplined path — whatever the sector, whatever the size of the business."
          />
          <ProcessStepper steps={APPROACH_STAGES} tone="dark" />
          <DeliveryModes tone="dark" />
        </div>
      </section>

      {/* PROOF PREVIEW */}
      <section className={`${WRAP} py-16 md:py-20`}>
        <SectionHeading
          eyebrow="Selected work"
          title="Businesses We Have Helped Build"
          intro="A selection of engagements completed since 2025. Confidential commercial details are withheld in line with client confidentiality."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featuredPortfolio.map((entry) => (
            <CaseStudyCard key={entry.slug} entry={entry} variant="compact" />
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <CTAButton href="/portfolio" label="View the full portfolio" />
          <CTAButton href="/verification" label="Verify our registrations" variant="secondary" />
        </div>
      </section>

      <Testimonials />

      {/* WHY SCS */}
      <section className="bg-surface py-16 md:py-20">
        <div className={WRAP}>
          <SectionHeading eyebrow="Why SCS" title="What sets our work apart" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {DIFFERENTIATORS.map((d) => (
              <IconTextItem key={d.label} primary={d.label} secondary={d.text} />
            ))}
          </div>
        </div>
      </section>

      <LeadCapture />

      {/* PROMISE + CLOSING + FINAL CTA */}
      <section className="dark-surface bg-secondary py-16 md:py-24">
        <div className={WRAP}>
          <span aria-hidden="true" className="block h-1 w-14 bg-accent rounded-sm mx-auto mb-6" />
          <p className="max-w-[62ch] mx-auto text-center text-xl md:text-2xl text-white/90">
            Businesses need structure, people, systems, information, technology, compliance, customers, strategy — and, above all, they need a reliable partner capable of helping them navigate the complexity that comes with building and operating an organisation.
          </p>
          <div className="mt-10">
            <ClosingStatement tone="dark" lines={["From idea to company.", "From structure to strategy.", "From compliance to confidence.", "From startup to scale."]} />
          </div>
          <div className="mt-12 pt-12 border-t border-white/15 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-white">Let&apos;s build what&apos;s next.</h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <CTAButton booking label="Book a Discovery Call" variant="accent" size="large" />
              <CTAButton href="/contact" label="Get in Touch" variant="outlineLight" size="large" />
            </div>
            <p className="mt-6 text-sm text-white/85">
              Or reach us directly:{" "}
              <a href={`tel:${SITE.phoneHref}`} className="underline hover:text-accent">{SITE.phone}</a>
              {" · "}
              <a href={`mailto:${SITE.email}`} className="underline hover:text-accent">{SITE.email}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
