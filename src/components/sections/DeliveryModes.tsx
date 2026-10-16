// How every engagement is delivered. Sources: initial assessment (SCS approach), documents → systems →
// ongoing management (Growth Portfolio, slide 4), and practical training through the Academy.
const MODES = [
  { label: "Assessment", text: "We start by understanding the business, its stage, its sector obligations and its real risk exposure." },
  { label: "Implementation", text: "We produce the documents and install the systems that make them useful: contracts, policies, registers, workflows and dashboards." },
  { label: "Ongoing advisory", text: "We operate the agreed system, follow up deadlines, monitor performance and report to management." },
  { label: "Training", text: "Practical training for staff and managers through the SCS Academy." },
];

export default function DeliveryModes({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div className={`mt-14 pt-10 border-t ${dark ? "border-white/15" : "border-border"}`}>
      <h3 className={`text-xl font-semibold ${dark ? "text-white" : "text-text"}`}>How every engagement is delivered</h3>
      <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {MODES.map((m) => (
          <li key={m.label} className={`rounded-md border-l-4 border-accent p-4 ${dark ? "bg-white/5" : "bg-surface"}`}>
            <p className={`font-semibold ${dark ? "text-accent" : "text-secondary"}`}>{m.label}</p>
            <p className={`mt-1 text-sm ${dark ? "text-white/85" : "text-muted"}`}>{m.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
