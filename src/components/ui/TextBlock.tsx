type TextBlockProps = {
  heading?: string;
  paragraphs: string[];
  align?: "center" | "left";
  variant?: "default" | "pullquote";
};

// Shared primitive (Module 4 + Module 6 + Module 13 consolidation).
// Used for: Company Overview, Vision/Mission panels, Promise statement.
export default function TextBlock({
  heading,
  paragraphs,
  align = "center",
  variant = "default",
}: TextBlockProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  const sizeClass = variant === "pullquote" ? "text-xl" : "text-base";

  return (
    <div className={`max-w-[65ch] ${alignClass}`}>
      {heading && (
        <h2 className="text-2xl font-semibold text-text mb-4">{heading}</h2>
      )}
      {paragraphs.map((p, i) => (
        <p key={i} className={`${sizeClass} text-muted mb-4 last:mb-0`}>
          {p}
        </p>
      ))}
    </div>
  );
}
