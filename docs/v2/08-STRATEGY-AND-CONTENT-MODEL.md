> Copy of the owner's Claude Docs document "SCS Website v2 — Strategy and Content Model" (https://claude.ai/artifact/DLnS1EMZqTwuwkD6m7fNHr), revision 90, exported 3 November 2026 for the build. Where it disagrees with 02-DECISIONS.md, the decisions file wins (it records the owner's final rulings, including keeping legal-rule items 1–19 and 21 as v1 and applying only 20 and 22). [OWNER TO CONFIRM] markers below are planning notes and never reach production.

# SCS Website v2 — Strategy and Content Model

2026-11-03 · @stephen

## Purpose and approval gate

This is the Phase 2 deliverable. It sets out what version 2.0 of stephencorporateservices-scs.com will say, to whom, in what structure, and how success is measured. Phase 3 (design directions A and B) starts only after you approve sections 4 to 8 and answer the questions in the last section.

Three standing rules from you apply throughout:

- **No fees or cost values anywhere.** That includes SCS fees, ranges, "from" prices and official government fees, because these change. Pages describe steps, documents and who the regulator is; fees appear only in a proposal.
- **Nothing on the site relates SCS Ltd to legal work.** No "legal", "law firm", "lawyer", "counsel", "litigation" or "legal advice" describing SCS. No line saying SCS refers clients to lawyers, either.
- **The Big Four and the best professional-services, corporate-services and sales websites are guides and inspiration, not competitors.** They show the standard of practice SCS is growing towards. We borrow their discipline and do better on clarity, guidance and speed.

## Decisions log (carried into Phases 3 to 8)

| Date | Decision | Effect on later phases |
|---|---|---|
| 3 Nov 2026 | Response promise reads "We respond within 24 hours." | Same wording on all forms, Contact and confirmation emails |
| 3 Nov 2026 | Remove the live "Open now" indicator | Contact shows the office hours as text only |
| 3 Nov 2026 | No delivery or completion timelines for any service | Service pages, guides and tools give none |
| 3 Nov 2026 | Home H1 and positioning written for a global audience | Applies to all page heroes |
| 3 Nov 2026 | Legal-rule table: only items 20 and 22 approved; all others keep their v1 wording | The build applies 20 and 22 only |
| 3 Nov 2026 | Drive Services reset: all 45 catalogue services are current | 65 service pages (section 4) |
| 3 Nov 2026 | Drive "02 How Work Runs" defines six steps: Enquiry, Understand the need, Propose, Agree, Deliver (with review), Hand over and close | The "How we work" page and the home process strip use these six steps |
| 3 Nov 2026 | Build happens in your Claude Code session; this session is for planning | Phase 4 runs in Claude Code |
| 3 Nov 2026 | All 12 owner decisions ticked | Choices still to be specified are listed as open items in each phase update |

**Second round of owner decisions, 3 November 2026.** These are final and override anything else in this document.

| # | Decision | Effect on the build |
|---|---|---|
| 1 | Design **Direction B** chosen: Source Serif 4 for H1/H2, Inter for everything else | The design system gains a serif heading face for the website |
| 2 | Proof-figure definitions approved; **no "as at" dates** | Figures show a definition only |
| 3 | Values list stays as it is for now | No change |
| 4 | Legal-rule items 1, 2, 13 and 16 **kept as v1** (with all other items except 20 and 22) | The CI word check allow-lists these exact passages |
| 5 | **All 23 case studies** approved and consented | All 23 migrate |
| 6 | No extra partner benefits for now; **enquiries kept for 6 months**; no policy-reviewer details needed | The retention job deletes enquiries and career files after 6 months |
| a | Service names use terms generally used by professional service firms worldwide | Section 4 now uses globally understood names |
| b | The company's full name is **"Stephen Corporate Services - SCS Ltd"**, written in full everywhere except where space makes it impossible (then "SCS") | Header, footer, metadata, JSON-LD, emails and policies |
| c | **The tower motif returns on the home page** and is never removed; it is the SCS symbol from the logo. A **Home** link returns to the menu. "Who we help" becomes **Clients** and "How we work" becomes **Process** | Navigation: Home · Services · Clients · Process · Partnership · Insights · About |
| d | The mobile home page must be shorter, keeping all content | Carousels and compact panels on mobile (see the design canvas) |
| e | Contact phone and WhatsApp: **+234 812 813 8222** | Replaces +234 906 403 5713 everywhere |

## 1. Phase 1 findings in brief

