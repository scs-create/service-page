"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";

type Row = { slug: string; client: string; sector: string; rc: string };

// Client register with search by name, sector or RC number. The full table is server-rendered, so it
// is complete without JavaScript; the search box only appears once JS is available.
export default function RegisterTable({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const shown = needle ? rows.filter((r) => `${r.client} ${r.sector} ${r.rc}`.toLowerCase().includes(needle)) : rows;
  return (
    <div>
      <div className="mb-4 max-w-[420px]">
        <label htmlFor="register-search" className="mb-1.5 block text-sm font-medium text-text">Search by client name, sector or RC number</label>
        <input id="register-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Premier or 9482408" className="w-full min-h-11 rounded-sm border border-border px-3 text-base" />
        <p aria-live="polite" className="mt-1 text-xs text-muted">{shown.length} of {rows.length} clients shown</p>
      </div>
      <div className="overflow-x-auto rounded-md border border-border bg-bg">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Client names, sectors and CAC RC numbers</caption>
          <thead className="bg-secondary text-white">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Client</th>
              <th scope="col" className="px-4 py-3 font-semibold">Sector</th>
              <th scope="col" className="px-4 py-3 font-semibold">RC number</th>
              <th scope="col" className="px-4 py-3 font-semibold">Copy RC</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.slug} className="border-t border-border">
                <th scope="row" className="px-4 py-3 font-medium text-text">{r.client}</th>
                <td className="px-4 py-3 text-muted">{r.sector}</td>
                <td className="px-4 py-3 tabular-nums text-text">RC {r.rc}</td>
                <td className="px-4 py-3 whitespace-nowrap"><CopyButton text={r.rc} label={r.client} /></td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-muted">No clients match your search.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
