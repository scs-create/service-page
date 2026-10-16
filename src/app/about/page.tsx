import type { Metadata } from "next";
import TextBlock from "@/components/ui/TextBlock";
import TagList from "@/components/ui/TagList";
import SectionHeading from "@/components/ui/SectionHeading";
import PageHero from "@/components/ui/PageHero";
import ProcessStepper from "@/components/ui/ProcessStepper";
import CTAButton from "@/components/ui/CTAButton";
import { JourneyStage } from "@/components/ui/JourneyStage";
import LeadershipCard from "@/components/sections/LeadershipCard";
import { leadership } from "@/content/leadership";
import { APPROACH_STAGES } from "@/content/process";
import { ABOUT_INTRO, ABOUT_SECTIONS, INDUSTRIES, JOURNEY_STAGES, MISSION, VISION, type AboutSection } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Stephen Corporate Services Ltd (SCS): our leadership, specialist network, five-stage approach, client journey and the industries we serve.",
};

const WRAP = "max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8";

function Statement({ data }: { data: { heading: string; paragraphs: string[] } }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-text mb-3">{data.heading}</h2>
      <span aria-hidden="true" className="block h-1 w-10 bg-accent rounded-sm mb-4" />
      {data.paragraphs.map((p, i) => (
        <p key={i} className="text-muted mb-3 last:mb-0">{p}</p>
      ))}
    </div>
  );
}

function renderSection(s: AboutSection) {
  switch (s.type) {
    case "identity":
      return <TextBlock align="left" paragraphs={s.paragraphs} />;
    case "text":
      return (
        <>
          <SectionHeading eyebrow={s.eyebrow} title={s.title} />
          <TextBlock align="left" paragraphs={s.paragraphs} />
        </>
      );
    case "leadership":
      return (
        <>
          <SectionHeading eyebrow={s.eyebrow} title={s.title} intro={s.intro} />
          <div className="grid md:grid-cols-2 gap-6">
            {leadership.map((p) => (
              <LeadershipCard key={p.slug} profile={p} />
            ))}
          </div>
          <div className="mt-10 max-w-[75ch]">
            <h3 className="text-lg font-semibold text-text mb-3">{s.network.heading}</h3>
            {s.network.paragraphs.map((p, i) => (
              <p key={i} className="text-muted mb-4 last:mb-0">{p}</p>
            ))}
          </div>
        </>
      );
    case "vision-mission":
      return (
        <div className="grid md:grid-cols-2 gap-10">
          <Statement data={VISION} />
          <Statement data={MISSION} />
        </div>
      );
    case "process":
      return (
        <>
          <SectionHeading tone="dark" eyebrow="The SCS Enterprise Scale System™" title="From Idea to Institution" />
          <ProcessStepper steps={APPROACH_STAGES} tone="dark" />
        </>
      );
    case "journey":
      return (
        <>
          <SectionHeading eyebrow="Lifecycle support" title="The SCS Client Journey" />
          <div className="flex flex-col md:flex-row gap-6">
            {JOURNEY_STAGES.map((stage) => (
              <JourneyStage key={stage.label} label={stage.label} steps={stage.steps} />
            ))}
          </div>
        </>
      );
    case "industries":
      return (
        <>
          <SectionHeading eyebrow="Sectors" title="Our Industry Coverage" />
          <TagList items={INDUSTRIES} />
        </>
      );
    case "cta":
      return (
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-lg font-medium text-text mr-2">See the work and check the records for yourself.</p>
          <CTAButton href="/portfolio" label="View the portfolio" />
          <CTAButton href="/verification" label="Verify our registrations" variant="secondary" />
        </div>
      );
  }
}

export default function AboutPage() {
  // Alternate white / grey bands automatically; the process section is always navy.
  let n = 0;
  const bands = ABOUT_SECTIONS.map((s) => (s.type === "process" ? "dark-surface bg-secondary" : n++ % 2 === 0 ? "" : "bg-surface"));

  return (
    <>
      <PageHero breadcrumbs={[{ label: "About" }]} eyebrow="About SCS" title="About SCS" intro={ABOUT_INTRO} />
      {ABOUT_SECTIONS.map((s, i) => (
        <section key={`${s.type}-${i}`} id={s.type === "text" ? undefined : s.type} className={`${bands[i]} py-16`}>
          <div className={WRAP}>{renderSection(s)}</div>
        </section>
      ))}
    </>
  );
}