Version 1 has strong raw material but it is spread too thin. It lists 21 service categories holding 307 service lines, many of them repeated. Some of its wording ties SCS to legal work, and the mobile journey stops after one page.

| Area | Finding | What v2 does |
|---|---|---|
| Code base | GitHub `main` is at commit 821353f (19 October 2026). It is ahead of the zip: it has Netlify functions, team photos, a client-portal plan and 10 Corporate School posts. | Build v2 from `main` on branch `v2`. This session has read access only, so push access is needed (see last section). |
| Traffic (PostHog, last 30 days, re-pulled 3 November 2026) | 24 visitors, 54 pageviews, 24 sessions, 2 min 23 s average session, 42% bounce. These match your snapshot. | This is the baseline to beat. Mobile and search are the gaps. |
| Services | 21 categories, 307 service lines. Repeats include "Corporate restructuring" (4 categories), "Employment documentation" (3) and "Contract lifecycle management" (2). | Merge into 7 needs-based clusters with one entry per service (section 4). |
| Internal catalogue (document 01) | 45 planned services. 16 are Phase 1 and "Conditional"; the other 29 are "Inactive". | The site describes every service as "Discuss this service". It makes no delivery-time promises for services not yet active. |
| Industries | 15 industry pages (not 12). Several overlap, for example "Construction & General Contracting" and "Real Estate & Construction". | Merge into 6 (section 6). |
| Case studies | 23 entries. 20 show an RC number and 3 do not. One client is a law chambers. | Use the fixed case-study structure. Owner decides on the three entries without RC numbers and the law-chambers entry (last section). |
| Legal wording | 37 files contain legal-related words. Most are generic policy phrasing, but about 20 items describe SCS's own work in legal terms. | Rename or remove each (section 5). |
| Tools | 5 tools: Assess, Compliance Checklist, Structure Chooser, Find My Service, Compliance Calendar. Each was used at least once (PostHog top pages). | Keep all 5. Each ends in a result and "Discuss your result". |
| Reference sites | The Big Four Nigeria sites are organised by industry and service line, and give a first-time founder no sign of what to do first. KPMG's "Submit RFP" header button, Deloitte's governance page and EY's named leader are worth matching. Small Nigerian agent sites rank by keyword volume and often cite out-of-date rules. | Match their trust signals. Lead with task-led "Start here" paths and dated, sourced guides. |

One internal risk: an internal retainership document brands SCS with legal wording. It is internal, but its phrases must never be copied into site copy, metadata or sales material.

## 2. Positioning

**Proposed one-line positioning** [OWNER TO CONFIRM]:

> Stephen Corporate Services - SCS Ltd is a corporate services and business support company based in Abuja, working with organisations worldwide. We give clients in Nigeria and abroad one accountable coordinator for registration, filings, documentation, operations and growth.

**Home page H1 (proposed):** One accountable partner for setting up, running and growing your organisation, in Nigeria and across borders.

**Supporting line:** Registration support, regulatory filings, company-secretarial administration, documentation and growth projects, scoped in writing and quality-reviewed before delivery.

**The 10-second test.** Every key page shows four things above the fold on mobile:

| Question | Where it is answered |
|---|---|
| What SCS does | H1 and supporting line |
| Who it is for | "Start here" links naming each audience |
| Why it can be trusted | RC 9041457 with a link to the Verification page, plus one dated proof figure |
| What the next step is | One primary button, "Book a Discovery Call" |

**What makes SCS different, shown rather than claimed.** The "How we work" path is the differentiator. Every engagement starts with diagnosis and is agreed in writing (scope, deliverables, exclusions, milestones, acceptance). Specialist work goes to vetted professionals with a backup. The SCS management team reviews every deliverable before it is sent. SCS commits to defined work and service levels, not to outcomes it does not control, such as approvals, grants, investment or sales.

## 3. Audiences and Start-here paths

Each audience has one entry point on the home page and one page under `/who-we-help/`. Every path ends in a partnership conversation. The current data (21 of 24 visitors in Nigeria; 2 from the US and 1 from Saudi Arabia) supports this order. The enquiry review in Gmail is still to be done before Phase 5.

