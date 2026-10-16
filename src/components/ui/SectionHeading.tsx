type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
};

// Consistent section opener: eyebrow + title + gold rule (+ intro).
// Gold is used only as a rule here, and as eyebrow TEXT only on navy (6:1).
export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  tone = "light",
  as: Tag = "h2",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <div className={`reveal mb-10 ${center ? "text-center mx-auto" : ""} max-w-[70ch]`}>
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${dark ? "text-accent" : "text-primary"}`}>
          {eyebrow}
        </p>
      )}
      <Tag className={`text-3xl md:text-4xl font-semibold ${dark ? "text-white" : "text-text"}`}>{title}</Tag>
      <span aria-hidden="true" className={`block h-1 w-14 bg-accent rounded-sm mt-4 ${center ? "mx-auto" : ""}`} />
      {intro && <p className={`mt-4 text-base md:text-lg ${dark ? "text-white/85" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}
