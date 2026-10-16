import SectionHeading from "@/components/ui/SectionHeading";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";
import { testimonials } from "@/content/loaders";
import { PH, SHOW_PLACEHOLDERS } from "@/lib/placeholders";

// Only genuine, consented testimonials (the schema rejects entries without consent: true).
// With none on file the section is hidden in production — no invented quotes, no empty box.
export default function Testimonials() {
  if (testimonials.length === 0 && !SHOW_PLACEHOLDERS) return null;
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <SectionHeading eyebrow="In their words" title="What clients say" />
        {testimonials.length === 0 ? (
          <ClientPlaceholder text={PH.testimonials} />
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <li key={t.name} className="lift rounded-md border border-border border-l-4 border-l-accent bg-surface p-6">
                <blockquote className="text-text">“{t.quote}”</blockquote>
                <p className="mt-4 text-sm font-semibold text-secondary">{t.name}</p>
                {(t.role || t.organisation) && <p className="text-sm text-muted">{[t.role, t.organisation].filter(Boolean).join(", ")}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
