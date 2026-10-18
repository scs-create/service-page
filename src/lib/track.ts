// Business events for PostHog. RULE: properties describe the ACTION, never the person. No names, emails,
// phone numbers, message text or file contents ever go into an event: only the keys in ALLOWED_PROPS are sent,
// and anything else is dropped here before it reaches PostHog.
import { getPosthog, trackingAllowedHere } from "@/lib/analytics";
import { getRawConsent, parseConsent } from "@/lib/consent";

export type AnalyticsEvent =
  | "cta_clicked" // { cta_name, location_on_page, page_path }
  | "outbound_link_clicked" // { destination_domain, link_label, location_on_page, page_path }
  | "file_downloaded" // { file_name, page_path }
  | "form_started" // { form_name, page_path }
  | "form_step_completed" // { form_name, step, page_path }
  | "form_submitted" // { form_name, service_interest, page_path }
  | "form_error" // { form_name, error_type, page_path }
  | "newsletter_subscribed" // { page_path }
  | "service_page_viewed" // { service_name, page_path }
  | "tool_completed"; // { tool_name, result_band, page_path }

const ALLOWED_PROPS = new Set([
  "cta_name", "location_on_page", "page_path", "destination_domain", "link_label", "file_name",
  "form_name", "step", "service_interest", "error_type", "service_name", "tool_name", "result_band",
]);

type Props = Record<string, string | number | boolean | undefined>;

function clean(props: Props): Record<string, string | number | boolean> {
  const out: Record<string, string | number | boolean> = {};
  for (const [k, v] of Object.entries(props)) {
    if (!ALLOWED_PROPS.has(k) || v === undefined || v === "") continue;
    out[k] = typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, 100) : v;
  }
  return out;
}

// Events fired while posthog-js is still downloading (consent already given) wait here, then flush.
// Without consent nothing is queued: those events are simply dropped.
const queue: [AnalyticsEvent, Record<string, string | number | boolean>][] = [];
const consented = () => !!parseConsent(getRawConsent())?.analytics && trackingAllowedHere();

export function track(event: AnalyticsEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  const data = clean({ page_path: window.location.pathname, ...props });
  const ph = getPosthog();
  if (ph) ph.capture(event, data);
  else if (consented() && queue.length < 50) queue.push([event, data]);
}

export function flushQueue() {
  const ph = getPosthog();
  if (!ph) return;
  for (const [event, data] of queue.splice(0)) ph.capture(event, data);
}

// "Book a Discovery Call" → "book_a_discovery_call"
export const toSnake = (s: string) =>
  s.normalize("NFKD").toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 60);

// Anonymous lead ID: created only when a visitor who accepted analytics submits a form. It is saved with the
// enquiry in Netlify (hidden field lead_id) and used as the PostHog person ID, so a lead can be matched to the
// visit that produced it without any email, name or phone number reaching PostHog.
export function newLeadId(): string | null {
  if (!getPosthog() || typeof crypto === "undefined" || !crypto.getRandomValues) return null;
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return `lead_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}

export function identifyLead(leadId: string | null, traits: { service_interest?: string; lead_source: string }) {
  const ph = getPosthog();
  if (!ph || !leadId) return;
  // Only these two non-sensitive traits are set on the person.
  const set: Record<string, string> = { lead_source: toSnake(traits.lead_source) };
  if (traits.service_interest) set.service_interest = traits.service_interest.slice(0, 100);
  ph.identify(leadId, set);
}
