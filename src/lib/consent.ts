// Cookie-consent storage, per the SCS Cookie Policy: choice recorded as `scs_cookie_consent`
// (browser local storage), valid for 1 year, nothing pre-ticked, withdrawal as easy as consent.
export const CONSENT_KEY = "scs_cookie_consent";
const CHANGE_EVENT = "scs-consent-change";
const OPEN_EVENT = "scs-open-cookie-settings";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const MIN_PLAUSIBLE_TS = Date.UTC(2025, 0, 1); // SCS launched in 2025: anything earlier is not a real record
const CLOCK_SKEW_MS = 5 * 60 * 1000;

export type Consent = { analytics: boolean; functional: boolean; marketing: boolean; ts: number };

// M-02: persisted data is untrusted. Only a fully valid, unexpired record counts as consent.
export function validateConsent(value: unknown, now: number): Consent | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
  const v = value as Record<string, unknown>;
  if (typeof v.analytics !== "boolean" || typeof v.functional !== "boolean" || typeof v.marketing !== "boolean") return null;
  if (typeof v.ts !== "number" || !Number.isFinite(v.ts)) return null;
  if (v.ts < MIN_PLAUSIBLE_TS || v.ts > now + CLOCK_SKEW_MS) return null; // impossibly old or from the future
  if (now - v.ts > ONE_YEAR_MS) return null; // expired
  return { analytics: v.analytics, functional: v.functional, marketing: v.marketing, ts: v.ts };
}

export function parseConsent(raw: string | null, now: number = Date.now()): Consent | null {
  if (!raw) return null;
  try {
    return validateConsent(JSON.parse(raw), now);
  } catch {
    return null;
  }
}

// Returns the stored string only when it is a valid record (so UI and analytics share one source of truth).
export function getRawConsent(): string | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    return parseConsent(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function saveConsent(choice: Omit<Consent, "ts">) {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ ...choice, ts: Date.now() }));
    // Plausible honours this flag, so declining stops tracking immediately even if the script is already loaded.
    if (choice.analytics) window.localStorage.removeItem("plausible_ignore");
    else window.localStorage.setItem("plausible_ignore", "true");
  } catch {
    /* storage unavailable (private mode): choice applies for this page view only */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeConsent(cb: () => void) {
  window.addEventListener(CHANGE_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(CHANGE_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));
export const onOpenCookieSettings = (cb: () => void) => {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
};
