"use client";

import { useState } from "react";
import CaseStudyCard from "@/components/ui/CaseStudyCard";
import { PORTFOLIO_FILTERS, PortfolioEntry, PortfolioFilter } from "@/lib/types";

export default function PortfolioGrid({ entries }: { entries: PortfolioEntry[] }) {
  const [active, setActive] = useState<"all" | PortfolioFilter>("all");

  const visible = active === "all" ? entries : entries.filter((e) => e.filter === active);
  const filters = PORTFOLIO_FILTERS.map((f) => ({
    ...f,
    count: entries.filter((e) => e.filter === f.slug).length,
  })).filter((f) => f.count > 0);

  const btn = (isActive: boolean) =>
    `min-h-11 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary border-primary text-white"
        : "bg-surface border-border text-text hover:border-primary hover:text-primary"
    }`;

  return (
    <div>
      <div role="group" aria-label="Filter case studies by industry" className="flex flex-wrap gap-2 mb-6">
        <button type="button" aria-pressed={active === "all"} onClick={() => setActive("all")} className={btn(active === "all")}>
          All ({entries.length})
        </button>
        {filters.map((f) => (
          <button
            key={f.slug}
            type="button"
            aria-pressed={active === f.slug}
            onClick={() => setActive(f.slug)}
            className={btn(active === f.slug)}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <p aria-live="polite" className="text-sm text-muted mb-6">
        Showing {visible.length} of {entries.length} case studies
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((entry) => (
          <CaseStudyCard key={entry.slug} entry={entry} variant="compact" />
        ))}
      </div>
    </div>
  );
}
