# Client & Partner Portal — phase-two plan

Status: **plan only, not built.** The launch site has no public login. Editors use `/admin` (Decap CMS, GitHub login); staff use Google Workspace. `/portal` is a mock-data prototype that returns 404 in production.

## 1. What the portal is for
One secure place where an SCS client or partner can:
- see each engagement and where it sits in **Assess → Structure → Comply → Improve → Grow**;
- see the documents SCS needs from them, and upload them;
- download what SCS delivers (certificates, filings, contracts, policies, reports);
- see upcoming compliance deadlines (annual returns, renewals, filings) per company;
- message the SCS team about an engagement, so nothing is lost in WhatsApp or personal email.

Out of scope for phase two: payments, e-signature, public sign-up (accounts are created by SCS only).

## 2. Roles

| Role | Who | Can | Cannot |
|---|---|---|---|
| **Client** | A contact at a client company | View own companies' engagements, documents, deadlines; upload requested documents; message SCS | See any other client; delete SCS deliverables |
| **Partner** | External specialist engaged by SCS (tax consultant, company secretary, DPO, etc.) | View and work on engagements they are assigned to; upload deliverables | See unassigned engagements or client lists; export data |
| **Staff** | SCS team member | Create engagements, request documents, upload deliverables, manage deadlines for assigned clients | Manage users or roles; change audit settings |
| **Admin** | Founders / designated managers | Everything staff can do, plus invite/disable users, assign roles, view the audit log, run data-subject requests | Bypass MFA or the audit log |

Access is per company and per engagement (row-level), never "all clients" by default. One person can belong to several client companies.

## 3. Recommended stack
- **Authentication: Supabase Auth** (or Clerk if SCS prefers a fully managed admin UI). Reasons: email magic links and passwords, TOTP MFA, and roles enforced in the database with row-level security, so a bug in the page code cannot leak another client's files. Staff can sign in with Google Workspace (SSO/OAuth), so there's no extra password.
- **Data and files:** Supabase Postgres + Supabase Storage (private buckets, short-lived signed download links, per-row access policies).
- **App:** a separate Next.js app on a subdomain (`portal.stephencorporateservices-scs.com`) with dynamic rendering, deployed on Netlify. The marketing site stays static and fast; the portal's security headers (strict CSP with nonces) don't affect it.
- **Email:** transactional notices (document requested, deliverable ready, deadline in 30 days) from Google Workspace SMTP or a transactional provider.

## 4. Data protection (Nigeria Data Protection Act 2023)
- **Roles:** for client documents SCS is usually a data **processor** acting for the client; for its own client contacts it is a **controller**. The Terms (Part 2) already describe this; the portal must match it.
- **Lawful basis and notice:** contract performance for engagement data. Update the Privacy Notice (service providers, location, retention) before launch.
- **Location and transfers:** choose the hosting region closest to Nigeria that the provider supports, and record the cross-border transfer basis (sections 41–43 NDPA: adequacy, contractual clauses or another permitted ground) in the transfer register. Sign the provider's data processing agreement.
- **Minimisation:** store only what an engagement needs. No BVN, card or bank login data. Identity documents only where a filing requires them, and deleted once the filing is done.
- **Retention:** per-document-type rules (for example, engagement records for the life of the engagement plus the legal period). Automatic deletion jobs, with a deletion log.
- **Security:** encryption in transit and at rest, private storage, signed URLs that expire within minutes, audit log of every view, upload, download and permission change, and backups with tested restore.
- **Rights:** admins can export or delete a person's data to answer access/erasure requests within the Privacy Notice deadline.
- **Breaches:** documented incident process. The NDPC must be notified within 72 hours where required, and clients without undue delay (Terms §15).
- **DPIA:** complete a data protection impact assessment before go-live, since the portal will hold identity and corporate documents at scale.

## 5. Security requirements
- **MFA mandatory** for staff and admin (TOTP authenticator app, with recovery codes). Optional at first for clients and partners, mandatory later.
- Session timeout after inactivity; device/session list with "sign out everywhere".
- No public sign-up. Invitations expire after 72 hours.
- Upload checks: file-type allowlist (PDF, JPG, PNG, DOCX), size limit, malware scan before staff can open a file.
- Rate limiting on sign-in; alerts on repeated failures.
- An independent penetration test before go-live.

## 6. Document sharing flow
1. Staff create an engagement and a **document request** ("Certified ID of directors").
2. The client gets an email with a link that leads to sign-in, not straight to a file.
3. The client uploads. The file is scanned, then staff are notified.
4. Staff review it and mark it accepted, or ask for a replacement with a reason.
5. Deliverables are uploaded by staff or partners and released to the client, who is notified.
6. Every step is written to the audit log.

## 7. Build estimate (indicative, for one experienced developer)

| Phase | Scope | Effort |
|---|---|---|
| 0 | DPIA, data map, provider agreements, Privacy Notice update | 1 week (with counsel) |
| 1 | Auth, roles, MFA, invitations, company/engagement model, audit log | 2–3 weeks |
| 2 | Document requests, uploads, scanning, deliverables, signed downloads | 2 weeks |
| 3 | Compliance deadlines per company, email notices | 1–2 weeks |
| 4 | Messaging per engagement | 1 week |
| 5 | Hardening, accessibility (WCAG 2.2 AA), penetration test, pilot with 3–5 clients | 2 weeks |
| | **Total** | **about 9–11 weeks** |

## 8. Running cost (indicative; check current pricing before committing)
- Auth + database + storage (Supabase Pro or equivalent): low tens of US dollars a month at pilot scale, rising with storage and users.
- Hosting (Netlify): covered by the current plan at pilot scale. Watch function and bandwidth limits.
- Malware scanning and transactional email: usage-based, usually small at pilot scale.
- One-off: penetration test and legal review of the DPIA and Privacy Notice.

## 9. Decisions SCS needs to make before building
1. Who is the portal admin (named people)?
2. Clients only first, or clients and partners together?
3. Which document types and which retention periods?
4. Supabase (recommended) or a fully managed identity provider such as Clerk?
5. Budget and target pilot date.
