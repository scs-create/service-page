import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";

// Renders the exact placeholder text on preview deploys; renders nothing on production.
export default function ClientPlaceholder({ text }: { text: string }) {
  if (!SHOW_PLACEHOLDERS) return null;
  return <mark className="inline-block rounded-sm bg-accent px-2 py-0.5 text-sm font-medium text-secondary">{text}</mark>;
}
