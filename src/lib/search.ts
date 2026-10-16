export type SearchEntry = { title: string; text: string; href: string; kind: string };

// Small, dependency-free ranking: every word must match; title matches outrank body matches.
export function searchEntries(entries: SearchEntry[], query: string, limit = 8): SearchEntry[] {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return entries.filter((e) => e.kind === "Tool" || e.kind === "Page").slice(0, limit);
  return entries
    .map((e) => {
      const title = e.title.toLowerCase();
      const body = `${e.text} ${e.kind}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (title.includes(t)) score += title.startsWith(t) ? 4 : 3;
        else if (body.includes(t)) score += 1;
        else return { e, score: 0 };
      }
      return { e, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.e);
}
