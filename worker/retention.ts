// Daily retention job (docs/v2/06-TECH-SPEC.md §4): submissions older than 6 months are deleted with their R2 files,
// for every form. Only counts are logged.
import { retentionCutoff } from "../src/lib/formValidation";
import type { Env } from "./types";

export async function purgeOld(env: Env, now = new Date()): Promise<{ rows: number; files: number }> {
  if (!env.DB) return { rows: 0, files: 0 };
  const cutoff = retentionCutoff(now);
  const { results } = await env.DB.prepare("SELECT id, file_keys FROM submissions WHERE created_at < ?").bind(cutoff).all<{ id: string; file_keys: string | null }>();
  const keys = results.flatMap((r) => (r.file_keys ? (JSON.parse(r.file_keys) as string[]) : []));
  // R2 deletes up to 1,000 keys per call.
  for (let i = 0; i < keys.length; i += 1000) await env.UPLOADS?.delete(keys.slice(i, i + 1000));
  if (results.length) await env.DB.prepare("DELETE FROM submissions WHERE created_at < ?").bind(cutoff).run();
  console.log(JSON.stringify({ event: "retention", rows: results.length, files: keys.length }));
  return { rows: results.length, files: keys.length };
}
