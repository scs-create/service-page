type ClosingStatementProps = {
  lines: string[];
  tone?: "light" | "dark";
};

// Parallel-line closing statement (a list of short parallel phrases, not prose).
export default function ClosingStatement({ lines, tone = "light" }: ClosingStatementProps) {
  return (
    <ul className="text-center space-y-2 max-w-[50ch] mx-auto">
      {lines.map((line) => (
        <li key={line} className={`text-lg md:text-xl font-medium ${tone === "dark" ? "text-accent" : "text-text"}`}>
          {line}
        </li>
      ))}
    </ul>
  );
}