| # | Audience | Home-page link text | First things they need | Path ends at |
|---|---|---|---|---|
| 1 | Nigerian founders and SMEs | "I'm starting or formalising a business" | Structure Chooser, a registration guide, post-incorporation filings, tax ID | Book a Discovery Call |
| 2 | Growing companies | "I want an ongoing business partner" | How we work, What partners receive, case studies | Start a partnership conversation |
| 3 | NGOs, foundations, schools and faith organisations | "I run a non-profit or institution" | Incorporated trustees guide, governance documents, donor-compliance support | Book a Discovery Call |
| 4 | Foreign companies, investors and diaspora founders | "I'm entering Nigeria from abroad" | A plain setup sequence, remote delivery explained, office hours in WAT (UTC+1) | Request a proposal |
| 5 | International firms needing a Nigeria operations partner | "I need a remote operations partner in Nigeria" | Scope of administrative support: client intake, file administration, billing administration, research support, back office, customer support | Start a partnership conversation |
| 6 | Learners and organisations wanting training | "I want training for my team or myself" | Corporate College request form, link to Stephen Corporate Academy (SCA) | Request training |
| 7 | Professionals and job candidates | "I want to work with SCS" | Expert-network criteria, open roles | Apply |

Page pattern for each audience: who this is for → what usually comes first → how SCS helps → "Are we a fit?" → one relevant case study → What happens next (three steps) → one button.

## 4. Merged service model (for approval)

There are **7 clusters and ****6****6**** services**, named in terms professional service firms use worldwide (owner decision a). The list merges the 21 v1 categories with all 45 catalogue services; every catalogue service has been current since the Drive Services reset. The Service Finder is the main way in, and each cluster hub shows its most-requested services first. No page states a delivery or completion timeline. The build uses `03-services.v2.json` in the build pack as the single source of truth.

Each entry in the data file carries: service ID, name, cluster, summary, benefits, what you receive, typical deliverables, what you provide, related audiences and industries, related guides and case studies, and page path.

