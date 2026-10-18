import fs from "fs";
import path from "path";
import { load as yamlLoad } from "js-yaml";
import { z } from "zod";
import { ContentError } from "@/lib/content";

const POSTS_DIR = path.join(process.cwd(), "src/content/corporate-school");

// Validated frontmatter. `date` doubles as the publish date: a future date keeps the post hidden
// until the first build on/after that day (the daily scheduled-build workflow does that).
// Minimal front-matter reader (replaces gray-matter, whose bundled YAML parser carried an advisory).
function parseFrontmatter(raw: string, file: string): { data: unknown; content: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) throw new ContentError(`Invalid content in ${file}: missing the --- front-matter block`);
  return { data: yamlLoad(m[1]), content: m[2] };
}

const frontmatter = z.object({
  title: z.string().trim().min(1, "title must not be empty"),
  date: z.coerce.date({ error: "date must be a valid date" }),
  excerpt: z.string().trim().min(1, "excerpt must not be empty"),
  category: z.string().optional(),
  // Article enhancements (all optional, editable in the CMS):
  takeaways: z.array(z.string().trim().min(1)).max(6).optional(), // "Key takeaways" box at the top
  services: z.array(z.string().trim().min(1)).max(4).optional(), // service slugs for "How SCS can help"
  help: z.string().trim().min(1).optional(), // the "How SCS can help" paragraph
  tool: z.object({ href: z.string().startsWith("/"), label: z.string().trim().min(1) }).optional(), // a free analysis tool
});

export interface Post {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  category?: string;
  takeaways?: string[];
  services?: string[];
  help?: string;
  tool?: { href: string; label: string };
  content: string;
  readingMinutes: number;
}

function loadAll(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const file = `src/content/corporate-school/${filename}`;
      const { data, content } = parseFrontmatter(fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8"), file);
      const parsed = frontmatter.safeParse(data);
      if (!parsed.success) {
        throw new ContentError(`Invalid content in ${file}:\n` + parsed.error.issues.map((i) => `  - field "${i.path.join(".")}": ${i.message}`).join("\n"));
      }
      const words = content.split(/\s+/).filter(Boolean).length;
      return { slug: filename.replace(/\.md$/, ""), ...parsed.data, date: parsed.data.date.toISOString(), content, readingMinutes: Math.max(1, Math.ceil(words / 200)) };
    });
}

const ALL = loadAll();

export function getAllPosts(now: Date = new Date()): Post[] {
  return ALL.filter((p) => new Date(p.date) <= now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

// Same category first, then shared title words.
export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const words = new Set(post.title.toLowerCase().split(/\W+/).filter((w) => w.length > 3));
  return getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ p, score: (p.category && p.category === post.category ? 10 : 0) + p.title.toLowerCase().split(/\W+/).filter((w) => words.has(w)).length }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.p);
}
