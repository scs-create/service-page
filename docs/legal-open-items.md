# Legal pages: status and open items

**Status (18 October 2026): final.** The client supplied lawyer-approved versions of the Terms of Service, Privacy Notice and Cookie Policy (`new_uploads.zip`). They are published at `/terms`, `/privacy` and `/cookies` with no draft notice, are indexable and are listed in the sitemap.

## How the supplied documents were applied
- **Wording:** kept as supplied. In the Terms, each numbered clause became its own heading so the contents list is usable; the text itself is unchanged.
- **Company details** come from `src/lib/site.ts` via `{{tokens}}`, so the legal pages always match the footer and contact page. This corrected the following in the supplied files:
  - The Privacy Notice gave **RC 9552075**; the confirmed RC is **9041457**.
  - All three used old-domain emails (`info@stephencorporateservices.com`, and the Cookie Policy's link pointed to `privacy@…`). They now show `privacy@stephencorporateservices-scs.com` for privacy matters and `contact@…` for general contact.
  - The telephone number is shown as `+234 906 403 5713`.
- **Address:** **SD20 Belham Estate, Karsana, FCT, Abuja** (client decision, 18 October 2026; it replaces "Benhen" site-wide).
- **Dates:** every effective and "last updated" date is **16 October 2026** (client decision). The supplied files said 3 December 2025.
- **Website-specific sections added** (client-approved, 18 October 2026), because the supplied documents are deliberately generic:
  - Privacy Notice → *This website: tools and service providers* (Netlify Forms, Google Workspace, Plausible after consent, Cal.com link-out, GitHub/Netlify for staff editing, retention of job applications).
  - Cookie Policy → *Cookies and similar technologies on this website*, the inventory that Section 6 of the policy requires (`scs_cookie_consent`, `plausible_ignore`, Plausible sets no cookies).
  **Counsel should glance at these two added sections.**
- **Title:** the Terms page is now titled "Terms of Service" (URL unchanged: `/terms`).

## Ongoing
- Delete unsuccessful job applications from Netlify Forms within 6 months (stated in the Privacy Notice website section).
- If the site adds a tool (chat, embedded booking, marketing pixel), update both website sections and the cookie banner before it goes live.
- Placeholder rule still applies: any `[bracketed]` text added later puts that page back into draft (draft notice, `noindex`, out of the sitemap) until resolved.
