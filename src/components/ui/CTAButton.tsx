import Link from "next/link";

type CTAButtonProps = {
  href: string;
  label: string;
  // accent / outlineLight are for navy or blue backgrounds (.dark-surface sections)
  variant?: "primary" | "secondary" | "text" | "accent" | "outlineLight";
  size?: "default" | "large";
  className?: string;
  shortLabel?: string; // shown instead of `label` below the xl breakpoint
};

// Single reusable button component — Header, Hero, CTA bands, cards.
export default function CTAButton({
  href,
  label,
  variant = "primary",
  size = "default",
  className = "",
  shortLabel,
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center font-medium transition-colors rounded-md min-h-11";

  const sizes = {
    default: "px-5 py-2.5 text-base",
    large: "px-7 py-3.5 text-lg",
  };

  const variants = {
    primary: "bg-primary text-white hover:bg-secondary",
    secondary: "bg-transparent text-primary border border-primary hover:bg-primary/5",
    text: "bg-transparent text-primary hover:underline px-0 py-0 min-h-0",
    // Gold fill + navy text = 6:1 contrast. Never gold text on white.
    accent: "bg-accent text-secondary hover:bg-white",
    outlineLight: "bg-transparent text-white border border-white/70 hover:bg-white/10",
  };

  return (
    <Link href={href} data-track={label} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {shortLabel ? (
        <>
          <span className="xl:hidden">{shortLabel}</span>
          <span className="hidden xl:inline">{label}</span>
        </>
      ) : (
        label
      )}
    </Link>
  );
}