| ID | Cluster | Service | Catalogue ID | v1 category |
|---|---|---|---|---|
| SA-01 | Strategy & Advisory | Quarterly Business Check-Up and Business Growth Report | SCS-001 | new |
| SA-02 | Strategy & Advisory | Business strategy consulting | — | strategy-management-and-business-consulting |
| SA-03 | Strategy & Advisory | Market research and competitor analysis | SCS-014 | research-market-intelligence-and-policy |
| SA-04 | Strategy & Advisory | Regulatory and policy research | — | research-market-intelligence-and-policy |
| SA-05 | Strategy & Advisory | Market entry strategy | SCS-040 | strategy-management-and-business-consulting |
| SA-06 | Strategy & Advisory | Business coaching | SCS-035 | new |
| SA-07 | Strategy & Advisory | ESG and sustainability readiness | SCS-037 | new |
| SA-08 | Strategy & Advisory | Pricing strategy | SCS-013 | new |
| SA-09 | Strategy & Advisory | Succession planning for family businesses | SCS-036 | new |
| SA-10 | Strategy & Advisory | Brand and idea monetisation strategy | SCS-039 | new |
| SA-11 | Strategy & Advisory | Corporate and commercial advisory | — | corporate-and-commercial-advisory |
| CS-01 | Company Formation & Secretarial | Company registration | — | business-formation-and-corporate-structuring |
| CS-02 | Company Formation & Secretarial | NGO and foundation registration | — | business-formation-and-corporate-structuring |
| CS-03 | Company Formation & Secretarial | Foreign company setup in Nigeria | — | business-formation-and-corporate-structuring |
| CS-04 | Company Formation & Secretarial | Company secretarial services | — | business-formation-and-corporate-structuring |
| CS-05 | Company Formation & Secretarial | Shareholding and group structuring | — | business-formation-and-corporate-structuring |
| CS-06 | Company Formation & Secretarial | Corporate restructuring | — | business-formation-and-corporate-structuring |
| CS-07 | Company Formation & Secretarial | Intellectual property and brand asset management | — | intellectual-property-and-brand-asset-management |
| CR-01 | Compliance & Regulatory | Annual returns and statutory filings | — | business-formation-and-corporate-structuring |
| CR-02 | Compliance & Regulatory | Beneficial ownership (PSC) reporting | — | business-formation-and-corporate-structuring |
| CR-03 | Compliance & Regulatory | Tax registration and compliance | — | tax-accounting-and-financial-business-support |
| CR-04 | Compliance & Regulatory | Licences and permits | SCS-044 | regulatory-compliance-and-licensing |
| CR-05 | Compliance & Regulatory | Compliance calendar and monitoring | — | regulatory-compliance-and-licensing |
| CR-06 | Compliance & Regulatory | Data protection compliance | — | data-protection-privacy-and-information-governance |
| CR-07 | Compliance & Regulatory | Corporate partnership and regulatory business support | — | corporate-partnership-and-regulatory-business-support |
| CR-08 | Compliance & Regulatory | Visa and international business documentation | SCS-045 | new |
| FA-01 | Finance & Accounting | Bookkeeping | SCS-029 | tax-accounting-and-financial-business-support |
| FA-02 | Finance & Accounting | Payroll administration | — | tax-accounting-and-financial-business-support |
| FA-03 | Finance & Accounting | Management accounts and cash-flow planning | SCS-030 | tax-accounting-and-financial-business-support |
| FA-04 | Finance & Accounting | Business plans and pitch decks | SCS-033 | corporate-communications-and-business-documentation |
| FA-05 | Finance & Accounting | Investment readiness | SCS-032 | transaction-investment-and-growth-advisory |
| FA-06 | Finance & Accounting | Grant and donor funding applications | SCS-042 | new |
| FA-07 | Finance & Accounting | Tender and bid preparation | SCS-043 | new |
| FA-08 | Finance & Accounting | Transaction and investment advisory | — | transaction-investment-and-growth-advisory |
| FA-09 | Finance & Accounting | Invoicing and credit control | SCS-031 | new |
| FA-10 | Finance & Accounting | Cost reduction review | SCS-034 | new |
| FA-11 | Finance & Accounting | Tax planning and tax health checks | SCS-041 | tax-accounting-and-financial-business-support |
| HO-01 | HR & Operations | Standard operating procedures (SOPs) | SCS-022 | business-operations-and-outsourced-support |
| HO-02 | HR & Operations | Outsourced business administration | — | business-operations-and-outsourced-support |
| HO-03 | HR & Operations | Remote operations support for international firms | — | business-operations-and-outsourced-support |
| HO-04 | HR & Operations | HR administration and staff handbooks | SCS-016 | human-resources-and-staff-management |
| HO-05 | HR & Operations | Recruitment | SCS-017 | recruitment-and-talent-solutions |
| HO-06 | HR & Operations | Performance management systems | SCS-018 | human-resources-and-staff-management |
| HO-07 | HR & Operations | Procurement and vendor management | SCS-024 | procurement-supply-chain-and-vendor-management |
| HO-08 | HR & Operations | Project management | — | project-management-and-implementation |
| HO-09 | HR & Operations | Contract lifecycle management | — | contract-lifecycle-management |
| HO-10 | HR & Operations | Customer service outsourcing | SCS-015 | customer-experience-and-customer-care |
| HO-11 | HR & Operations | Employee wellness programmes | SCS-020 | new |
| HO-12 | HR & Operations | Inventory management systems | SCS-023 | new |
| HO-13 | HR & Operations | Quality control systems | SCS-025 | new |
| HO-14 | HR & Operations | Workplace layout optimisation | SCS-027 | new |
| HO-15 | HR & Operations | Logistics and route planning | SCS-028 | new |
| HO-16 | HR & Operations | Remote and hybrid team management | SCS-021 | human-resources-and-staff-management |
| HO-17 | HR & Operations | Staff training and workshops | SCS-019 | new |
| TD-01 | Technology & Digital | Website design and development | SCS-002 | new |
| TD-02 | Technology & Digital | CRM setup | SCS-004 | customer-experience-and-customer-care |
| TD-03 | Technology & Digital | Workflow automation | SCS-005; SCS-026 | ai-governance-and-digital-transformation |
| TD-04 | Technology & Digital | Dashboards and business intelligence | SCS-006 | data-analytics-and-business-intelligence |
| TD-05 | Technology & Digital | AI governance and digital transformation | — | ai-governance-and-digital-transformation |
| TD-06 | Technology & Digital | E-commerce and online payments setup | SCS-003; SCS-007 | new |
| MC-01 | Marketing & Communications | Brand identity design | SCS-010 | digital-marketing-and-brand-growth |
| MC-02 | Marketing & Communications | Social media and digital advertising | SCS-008; SCS-009 | digital-marketing-and-brand-growth |
| MC-03 | Marketing & Communications | Corporate communications and company profiles | — | corporate-communications-and-business-documentation |
| MC-04 | Marketing & Communications | Sales training | SCS-011 | new |
| MC-05 | Marketing & Communications | Customer loyalty programmes | SCS-012 | customer-experience-and-customer-care |
| MC-06 | Marketing & Communications | Crisis communications planning | SCS-038 | new |

The five services marked "v1 wording retained" in the data file (SA-11, CS-07, CR-07, FA-08 and HO-09) keep their v1 service lines, as owner decision 4 requires.

Clusters: Strategy & Advisory · Company Formation & Secretarial · Compliance & Regulatory · Finance & Accounting · HR & Operations · Technology & Digital · Marketing & Communications.

