type JourneyStageProps = {
  label: string;
  steps: string[];
};

// Labeled group of steps (About page: Start / Build / Scale / Sustain).
// The gold arrows are decorative (aria-hidden); order is carried by <ol>.
export function JourneyStage({ label, steps }: JourneyStageProps) {
  return (
    <div className="flex-1 min-w-[200px] border-t-4 border-accent bg-bg border-x border-b border-border rounded-md p-5">
      <h3 className="font-semibold text-secondary uppercase tracking-wide text-sm mb-3">
        {label}
      </h3>
      <ol className="space-y-2">
        {steps.map((step, i) => (
          <li key={step} className="text-sm text-muted flex gap-2">
            <span className="text-accent" aria-hidden="true">
              {i === steps.length - 1 ? "•" : "→"}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
