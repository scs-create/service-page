type Step = { label: string; description: string };

type ProcessStepperProps = {
  steps: Step[];
  tone?: "light" | "dark";
};

// Numbered process (5 stages / 5 engagement steps). Real <ol> for sequence semantics.
export default function ProcessStepper({ steps, tone = "light" }: ProcessStepperProps) {
  const dark = tone === "dark";
  return (
    <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {steps.map((step, i) => (
        <li key={step.label} className={`border-t-4 pt-4 ${dark ? "border-accent" : "border-primary"}`}>
          <span aria-hidden="true" className={`block text-4xl font-semibold tabular-nums ${dark ? "text-accent" : "text-primary"}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className={`mt-2 text-lg font-semibold uppercase tracking-wide ${dark ? "text-white" : "text-text"}`}>
            {step.label}
          </h3>
          <p className={`mt-2 text-sm ${dark ? "text-white/85" : "text-muted"}`}>{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