With 66 services, the mega-menu shows the 7 clusters only. Visitors reach individual services through the Service Finder, the cluster hubs and site search.

Training in any of these areas is still offered through Corporate College, with "request a topic not listed".

## 5. Legal-rule changes (for approval)

There are 22 items: renames and rewrites, 5 removals, 2 owner decisions and one redirect to keep. Nothing is published until you approve this list. After the build, CI runs a scan for the banned words on the whole site, including metadata, JSON-LD, alt text, file names and URLs.

**Owner decision, 3 November 2026:** only items 20 and 22 are approved. Every other item keeps its v1 wording. Section 4 therefore keeps the v1 names and structure for the categories in items 3, 7, 8 and 11 until the service list is approved.

| # | Where (v1) | Current wording | Proposed | Action |
|---|---|---|---|---|
| 1 | FAQ "Is SCS a law firm?" | "No. SCS is a multidisciplinary corporate services company. Where specialist legal or regulated professional services are required, SCS partners with the relevant professionals and coordinates the work." | "No. SCS is a corporate services and business support company. We do not provide legal services or legal advice." [OWNER TO CONFIRM] | Rewrite |
| 2 | About page, standards list | "Where specialist legal or regulated professional services are required, SCS partners with the relevant professionals… SCS does not present itself as a law firm." | Delete the sentence. Standards keep: scope in writing, vetted specialists, management quality review. | Remove |
| 3 | Service category "Corporate Partnership & Regulatory Business Support" (formerly "Legal Partnership…") | The framing sentence says SCS "partners with" legal professionals. Its lines include "Corporate and commercial matters", "Competition and consumer matters" and "Dispute prevention and management support". | Dissolve the category. Move the regulatory lines into CF-07 "Compliance reviews and remediation support". | Remove category; merge |
| 4 | Same category, line | "Dispute prevention and management support" | — | Remove |
| 5 | Same category, line | "Regulatory investigations and response support" | "Document collation for regulator requests" | Rename |
| 6 | Same category, line | "Competition and consumer matters" | — | Remove |
| 7 | Service category "Corporate & Commercial Advisory" | "Contract drafting and review", "Contract negotiation support", "Commercial contracts and agreements", "Customer agreements", "Terms and conditions", "Non-disclosure and confidentiality arrangements" | Dissolve the category. Keep only "Agreement records and documentation management" (PO-09): registers, templates the client supplies, renewal tracking and approval records. | Remove drafting, review and negotiation lines |
| 8 | Service category "Contract Lifecycle Management" | "Contract matter management", "Contract intake systems" | Merge into PO-09 as "Agreement registers, renewal tracking and approval workflows" | Rename |
| 9 | Procurement category, line | "Contract administration" | "Supplier agreement records" | Rename |
| 10 | AI Governance category, line | "Contract and compliance technology implementation" | "Compliance and document-workflow technology" | Rename |
| 11 | Service category "Intellectual Property & Brand Asset Management" | "Trademark registration support", "Patent support", "IP due diligence support", "IP commercialisation support" | SS-07 "Brand asset records and registration coordination": a brand asset inventory, a domain and digital-asset register, and filing administration with the Trademarks, Patents and Designs Registry. Patent, due-diligence and commercialisation lines removed. | Rename; remove 3 lines |
| 12 | Transaction category, lines | "Deal structuring support", "M&A support" | "Transaction readiness and data-room preparation" | Rename |
| 13 | Terms page, scope clause | "…Where a task legally requires a practising solicitor… A solicitor-client relationship arises only where a practising legal practitioner expressly accepts a legal engagement…" | "We provide corporate services, administrative support, regulatory filing coordination and business operations support within the agreed scope. We do not provide legal services or legal advice." | Rewrite |
| 14 | Privacy page, recipients list | "Including solicitors, intellectual property agents…" | "Professional advisers and specialists engaged for the agreed work, such as accountants, registry agents and technical specialists" | Rewrite |
| 15 | Terms page, outcomes clause | "…licence, registration, sales result, revenue level, litigation outcome, tax result…" | Drop "litigation outcome" | Rewrite |
| 16 | Leadership card, Founder | Name "Stephen Onyekeja, Esq." and credentials "LL.B., BL, ACArb, CDPO, ACA (in view)" | "Stephen Onyekeja — Chairman / Founder". The credential line is your decision. | Owner decision |
| 17 | Leadership card, Founder focus | "Legal & regulatory compliance" | "Regulatory compliance" | Rename |
| 18 | Leadership card, Founder LinkedIn | The profile URL slug contains the legal post-nominals | Keep or drop the link | Owner decision |
| 19 | Corporate School article "Drafting a Master Service Agreement" | The title is about drafting, and the article says "Where an agreement needs a lawyer's drafting or advice, SCS coordinates with qualified professionals" | Retitle "Keeping service-agreement records: what to track". Delete the coordination sentence. | Rewrite |
| 20 | Other Corporate School articles (6) | Reader notes such as "obtain appropriate legal advice" | "Seek specialist professional advice for your situation", or the standard "for general information only" note | Rewrite |
| 21 | Case study "Godwin Etuk & Co-Lex Spectacle Chambers" | A law-chambers client. The work shown may itself be legal-adjacent. | Recommend removing it from the public portfolio, even with consent. | Remove (recommended) |
| 22 | Old URL `/services/legal-partnership-and-regulatory-business-support` | The URL is in the current redirect config | Keep a 301 redirect to the new CF-07 page in `_redirects` only. The URL never appears in links, the sitemap or page text. | Keep the redirect only |

