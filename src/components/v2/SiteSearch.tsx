"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { searchEntries, type SearchEntry } from "@/lib/search";

// Client-side search over the static index. The query is kept in ?q= so results can be linked and shared.
export default function SiteSearch() {
  const [entries, setEntries] = useState<SearchEntry[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    // The ?q= value is applied once the index arrives (the static HTML always renders an empty box).
    const initial = new URLSearchParams(window.location.search).get("q") ?? "";
    fetch("/search-index.json")
      .then((r) => r.json())
      .then((data: SearchEntry[]) => {
        setEntries(data);
        if (initial) setQuery(initial);
      })
      .catch(() => setEntries([]));
  }, []);

  const results = useMemo(() => (entries ? searchEntries(entries, query, 30) : []), [entries, query]);

  function onChange(value: string) {
    setQuery(value);
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url);
  }

  return (
    <div role="search">
      <label htmlFor="site-search" className="mb-1.5 block text-sm font-medium text-text">Search for</label>
      <input
        id="site-search"
        type="search"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="For example: annual returns, NGO registration, payroll"
        className="min-h-12 w-full rounded-sm border px-3 text-base"
        autoComplete="off"
      />
      <p aria-live="polite" className="mt-3 text-sm text-muted">
        {entries === null ? "Loading the index…" : query ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Popular pages and tools"}
      </p>
      <ul className="mt-4 border-t border-border">
        {results.map((r) => (
          <li key={`${r.href}-${r.title}`} className="border-b border-border">
            <Link href={r.href} className="group block py-4">
              <span className="block text-xs uppercase tracking-wider text-muted">{r.kind}</span>
              <span className="mt-1 block font-medium text-text group-hover:text-primary">{r.title}</span>
              <span className="mt-1 line-clamp-2 block text-sm text-muted">{r.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
