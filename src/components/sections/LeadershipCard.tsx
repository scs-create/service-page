import BrandImage from "@/components/ui/BrandImage";
import ClientPlaceholder from "@/components/ui/ClientPlaceholder";
import { PH } from "@/lib/placeholders";
import TagList from "@/components/ui/TagList";
import type { LeadershipProfile } from "@/lib/types";

// Photo and bio appear automatically once added to src/content/leadership.ts; until then a monogram is shown.
export default function LeadershipCard({ profile: p }: { profile: LeadershipProfile }) {
  return (
    <article className="lift bg-bg border border-border border-t-4 border-t-accent rounded-md p-6 flex gap-5">
      {p.photo ? (
        <BrandImage src={p.photo} alt={`Portrait of ${p.name}`} width={72} height={72} className="rounded-full" />
      ) : (
        <span aria-hidden="true" className="shrink-0 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-secondary text-accent text-xl font-semibold">
          {p.initials}
        </span>
      )}
      <div>
        <h3 className="text-xl font-semibold text-text">{p.name}</h3>
        <p className="text-sm font-medium text-primary">{p.role}</p>
        {p.credentials && <p className="text-sm text-muted mt-1">{p.credentials}</p>}
        {p.bio ? <p className="mt-3 text-sm text-muted">{p.bio}</p> : <p className="mt-3"><ClientPlaceholder text={PH.bios} /></p>}
        <div className="mt-4"><TagList items={p.focus} /></div>
        <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
          LinkedIn profile<span className="sr-only"> of {p.name} (opens in new tab)</span> ↗
        </a>
      </div>
    </article>
  );
}
