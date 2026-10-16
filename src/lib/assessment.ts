import type { z } from "zod";
import type { assessmentSchema } from "./schemas";

export type Assessment = z.infer<typeof assessmentSchema>;
export type Answer = 0 | 1 | 2; // 2 = fully in place, 1 = partly, 0 = no / not sure

// Pure scoring (unit-tested). No AI: fixed rules over the answers.
export function scoreAssessment(a: Assessment, stage: string, scores: Record<string, Answer>) {
  const priority = a.stagePriority[stage] ?? [];
  const domains = a.domains.map((d, order) => {
    const idx = priority.indexOf(d.id);
    return { ...d, score: (scores[d.id] ?? 0) as Answer, order, pri: idx === -1 ? 99 : idx };
  });
  const percent = Math.round((domains.reduce((s, d) => s + d.score, 0) / (domains.length * 2)) * 100);
  const band = percent < 40 ? "Needs attention" : percent < 75 ? "Developing" : "Strong";
  // weakest first; within equal scores, what matters most at this business stage first
  const gaps = domains.filter((d) => d.score < 2).sort((x, y) => x.score - y.score || x.pri - y.pri || x.order - y.order);
  return { percent, band, domains, gaps };
}
