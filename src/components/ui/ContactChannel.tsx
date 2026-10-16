type ChannelType = "email" | "whatsapp" | "phone" | "linkedin" | "instagram" | "facebook" | "threads";

type ContactChannelProps = {
  type: ChannelType;
  value: string; // email address, phone number, or full profile URL
  label?: string;
  detail?: string; // visible detail line, e.g. the number or address
  size?: "default" | "large";
  tone?: "light" | "dark";
};

const CHANNEL_CONFIG: Record<ChannelType, { label: string; hrefPrefix: string; external: boolean }> = {
  email: { label: "Email SCS", hrefPrefix: "mailto:", external: false },
  whatsapp: { label: "Message SCS on WhatsApp", hrefPrefix: "https://wa.me/", external: true },
  phone: { label: "Call SCS", hrefPrefix: "tel:", external: false },
  linkedin: { label: "SCS on LinkedIn", hrefPrefix: "", external: true },
  instagram: { label: "SCS on Instagram", hrefPrefix: "", external: true },
  facebook: { label: "SCS on Facebook", hrefPrefix: "", external: true },
  threads: { label: "SCS on Threads", hrefPrefix: "", external: true },
};

// Values starting with "[" are treated as not-yet-supplied placeholders and render disabled.
export default function ContactChannel({
  type,
  value,
  label,
  detail,
  size = "default",
  tone = "light",
}: ContactChannelProps) {
  const config = CHANNEL_CONFIG[type];
  const isPlaceholder = value.startsWith("[");
  const href = isPlaceholder ? "#" : `${config.hrefPrefix}${value}`;
  const textSize = size === "large" ? "text-lg" : "text-base";
  const colours =
    tone === "dark" ? "text-white hover:text-accent" : "text-text hover:text-primary";

  return (
    <a
      href={href}
      {...(config.external && !isPlaceholder ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`flex flex-col py-2 min-h-11 justify-center ${colours} ${textSize} ${
        isPlaceholder ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      <span className="font-medium">
        {label ?? config.label}
        {isPlaceholder && <span className="text-xs text-muted"> (to be added)</span>}
        {config.external && !isPlaceholder && <span className="sr-only"> (opens in new tab)</span>}
      </span>
      {detail && (
        <span className={`text-sm ${tone === "dark" ? "text-white/80" : "text-muted"}`}>{detail}</span>
      )}
    </a>
  );
}
