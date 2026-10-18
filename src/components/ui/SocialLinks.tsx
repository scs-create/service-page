import { SITE } from "@/lib/site";
import { SOCIAL_ICONS, type SocialNetwork } from "@/content/socialIcons";

const NETWORKS: { id: SocialNetwork; name: string; href: string }[] = [
  { id: "linkedin", name: "LinkedIn", href: SITE.linkedin },
  { id: "instagram", name: "Instagram", href: SITE.instagram },
  { id: "facebook", name: "Facebook", href: SITE.facebook },
  { id: "threads", name: "Threads", href: SITE.threads },
  { id: "x", name: "X", href: SITE.x },
];

// Social profiles as brand icons. Each is a 44px circular target with a full accessible name; clicks are
// tracked by TrackClicks as outbound_link_clicked { destination_domain, link_label }.
export default function SocialLinks({ tone = "light", className = "" }: { tone?: "light" | "dark"; className?: string }) {
  const colours =
    tone === "dark"
      ? "border-white/40 text-white hover:border-accent hover:bg-accent hover:text-secondary"
      : "border-border text-primary hover:border-primary hover:bg-primary hover:text-white";
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {NETWORKS.map((n) => {
        const icon = SOCIAL_ICONS[n.id];
        return (
          <li key={n.id}>
            <a
              href={n.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${SITE.name} on ${n.name} (opens in new tab)`}
              title={n.name}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${colours}`}
            >
              <svg aria-hidden="true" viewBox={icon.viewBox} className="h-5 w-5" fill="currentColor">
                <path d={icon.path} />
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
