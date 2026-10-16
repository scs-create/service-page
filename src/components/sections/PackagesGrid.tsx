import SectionHeading from "@/components/ui/SectionHeading";
import CTAButton from "@/components/ui/CTAButton";
import { SUPPORT_PACKAGES } from "@/content/loaders";

export default function PackagesGrid() {
  return (
    <section id="packages" className="bg-surface py-14">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Managed support"
          title="Packages for ongoing business support"
          intro="Each package has a defined scope, service level, exclusions, fees, reporting frequency and escalation process."
        />
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SUPPORT_PACKAGES.map((p) => (
            <li key={p.id} className="lift reveal bg-bg border border-border border-t-4 border-t-accent rounded-md p-6">
              <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent font-semibold text-secondary">{p.id}</span>
              <h3 className="mt-3 text-lg font-semibold text-text"><span className="sr-only">Package {p.id}: </span>{p.name}</h3>
              <p className="text-sm font-medium text-primary">{p.audience}</p>
              <p className="mt-2 text-sm text-muted">{p.includes}</p>
            </li>
          ))}
        </ul>
        <div className="mt-8"><CTAButton href="/contact#enquiry" label="Discuss a package" /></div>
      </div>
    </section>
  );
}
