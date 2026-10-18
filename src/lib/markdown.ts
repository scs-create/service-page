import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

// CMS Markdown → HTML, then sanitised with a restrictive allowlist (H-01).
// No scripts, event handlers, inline styles, iframes/objects, forms, or javascript:/data: URLs.
const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "hr", "h2", "h3", "h4", "ul", "ol", "li", "strong", "em", "b", "i", "blockquote", "code", "pre", "a", "img", "table", "thead", "tbody", "tr", "th", "td"],
  allowedAttributes: {
    a: ["href", "title", "rel", "target"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    th: ["scope"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https"] }, // uploaded images are relative (/images/uploads/…) — always allowed
  allowProtocolRelative: false,
  disallowedTagsMode: "discard",
  transformTags: {
    h1: "h2", // the page title is the only H1
    a: (tagName, attribs) => {
      const external = /^https?:/i.test(attribs.href ?? "");
      return { tagName, attribs: external ? { ...attribs, rel: "noopener noreferrer", target: "_blank" } : attribs };
    },
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }),
  },
};

export async function renderMarkdown(markdown: string): Promise<string> {
  const html = await marked.parse(markdown, { gfm: true });
  return sanitizeHtml(html, OPTIONS);
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"');
const slugify = (s: string) => s.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);

// Articles: sanitised HTML plus ids on the section headings (added AFTER sanitising, from our own slug
// function, so CMS content can never inject ids) and the contents list built from them.
export async function renderArticle(markdown: string): Promise<{ html: string; toc: { id: string; title: string }[] }> {
  const toc: { id: string; title: string }[] = [];
  const seen = new Set<string>();
  const html = (await renderMarkdown(markdown)).replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const title = stripTags(inner).trim();
    let id = slugify(title) || "section";
    while (seen.has(id)) id += "-2";
    seen.add(id);
    toc.push({ id, title });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html, toc };
}