The policy pages keep ordinary policy language ("legal basis", "legal obligation") where data protection law requires it. Those phrases describe SCS's own duties, not a service, and the regulator's terms cannot be avoided. [OWNER TO CONFIRM that the lawyer reviewing the policies agrees.]

## 6. Sitemap and redirects

The top navigation has six items: **Home · Services · Clients · Process**** · Partnership · Insights · About**. A "Book a Discovery Call" button sits on the right, with "Request a proposal" as a text link beside it. Contact, Tools, Work, Corporate College and Join us sit in the footer and the mobile menu. Existing URLs stay wherever they still fit.

| Section | Pages | URL |
|---|---|---|
| Home | 1 | `/` |
| How we work (new) | 1 | `/how-we-work` |
| SCS Partnership (new) | 2 | `/partnership`, `/partnership/remote-operations` |
| Services | 1 index, 7 cluster hubs, 47 service pages | `/services`, `/services/<cluster>`, `/services/<cluster>/<service>` |
| Who we help | 5 audience pages, 1 industries index, 6 industry pages | `/who-we-help/<audience>`, `/industries/<industry>` |
| Work | Case-study index and pages, Verification | `/portfolio`, `/portfolio/<slug>`, `/verification` |
| Corporate College | Training request, Corporate School blog, 6 topic hubs, Compliance Calendar | `/corporate-college`, `/corporate-college/corporate-school/...` |
| Tools | Index and 5 tools | `/tools`, `/assess`, `/compliance-checklist`, `/business-structure`, `/find-my-service`, `/compliance-calendar` (kept) |
| About | Story, leadership, our standards, registration details | `/about`, `/about/standards` |
| Contact | Contact, Request a proposal | `/contact`, `/contact/proposal` |
| Join us | Careers, expert network | `/career` (kept), `/career/expert-network` |
| Footer | Privacy, Cookies, Terms, Accessibility statement, Cookie settings, Search | `/privacy`, `/cookies`, `/terms`, `/accessibility`, `/search` |

**Industries merged from 15 to 6:**

| v2 industry | Merges the v1 pages |
|---|---|
| Agriculture & Food | Agriculture & Agribusiness |
| Education & Non-profits | Education; Private Schools & Early Years; Nonprofits & Social Enterprises |
| Energy, Construction & Real Estate | Energy, Oil & Gas; Construction & General Contracting; Real Estate & Construction |
| Financial Services | Financial Services & Fintech; Lending, Credit & Investment |
| Health & Manufacturing | Healthcare & Pharmaceuticals; Manufacturing |
| Technology, Media & Consumer | Technology & Digital Businesses; Media & Entertainment; Retail & Consumer Businesses; Professional Services |

**Redirects (301, in ****`_redirects`****).** About 30 rules in total:

- the 21 old `/services/<category>` URLs → the new cluster or service page that replaces each one;
- the 15 old `/industries/<slug>` URLs → the 6 merged industry pages;
- the existing rules: `/academy` and `/academy/*` → `/corporate-college`, and the old legal-partnership URL → CF-07;
- the renamed Corporate School article → its new slug;
- `www` → the apex domain.

The full rule table is generated from the service data file in Phase 4, so it cannot drift from the pages.

## 7. Page templates

Eight templates cover every page. Each has one primary action and ends with "What happens next" in three steps. On mobile, a compact Call / WhatsApp / Book bar is fixed to the bottom of every page.

