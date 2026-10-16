"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchEntries, SearchEntry } from "@/lib/search";

// Site search over services, case studies, industries, FAQs, tools and posts. Ctrl/⌘ + K opens it.
// The index (/search-index.json) is built at deploy time and only fetched when the palette is first opened.
export default function SearchPalette() {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [index, setIndex] = useState<SearchEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const results = useMemo(() => searchEntries(index, q), [index, q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  useEffect(() => {
    if (!open || loaded) return;
    fetch("/search-index.json").then((r) => r.json()).then((data: SearchEntry[]) => { setIndex(data); setLoaded(true); }).catch(() => setLoaded(true));
  }, [open, loaded]);

  function go(entry?: SearchEntry) {
    if (!entry) return;
    setOpen(false);
    router.push(entry.href);
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label="Search the site" className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-text hover:text-primary">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
      </button>
      <dialog
        ref={ref}
        aria-label="Search"
        onClose={() => { setOpen(false); setQ(""); setActive(0); }}
        onClick={(e) => { if (e.target === ref.current) setOpen(false); }}
        className="m-auto mt-[10vh] w-[min(94vw,640px)] rounded-md bg-bg p-0 text-text"
      >
        <div className="border-b border-border p-3">
          <input
            autoFocus
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-activedescendant={results[active] ? `sr-${active}` : undefined}
            aria-label="Search services, case studies, tools and articles"
            placeholder="Search services, case studies, tools, articles…"
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              if (e.key === "Enter") go(results[active]);
            }}
            className="w-full min-h-11 rounded-sm border border-border px-3 text-base"
          />
        </div>
        <ul id="search-results" role="listbox" className="max-h-[55vh] overflow-y-auto p-2">
          {results.map((r, i) => (
            <li key={r.href + r.title} id={`sr-${i}`} role="option" aria-selected={i === active} onClick={() => go(r)} onMouseEnter={() => setActive(i)}
              className={`cursor-pointer rounded-md px-3 py-2 ${i === active ? "bg-primary/10" : ""}`}>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{r.kind}</span>
              <span className="block font-medium">{r.title}</span>
              <span className="block truncate text-sm text-muted">{r.text}</span>
            </li>
          ))}
          {loaded && results.length === 0 && <li className="px-3 py-4 text-sm text-muted">No matches. Try a service, sector or tool name.</li>}
        </ul>
        <div className="flex justify-between border-t border-border px-3 py-2 text-xs text-muted">
          <span>↑↓ to move · Enter to open · Esc to close</span>
          <button type="button" onClick={() => setOpen(false)} className="font-medium text-primary hover:underline">Close</button>
        </div>
      </dialog>
    </>
  );
}
