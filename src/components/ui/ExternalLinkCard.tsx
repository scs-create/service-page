type ExternalLinkCardProps = {
  label: string;
  description?: string;
  href: string;
};

// Reusable primitive for outbound links to external SCS properties
// (e.g. the full Academy site). Distinct from ContactChannel — this
// links to a whole separate website, not a contact method — but
// shares the same new-tab accessibility pattern.
export default function ExternalLinkCard({
  label,
  description,
  href,
}: ExternalLinkCardProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-border rounded-md p-6 bg-surface hover:shadow-md transition-shadow"
    >
      <p className="font-semibold text-primary">
        {label}
        <span aria-hidden="true"> ↗</span>
        <span className="sr-only"> (opens in new tab)</span>
      </p>
      {description && (
        <p className="text-sm text-muted mt-1">{description}</p>
      )}
    </a>
  );
}
