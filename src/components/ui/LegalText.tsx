import { resolveTokens } from "@/lib/legal";

// Inline renderer for legal copy: {{tokens}}, **bold**, [label](url), emails and
// [unresolved placeholders] (highlighted so they cannot be missed).
const SPLIT = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*|\[[^\]]{1,120}\]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;
const EMAIL = /^[\w.+-]+@[\w-]+(?:\.[\w-]+)+$/;

export default function LegalText({ text }: { text: string }) {
  const parts = resolveTokens(text).split(SPLIT).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        const link = part.match(LINK);
        if (link) {
          const external = link[2].startsWith("http");
          return (
            <a key={i} href={link[2]} className="text-primary underline" {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              {link[1]}
              {external && <span className="sr-only"> (opens in new tab)</span>}
            </a>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith("[") && part.endsWith("]")) {
          return (
            <mark key={i} className="rounded-sm bg-accent px-1 text-secondary">
              {part}
            </mark>
          );
        }
        if (EMAIL.test(part)) return <a key={i} href={`mailto:${part}`} className="text-primary underline">{part}</a>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
