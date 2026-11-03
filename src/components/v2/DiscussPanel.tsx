import Link from "next/link";
import { SITE } from "@/lib/site";
import { PROPOSAL_HREF } from "@/lib/nav";

// The side panel on service and cluster pages (docs/v2/design/Service.dc.html): one primary action, a proposal
// route and the response promise. `serviceId` travels with the clicks for analytics and pre-fills the proposal form.
export default function DiscussPanel({ title, text, cta, serviceId }: { title: string; text: string; cta: string; serviceId?: string }) {
  const proposal = serviceId ? `${PROPOSAL_HREF}?service=${encodeURIComponent(serviceId)}` : PROPOSAL_HREF;
  return (
    <aside aria-label={title} className="rounded-sm border border-border border-t-4 border-t-accent bg-bg p-7 lg:sticky lg:top-28">
      <h2 className="font-sans text-xl font-semibold text-text">{title}</h2>
      <p className="mb-5 mt-2 text-[15px] text-muted">{text}</p>
      <a
        href={SITE.bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-booking=""
        data-location="service_panel"
        data-service-id={serviceId}
        className="flex min-h-12 items-center justify-center rounded-md bg-primary px-5 font-medium text-white transition-colors hover:bg-secondary"
      >
        {cta}<span className="sr-only"> (opens Cal.com in a new tab)</span>
      </a>
      <Link href={proposal} data-track="Request a proposal" data-service-id={serviceId} className="mt-4 block text-center text-[15px] font-medium text-primary hover:underline">
        Request a proposal instead →
      </Link>
      <p className="mt-5 border-t border-border pt-4 text-[13px] text-muted">{SITE.responsePromise}</p>
    </aside>
  );
}
