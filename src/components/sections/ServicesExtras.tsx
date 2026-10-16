import SectionHeading from "@/components/ui/SectionHeading";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";
import CTAButton from "@/components/ui/CTAButton";
import { partnership, programmes } from "@/content/loaders";
import { PH, SHOW_PLACEHOLDERS } from "@/lib/placeholders";

const WRAP = "max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8";

// Signature programmes as problem → solution cards. CMS-driven; hidden in production until entries exist.
export function ProgrammesSection() {
  if (programmes.length === 0 && !SHOW_PLACEHOLDERS) return null;
  return (
    <section className="py-14">
      <div className={WRAP}>
        <SectionHeading eyebrow="Signature programmes" title="From problem to solution" />
        {programmes.length === 0 ? (
          <ClientPlaceholder text={PH.programmes} />
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {programmes.map((p) => (
              <li key={p.title} className="lift reveal rounded-md border border-border border-t-4 border-t-accent bg-bg p-6">
                <h3 className="text-lg font-semibold text-text">{p.title}</h3>
                <p className="mt-3 text-sm"><span className="font-semibold text-secondary">The problem: </span><span className="text-muted">{p.problem}</span></p>
                <p className="mt-2 text-sm"><span className="font-semibold text-secondary">The solution: </span><span className="text-muted">{p.solution}</span></p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

// "Partnership (formerly Retainership)" and the Quarterly Business Check-Up. Content: src/content/partnership.json
export function PartnershipBand() {
  return (
    <section className="dark-surface bg-secondary py-14">
      <div className={WRAP}>
        <SectionHeading tone="dark" eyebrow={`${partnership.title} (formerly ${partnership.formerlyCalled})`} title={partnership.checkupName} intro={partnership.intro} />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-md border-l-4 border-accent bg-white/5 p-5">
            <p className="text-white/90">{partnership.checkupDescription}</p>
            <p className="mt-3 text-sm text-accent">Output: the {partnership.reportName}</p>
          </div>
          <div className="rounded-md border-l-4 border-accent bg-white/5 p-5">
            <p className="text-white/90">{partnership.visitorAssessmentNote}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <CTAButton href="/assess" label="Assess your Business" variant="accent" />
              <CTAButton href="/contact#enquiry" label="Ask about Partnership" variant="outlineLight" />
            </div>
            <p className="mt-3"><ClientPlaceholder text={partnership.terms} /></p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function IpShowcase({ items }: { items: { slug: string; name: string; type: string }[] }) {
  if (items.length === 0 && !SHOW_PLACEHOLDERS) return null;
  return (
    <section className="mt-14 pt-10 border-t border-border">
      <h2 className="text-xl font-semibold text-text mb-4">Intellectual property we have supported</h2>
      {items.length === 0 ? (
        <ClientPlaceholder text={PH.ip} />
      ) : (
        <ul className="flex flex-wrap gap-2">
          {items.map((i) => <li key={i.slug} className="rounded-sm border border-border bg-surface px-3 py-1.5 text-sm text-text">{i.name} <span className="text-muted">· {i.type}</span></li>)}
        </ul>
      )}
    </section>
  );
}
