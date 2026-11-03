// Post-build: Next.js 16's static export writes per-segment RSC payloads as nested folders
// (about/__next.about/__PAGE__.txt), but the client router prefetches them by a flat, dotted name
// (about/__next.about.__PAGE__.txt). On a static host the flat name is a 404, so every link prefetch fails and
// client navigation falls back to a full page load. This copies each nested payload to its flat name.
//
// Usage: node scripts/flatten-rsc.mjs [outDir]   (runs automatically after `next build`)
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { pathToFileURL } from "node:url";

function files(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

// Every [nested payload, flat copy] pair under outDir.
export function flatNames(outDir) {
  const pairs = [];
  const visit = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (!statSync(p).isDirectory()) continue;
      if (name.startsWith("__next.")) {
        for (const f of files(p)) pairs.push([f, join(dir, relative(dir, f).split(sep).join("."))]);
      } else visit(p);
    }
  };
  visit(outDir);
  return pairs;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const pairs = flatNames(process.argv[2] ?? "out");
  for (const [from, to] of pairs) copyFileSync(from, to);
  console.log(`flatten-rsc: ${pairs.length} RSC payload(s) copied to their flat names`);
}
