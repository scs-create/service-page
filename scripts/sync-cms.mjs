// Copies the pinned, lockfile-verified Decap CMS bundle into /public/admin so /admin loads NO third-party
// JavaScript at runtime (previously: unpkg floating range + the Netlify Identity widget).
// Decap is code-split into many chunk files that load relative to decap-cms.js, so ALL .js files are copied.
// Source maps and the packages' own demo HTML pages are deliberately not copied.
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";

const DECAP = "node_modules/decap-cms/dist";
if (!existsSync(`${DECAP}/decap-cms.js`) ) {
  console.error('sync-cms: CMS package not installed. Run "npm ci" first.');
  process.exit(1);
}
mkdirSync("public/admin", { recursive: true });
const chunks = readdirSync(DECAP).filter((f) => f.endsWith(".js"));
for (const f of chunks) copyFileSync(`${DECAP}/${f}`, `public/admin/${f}`);
console.log(`sync-cms: ${chunks.length} Decap files copied to public/admin (self-hosted, pinned)`);