| Template | Sections, in order | Primary action |
|---|---|---|
| Home | Plain H1 and supporting line → trust strip (RC, Verification, 3 dated figures) → Start here by audience (7 links) → How engagements work (6 steps) → SCS Partnership in brief → selected case studies (3, shown as fact panels) → latest Corporate School guides (3) → closing next step | Book a Discovery Call |
| Cluster hub | What this cluster covers → most-requested services first → all services in the cluster → related guides → related case study → What happens next | Discuss your needs |
| Service page (from the data file) | Summary → who it is for → benefits → What you receive → What you provide → How it runs (link to How we work) → what this service does not include → related guide and case study → What happens next | Discuss this service |
| Audience page | Who this is for → what usually comes first → how SCS helps → Are we a fit? → case study → What happens next | Varies by audience (section 3) |
| Case study | Client and RC → sector → challenge → what SCS did → deliverables → outcome stated factually → date → related service | Discuss similar work |
| Guide (Corporate School) | Plain promise in the subtitle → author, published date, last reviewed date → "For general information only" note → numbered sections → one worked example → official sources with retrieval dates → related service | Ask a question |
| Tool | Short intro → steps → result → "Email me my result" (with consent) → Discuss my result | Discuss my result |
| Form page (Contact, Proposal, Training, Careers, Expert network) | Why we ask → the fewest fields needed → consent → response promise → after submitting, a "What happens next" panel with the reference number, the timeline and one next-step button | Submit |

**Response promise, on every form and the Contact page:** "We respond within 24 hours." Contact also shows a live "Open now" or "Opens Monday 8 am WAT" indicator (remove this indicator).

**Proof figures**, each with a one-line definition (approved, with no "as at" date):

| Figure | Proposed definition |
|---|---|
| 3,000+ registrations | Business registrations approved by the Corporate Affairs Commission (CAC), worded as on the live site |
| 1,800+ agreements | Business agreements and documents prepared or processed for clients |
| 1,200+ engagements | Completed client engagements of any service type |
| 10+ sectors | Distinct sectors among clients served |

## 8. SCS Partnership page outline

The Partnership page is the site's centre, and every audience path leads to it. It never shows fees, plan prices or "from" prices. It shows what partners receive and how a partnership is agreed, and the route forward is a conversation.

- **Hero.** H1: "An SCS Partnership: one accountable coordinator for your organisation." Line: "A retainership plan agreed with each partner, built around what your organisation needs." Button: Start a partnership conversation.
- **What a partnership is.** A retainership plan tailored to each partner. It covers recurring corporate, filing, documentation and operational support, with projects added as they are diagnosed and agreed.
- **What partners receive.**
  - The Quarterly Business Check-Up
  - The SCS Business Growth Report
  - One coordinator for continuous support
  - Scoped projects agreed in writing before work starts
  - Management quality review before anything is delivered
  - [OWNER TO CONFIRM any further benefits and any plan names]
- **Who it suits.** Growing companies, NGOs and institutions with recurring obligations, foreign-owned companies operating in Nigeria, and international firms needing a Nigeria operations partner.
- **Are we a fit?** Two columns.
  - What SCS looks for: a willingness to share the information a diagnosis needs, a named contact on your side, and work SCS can deliver well.
  - What you can expect from SCS: neutral diagnosis, scope in writing, vetted specialists with backup, quality review, and service levels that are defined and kept.
  - Closing line: "If we are not the right fit for a need, we will say so."
- **How a partnership is agreed.** Discovery call → diagnosis or Business Check-Up → tailored proposal (scope, deliverables, milestones) → agreement → onboarding → quarterly review.
- **Remote operations partnership for international firms.** A clearly signposted variant linking to `/partnership/remote-operations`. It covers client intake, case and file administration, billing administration, research support, back office and customer support, all described in administrative terms only. It states the time zone (WAT, UTC+1) and how working hours overlap with Europe and North America.
- **Partnerships in practice.** Two case studies told as working relationships, using approved clients only.
- **What happens next.** You request a conversation → we reply within 24 working hours → a Discovery Call and, if there is a fit, a proposal.

The tone throughout is mutual ("let's see if we're right for each other"), never pressing.

## 9. Tone guide

SCS writes like a senior adviser who has already done the work: plain, specific and calm. This builds on the design system's voice rules, with five additions for v2.

