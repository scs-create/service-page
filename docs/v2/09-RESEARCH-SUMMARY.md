# SCS Website 2.0 research: summary for the build

> Source: "SCS Website 2.0 Research Report: Competitors, Peers, Official Facts, Search Demand and Technical Stack
> (as of 2 November 2026)", produced in the planning chat (https://claude.ai/share/fa72c333-c7cd-4d94-8ce7-589c3cd97b4b).
> The shared view shows only the report's opening (summary and key findings), so this file holds that part. The full
> report, if needed, has to be exported from the planning project.
>
> **Internal reference only.** The owner ruled after this report (3 November 2026) that the site shows **no fees or
> cost values** (including government fees), **no delivery timelines**, and nothing that ties SCS to legal work, and
> that the Big Four are a standard to grow towards, not competitors. Where the report suggests publishing fees or
> timelines, those rulings override it (02-DECISIONS.md).

## How the findings are used in v2

| Finding | Where the build uses it |
|---|---|
| The Big Four Nigeria sites are organised by industry and service line and give a first-time founder no "what do I do first" path. | Home "Start here" rows and the Clients audience pages (PR 4); the Service Finder as the main way into the 66 services (PR 3). |
| Their trust signals are worth matching: named people, a governance/standards page, a visible proposal route. | "Request a proposal" in the header (PR 2, done); About and Our standards (PR 4); registration record and Verification on Home (PR 4). |
| Nigerian peer sites are crowded, keyword-stuffed and often out of date; many are law firms, which SCS must not imitate. | Tone guide (08-STRATEGY-AND-CONTENT-MODEL.md §9); CI legal-word report (PR 1, done). |
| Official rules changed in 2025–2026; being current is a differentiator. | Corporate School guides and topic hubs carry "last reviewed" dates and official sources with retrieval dates (PR 6). |
| The internal playbook calls SCS a "Law Firm" and uses "Legal Retainership". | Never copied into copy, metadata or sales material; the Partnership page uses "SCS Partnership" / "retainership plan" (PR 4). |
| Cloudflare free tiers fit SME volume; the native email binding only reaches verified addresses, so client-facing mail needs Resend. | Platform (PR 1, done); forms with Resend for client emails (PR 5). |

## Official facts to state carefully (with a "last reviewed" date and the official source)

These are the facts the report found unstable or recently changed. Guides state them with a source link and a "last
reviewed" date, and, where sources disagree, say "confirm with the regulator" and cite both. **No fee amounts.**

- The **Nigeria Revenue Service (NRS)** replaced FIRS.
- The unified **13-digit Tax ID** portal went live on 1 January 2026.
- NRS's **Rev360** replaced TaxPro Max in 2026; sources disagree on the date (30 April or 10 June 2026), so verify on nrs.gov.ng before stating one.
- The NDPC's **General Application and Implementation Directive (GAID)** took effect on 19 September 2025.
- The CAC published a new schedule on 29 May 2025. Fees are not published on the site; guides say that fees are confirmed in the proposal.
- Disputed, so present with both sources and "confirm with the regulator": the small-company tax threshold (Nigeria Tax Act 2025 vs the June 2026 transition guidance); the minimum share capital for companies with foreign participation (a Ministry of Interior Business Permit rule; CAC enforcement at incorporation is disputed); the NDPC Compliance Audit Return deadline (31 March by default; the 2025 returns were extended to 30 May 2026).

## Not yet checked in the report

The Big Four sites' speed and accessibility, the international example sites, and some technical limits. The v2 QA
PR measures our own pages against the targets in 06-TECH-SPEC.md instead.
