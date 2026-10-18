import Link from "next/link";
import { SITE } from "@/lib/site";

type CTAButtonProps = {
  href?: string;
  label: string;
  // accent / outlineLight are for navy or blue backgrounds (.dark-surface sections)
  variant?: "primary" | "secondary" | "text" | "accent" | "outlineLight";
  size?: "default" | "large";
  className?: string;
  shortLabel?: string; // shown instead of `label` below the xl breakpoint
  // Opens the Cal.com Discovery Call in a new tab ("↗"); TrackClicks reports cta_clicked { cta_name: book_discovery_call }.
  booking?: boolean;
};

// Single reusable button component — Header, Hero, CTA bands, cards.
export default function CTAButton({
  href,
  label,
  variant = "primary",
  size = "default",
  className = "",
  shortLabel,
  booking = false,
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors rounded-md min-h-11";

  const sizes = {
    default: "px-5 py-2.5 text-base",
    large: "px-7 py-3.5 text-lg",
  };

  const variants = {
    primary: "bg-primary text-white hover:bg-secondary",
    secondary: "bg-transparent text-primary border border-primary hover:bg-primary/5",
    text: "bg-transparent text-primary hover:underline px-0 py-0 min-h-0",
    // Gold fill + navy text = 9.8:1 contrast. Never gold text on white.
    accent: "bg-accent text-secondary hover:bg-white",
    outlineLight: "bg-transparent text-white border border-white/70 hover:bg-white/10",
  };

  const text = shortLabel ? (
    <>
      <span className="xl:hidden">{shortLabel}</span>
      <span className="hidden xl:inline">{label}</span>
    </>
  ) : (
    label
  );
  const cls = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (booking) {
    return (
      <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" data-track={label} data-booking="" className={cls}>
        {text}
        <span aria-hidden="true">↗</span>
        <span className="sr-only"> (opens Cal.com in a new tab)</span>
      </a>
    );
  }

  return (
    <Link href={href ?? "/contact#enquiry"} data-track={label} className={cls}>
      {text}
    </Link>
  );
}
