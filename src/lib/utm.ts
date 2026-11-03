// Campaign tags from the landing URL (05-SITE-SPEC.md §7: "Capture UTM source, medium and campaign on landing; store
// them with each submission"). Kept for the browser session only, and sent only with a form the visitor submits.
const KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const STORE = "scs_utm";

export function captureUtm(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const found = Object.fromEntries(KEYS.map((k) => [k, (params.get(k) ?? "").slice(0, 200)]).filter(([, v]) => v));
    if (Object.keys(found).length) sessionStorage.setItem(STORE, JSON.stringify(found)); // the latest campaign wins
  } catch {
    // storage blocked: forms simply go without UTM tags
  }
}

export function readUtm(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(STORE) ?? "{}");
  } catch {
    return {};
  }
}
