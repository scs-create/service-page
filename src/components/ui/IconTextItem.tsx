type IconTextItemProps = {
  primary: string;
  secondary: string;
  variant?: "stat" | "differentiator";
};

// Differentiator card (Why SCS). The stat variant is kept for reuse but the
// animated Home metrics now use StatCounter.
export default function IconTextItem({ primary, secondary, variant = "differentiator" }: IconTextItemProps) {
  if (variant === "stat") {
    return (
      <div className="text-center">
        <p className="text-4xl font-semibold text-primary">{primary}</p>
        <p className="text-sm text-muted mt-1">{secondary}</p>
      </div>
    );
  }
  return (
    <div className="lift reveal h-full bg-bg border border-border border-t-4 border-t-accent rounded-md p-5">
      <p className="font-semibold text-text">{primary}</p>
      <p className="text-sm text-muted mt-2">{secondary}</p>
    </div>
  );
}
