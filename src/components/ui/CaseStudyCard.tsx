import { registrationLabel } from "@/lib/types";
import Link from "next/link";
import { PortfolioEntry } from "@/lib/types";
import { SERVICE_LINE_TO_SLUG } from "@/content/portfolio/serviceLines";

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-success" fill="currentColor">
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
    </svg>
  );
}

// Standard card: Challenge → What SCS Delivered → Business Impact → Services Provided.
// "compact" is the Home preview (headline + impact + link).
export default function CaseStudyCard({
  entry,
  variant = "full",
}: {
  entry: PortfolioEntry;
  variant?: "full" | "compact";
}) {
  const header = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{entry.sector}</p>
      <h3 className="mt-1 text-xl font-semibold text-text">{entry.client}</h3>
      {registrationLabel(entry) && (
        <p className="mt-2 inline-block rounded-sm border border-border bg-surface px-2 py-0.5 text-sm text-secondary">
          {registrationLabel(entry)}
        </p>
      )}
      <p className="mt-3 font-medium text-text">{entry.headline}</p>
    </>
  );

  if (variant === "compact") {
    return (
      <article className="lift reveal h-full flex flex-col bg-bg border border-border border-t-4 border-t-accent rounded-md p-6">
        {header}
        <p className="mt-3 text-sm text-muted flex-1">{entry.impact}</p>
        <Link href={`/portfolio/${entry.slug}`} className="mt-4 text-sm font-medium text-primary hover:underline">
          Read the case study<span className="sr-only"> for {entry.client}</span> →
        </Link>
      </article>
    );
  }

  return (
    <article className="bg-bg border border-border border-t-4 border-t-accent rounded-md p-6 md:p-8">
      {header}
      <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-secondary">The Challenge</h4>
      <p className="mt-2 text-sm text-muted">{entry.challenge}</p>

      <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-secondary">What SCS Delivered</h4>
      <ul className="mt-2 space-y-2">
        {entry.delivered.map((d) => (
          <li key={d} className="flex gap-2 text-sm text-text">
            <Check />
            <span>{d}</span>
          </li>
        ))}
      </ul>

      <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-secondary">Business Impact</h4>
      <p className="mt-2 text-sm text-muted">{entry.impact}</p>

      <h4 className="mt-6 text-sm font-semibold uppercase tracking-wider text-secondary">Services Provided</h4>
      <ul className="mt-2 flex flex-wrap gap-2">
        {entry.serviceLines.map((line) => {
          const slug = SERVICE_LINE_TO_SLUG[line];
          const cls = "inline-block rounded-sm bg-primary/10 px-3 py-1 text-sm text-primary";
          return (
            <li key={line}>
              {slug ? (
                <Link href={`/services/${slug}`} className={`${cls} hover:bg-primary hover:text-white`}>
                  {line}
                </Link>
              ) : (
                <span className={cls}>{line}</span>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
