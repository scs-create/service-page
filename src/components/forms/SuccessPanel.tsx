"use client";

import Link from "next/link";
import { SITE } from "@/lib/site";

// After a successful submission the form is replaced by this panel (05-SITE-SPEC.md §3 F):
//   1. success message and the reference (also emailed)   2. the timeline
//   3. one primary button matched to the request          4. "Continue exploring"   5. the vCard download
export type NextStep = "book_call" | "take_assessment" | "read_process";
export type ExploreLink = { href: string; label: string };

const TIMELINE = ["Received", "Reviewed by the right person", "We reply within 24 hours", "A call or a proposal"];

function bookingUrl(name?: string, email?: string): string {
  const url = new URL(SITE.bookingUrl);
  if (name) url.searchParams.set("name", name); // Cal.com pre-fills the booking form from these parameters
  if (email) url.searchParams.set("email", email);
  return url.toString();
}

export default function SuccessPanel({ title, message, reference, next, name, email, explore }: {
  title: string;
  message: string;
  reference: string;
  next: NextStep;
  name?: string;
  email?: string;
  explore: ExploreLink[];
}) {
  const btn = "inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-6 font-medium text-white hover:bg-secondary";
  return (
    <div role="status" tabIndex={-1} ref={(el) => el?.focus()} className="rounded-sm border border-border border-t-4 border-t-success bg-bg p-6 outline-none md:p-8">
      <p className="text-lg font-semibold text-success">{title}</p>
      <p className="mt-1 text-text">{message}</p>
      <p className="mt-4 text-sm text-muted">
        Your reference: <span className="tabular font-semibold text-text">{reference}</span>. We have also sent it to your email.
      </p>

      <ol aria-label="What happens next" className="mt-6 grid gap-3 sm:grid-cols-4">
        {TIMELINE.map((t, i) => (
          <li key={t} className={`border-t-2 pt-2 text-sm ${i === 0 ? "border-success text-text" : "border-border text-muted"}`}>
            <span className="tabular block font-semibold">{i + 1}</span>
            {t}
          </li>
        ))}
      </ol>

      <div className="mt-6">
        {next === "book_call" && (
          <a href={bookingUrl(name, email)} target="_blank" rel="noopener noreferrer" data-booking="" data-location="form_success" className={btn}>
            Book your Discovery Call<span className="sr-only"> (opens Cal.com in a new tab)</span>
          </a>
        )}
        {next === "take_assessment" && <Link href="/assess" className={btn}>Take the business assessment</Link>}
        {next === "read_process" && <Link href="/process" className={btn}>Read: how we work</Link>}
      </div>

      {explore.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-semibold text-text">Continue exploring</p>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {explore.slice(0, 3).map((l) => <li key={l.href}><Link href={l.href} className="font-medium text-primary hover:underline">{l.label} →</Link></li>)}
          </ul>
        </div>
      )}

      <p className="mt-6 border-t border-border pt-4 text-sm">
        <a href="/scs-contact.vcf" download className="font-medium text-primary hover:underline">Add our contact details</a>
        <span className="text-muted"> (vCard, with our phone and WhatsApp number {SITE.phone})</span>
      </p>
    </div>
  );
}
