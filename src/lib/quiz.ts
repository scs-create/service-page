import type { z } from "zod";
import type { quizSchema } from "./schemas";

export type Quiz = z.infer<typeof quizSchema>;

// Sum option weights per outcome; highest first; ties keep the order outcomes were first scored.
export function rankOutcomes(quiz: Quiz, picks: Record<string, number>): { id: string; score: number }[] {
  const totals = new Map<string, number>();
  for (const q of quiz.questions) {
    const opt = q.options[picks[q.id]];
    if (!opt) continue;
    for (const [id, w] of Object.entries(opt.weights)) totals.set(id, (totals.get(id) ?? 0) + w);
  }
  return [...totals.entries()].filter(([, s]) => s > 0).map(([id, score]) => ({ id, score })).sort((a, b) => b.score - a.score);
}
