// Build-time loading + validation of CMS-managed JSON (server only).
// An invalid record fails the build with the FILE and FIELD named, instead of an obscure runtime error.
import fs from "fs";
import path from "path";
import { z } from "zod";

export class ContentError extends Error {}

function describe(file: string, error: z.ZodError) {
  return `Invalid content in ${file}:\n` + error.issues.map((i) => `  - field "${i.path.join(".") || "(root)"}": ${i.message}`).join("\n");
}

export function parseContent<S extends z.ZodType>(raw: unknown, schema: S, file: string): z.infer<S> {
  const result = schema.safeParse(raw);
  if (!result.success) throw new ContentError(describe(file, result.error));
  return result.data;
}

export function loadJsonFile<S extends z.ZodType>(file: string, schema: S): z.infer<S> {
  const abs = path.join(/*turbopackIgnore: true*/ process.cwd(), file);
  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(abs, "utf-8"));
  } catch (e) {
    throw new ContentError(`Cannot read ${file}: ${(e as Error).message}`);
  }
  return parseContent(raw, schema, file);
}

export function loadJsonDir<S extends z.ZodType>(dir: string, schema: S): z.infer<S>[] {
  const abs = path.join(/*turbopackIgnore: true*/ process.cwd(), dir);
  if (!fs.existsSync(abs)) return [];
  return fs
    .readdirSync(abs)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => loadJsonFile(`${dir}/${f}`, schema));
}

// A CMS record that references an uploaded file must reference one that exists in /public.
export function assertPublicFile(publicPath: string, file: string, field: string) {
  if (!fs.existsSync(path.join(/*turbopackIgnore: true*/ process.cwd(), "public", publicPath))) {
    throw new ContentError(`Invalid content in ${file}:\n  - field "${field}": /public${publicPath} does not exist (upload the image in the CMS first)`);
  }
}
