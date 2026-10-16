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
