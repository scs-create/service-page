import Link from "next/link";
import { ServiceCategoryData } from "@/lib/types";

type Mode = "full" | "condensed" | "accordion";

type ServiceCategoryProps = {
  data: ServiceCategoryData;
  mode: Mode;
  headingLevel?: "h1" | "h2" | "h3";
  // full mode only: set false when the page already renders the title in a PageHero
  showHeader?: boolean;
};

// MASTER REUSABLE COMPONENT (Module 7).
// One component, three render modes:
//  - "full": individual service page (title as H1, full list)
//  - "condensed": Home page cluster card (title + framing line only)
//  - "accordion": Services index page (collapsible full detail)
export default function ServiceCategory({
  data,
  mode,
  headingLevel = "h2",
  showHeader = true,
}: ServiceCategoryProps) {
  const Heading = headingLevel as keyof React.JSX.IntrinsicElements;

  if (mode === "condensed") {
    return (
      <Link
        href={`/services/${data.slug}`}
        className="block border border-border rounded-md p-6 bg-surface hover:shadow-md transition-shadow"
      >
        <Heading className="text-lg font-semibold text-text mb-2">
          {data.title}
        </Heading>
        <p className="text-sm text-muted">{data.framingSentence}</p>
      </Link>
    );
  }

  if (mode === "accordion") {
    return (
      <details className="border border-border rounded-md p-4 group">
        <summary className="cursor-pointer list-none flex justify-between items-center">
          <span>
            <Heading className="text-base font-semibold text-text inline">
              {data.title}
            </Heading>
            <span className="block text-sm text-muted mt-1">
              {data.framingSentence}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="text-primary ml-4 shrink-0 group-open:rotate-180 transition-transform"
          >
            ▼
          </span>
        </summary>
        <div className="mt-4 pl-1">
          <p className="text-sm font-medium text-text mb-2">
            {data.introLine}
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted mb-4">
            {data.services.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          {data.supportingStatement && (
            <p className="text-sm text-muted mb-2">
              {data.supportingStatement}
            </p>
          )}
          {data.closingStatement && (
            <p className="text-sm text-text font-medium">
              {data.closingStatement}
            </p>
          )}
          <Link
            href={`/services/${data.slug}`}
            className="text-sm text-primary hover:underline mt-3 inline-block"
          >
            View full details →
          </Link>
        </div>
      </details>
    );
  }

  // mode === "full"
  return (
    <article>
      {showHeader && (
        <>
          <Heading className="text-3xl font-semibold text-primary mb-4">
            {data.title}
          </Heading>
          <p className="text-lg text-muted mb-6">{data.framingSentence}</p>
        </>
      )}

      {data.supportingStatement && (
        <p className="text-base text-text mb-6">{data.supportingStatement}</p>
      )}

      <p className="text-base font-medium text-text mb-3">
        {data.introLine}
      </p>
      <ul className="list-disc list-inside space-y-2 text-base text-muted mb-8">
        {data.services.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      {data.closingStatement && (
        <p className="text-base text-text font-medium border-l-2 border-accent pl-4">
          {data.closingStatement}
        </p>
      )}
    </article>
  );
}
