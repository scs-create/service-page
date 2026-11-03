// Cutover DNS check (docs/v2/06-TECH-SPEC.md §11 step 3, docs/DEPLOYMENT.md §4):
//   node scripts/dns-diff.mjs dns-before.txt dns-after.txt
// Both files are Cloudflare zone exports (DNS → Records → Import and Export → Export). Prints every record that was
// added or removed, and exits 1 if anything other than the apex and www address records changed: MX, SPF, DKIM,
// DMARC and Google records must stay exactly as they were.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const ZONE = "stephencorporateservices-scs.com.";
const ALLOWED_NAMES = new Set([ZONE, `www.${ZONE}`, "@", "www"]);
const ALLOWED_TYPES = new Set(["A", "AAAA", "CNAME"]);

// One normalised line per record: name, type and value; TTL and comments are ignored (TTL is lowered on purpose).
export function records(text) {
  const out = new Set();
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/;(?=(?:[^"]*"[^"]*")*[^"]*$).*$/, "").trim(); // a ";" outside quotes starts a comment
    if (!line || line.startsWith("$")) continue;
    const parts = line.split(/\s+/);
    const i = parts.findIndex((p) => p === "IN");
    if (i < 1) continue;
    const name = parts[0].toLowerCase();
    const type = parts[i + 1].toUpperCase();
    if (type === "SOA") continue;
    out.add([name, type, parts.slice(i + 2).join(" ")].join(" "));
  }
  return out;
}

export function diff(before, after) {
  const a = records(before), b = records(after);
  const removed = [...a].filter((r) => !b.has(r));
  const added = [...b].filter((r) => !a.has(r));
  const unexpected = [...removed, ...added].filter((r) => {
    const [name, type] = r.split(" ");
    return !(ALLOWED_NAMES.has(name) && ALLOWED_TYPES.has(type));
  });
  return { removed, added, unexpected };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [beforeFile, afterFile] = process.argv.slice(2);
  if (!beforeFile || !afterFile) {
    console.error("Usage: node scripts/dns-diff.mjs dns-before.txt dns-after.txt");
    process.exit(2);
  }
  const { removed, added, unexpected } = diff(readFileSync(beforeFile, "utf8"), readFileSync(afterFile, "utf8"));
  for (const r of removed) console.log(`- ${r}`);
  for (const r of added) console.log(`+ ${r}`);
  if (unexpected.length) {
    console.log(`\nSTOP: ${unexpected.length} change(s) outside the apex and www address records:`);
    for (const r of unexpected) console.log(`  ${r}`);
    process.exit(1);
  }
  console.log(`\ndns-diff: OK (${removed.length + added.length} change(s), all apex or www address records)`);
}