| Rule | Write | Not |
|---|---|---|
| Say what happens, not what we are | "We prepare and file your annual returns with the CAC." | "We are a leading, innovative partner." |
| Name what you receive | "You receive: the filed return, the CAC acknowledgement and an updated records register." | "Comprehensive compliance solutions." |
| Commit only to what SCS controls | "We prepare and submit your filing, then track it until the CAC responds." | "Guaranteed approval." |
| Explain for international readers | "Corporate Affairs Commission (CAC), Nigeria's company registry"; "Mon–Fri, 8 am–5 pm WAT (UTC+1)" | Unexplained acronyms or local shorthand |
| Partner, don't push | "If it's a fit, we'll send a proposal." | "Limited slots", "Act now" |
| No legal framing | "Regulatory filing coordination", "company-secretarial administration", "documentation management" | "Legal", "law", "counsel", "advice on your rights" |
| No fees or costs | "Request a proposal." | Any amount, range, "from" price or official fee figure |

**Banned vocabulary** (enforced by a CI word check): unlock, empower, seamless, leverage, cutting-edge, robust, holistic, "in today's fast-paced world", journey, elevate (except in the tagline), and the legal terms in section 5.

**Mechanics:** British/Nigerian spelling (organisation, programme, licence, enquiry); dates as "3 November 2026"; phone as "+234 906 403 5713"; sentence-case buttons that start with a verb; one triplet line per page at most; no emoji.

**Regulatory statements** link the official source and carry a "last reviewed" date. Facts that sources currently disagree on, such as the small-company tax threshold, are presented as "confirm with the Nigeria Revenue Service (NRS)" with both sources cited.

## 10. Metrics plan

Success means more of the right visitors reaching a Discovery Call or a partnership conversation, on mobile as much as on desktop. Everything is measured in PostHog (EU, project 310194) with consent, through a reverse proxy at `/ingest`.

| Measure | v1 baseline (30 days to 3 Nov 2026) | 30 days after launch | Source |
|---|---|---|---|
| Pages per mobile visitor | 1.0 | 2.0 or more | PostHog web analytics |
| Bounce rate | 42% | Under 35% | PostHog web analytics |
| Organic search share of visitors | 2 of 24 | Rising month on month; Search Console set up at launch | PostHog, Search Console |
| Home LCP (p75) | 2.75 s | Under 2.0 s | PostHog web vitals, Lighthouse |
| INP / CLS (p75) | Not reported | Under 200 ms / under 0.05 | PostHog web vitals |
| Booking clicks plus form submissions | Not tracked consistently | Tracked per page, audience and service | Events below |

**Events**, each carrying `service_id` and `audience`: `cta_click`, `booking_click`, `form_step`, `form_submit`, `tool_complete`, `whatsapp_click`, `call_click`, `partnership_cta`, `post_submit_next_step`.

**Funnel:** landing → service, audience or partnership page → booking click or form submission.

**"Website v2" dashboard:** entry pages, channels, the funnel above, Core Web Vitals by template, mobile against desktop, and countries.

**Leads sheet:** UTM source, medium and campaign are stored with every submission in D1, and as columns in the "SCS PostHog Data Warehouse" leads sheet. The services sheet gets a `page_path` for each of the 47 services.

The PostHog dashboard is built in Phase 4, once the events exist.

## 11. Owner decisions needed before Phase 3

Answer these by comment or in chat. Items 1 to 6 unlock the design directions. Items 7 to 12 are needed before the build.

- 1. Approve or edit the positioning line and home H1 (section 2).
- 2. Confirm the official values list. Is it the operating principles in the brief, or the current "Why SCS" list (Multidisciplinary, Business-Centric, Technology-Enabled, Integrated, Scalable, Practical, Continuous)?
- 3. Approve the merged service list and the held-back list (section 4).
- 4. Approve the legal-rule changes list (section 5), including the exact FAQ answer.
- 5. Founder display: is it the name and role only, or with a credential line? Keep or drop the LinkedIn link?
- 6. Case studies: remove the law-chambers entry? Keep or drop the 3 entries without RC numbers? The brief says 16 case studies, but the repo has 23. Which are approved and consented?
- 7. Partner benefits beyond the Check-Up and Growth Report, and any plan names.
- 8. A definition and "as at" date for each proof figure (section 7).
- 9. The retention period for enquiries. Career applications stay at 6 months, as the Privacy Notice states.
- 10. GitHub push access to `scs-create/service-page`. Settled: the build runs in your Claude Code session, which has GitHub access. This planning session stays read-only.
- 11. Cloudflare access (an API token scoped to Workers, D1, R2, Turnstile and DNS for the domain), Resend access, and the Google Workspace accounts that may view submissions. Set up step by step, with guidance, in the Claude Code build session.
- 12. The Nigerian lawyer who will review the Privacy, Cookie and Terms pages.

Leadership bios, photos and testimonials can come later. Until approved, the site shows names, roles and focus areas only, and no testimonials.
