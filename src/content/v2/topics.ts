// Corporate School topic hubs (docs/v2/05-SITE-SPEC.md §1): company registration, post-incorporation filings, tax
// registration (NRS), data protection (NDPA), doing business in Nigeria, funding readiness. Copy approved by the owner
// approval. Facts follow 09-RESEARCH-SUMMARY.md: only settled points are stated, each regulator is linked to its
// official website, and there are no fees, fee figures or processing times.
export type Topic = {
  slug: string;
  name: string;
  intro: string;
  points: string[]; // what the topic covers, in plain terms
  sources: { title: string; url: string }[]; // official websites
  services: string[]; // v2 service IDs
  guides: string[]; // Corporate School post slugs
};

export const TOPICS_REVIEWED = "2026-11-03"; // when the hubs and their sources were last checked

export const TOPICS: Topic[] = [
  {
    slug: "company-registration",
    name: "Company registration",
    intro: "Registering a business name, a private company or an incorporated trustee with the Corporate Affairs Commission (CAC), Nigeria's company registry, and choosing the right one first.",
    points: [
      "The difference between a business name, a private limited company and an incorporated trustee",
      "Name availability and reservation",
      "The details you need for directors, shareholders, proprietors or trustees",
      "What you receive at registration, and what has to follow it",
    ],
    sources: [{ title: "Corporate Affairs Commission (CAC)", url: "https://www.cac.gov.ng" }],
    services: ["CS-01", "CS-02", "CS-03"],
    guides: [],
  },
  {
    slug: "post-incorporation-filings",
    name: "Post-incorporation filings",
    intro: "What a registered company must keep and file after incorporation: annual returns, changes to directors, shareholders and addresses, persons with significant control, and the registers behind them.",
    points: [
      "Annual returns and the records they rely on",
      "Notifying the CAC of changes to directors, shareholders, addresses and share capital",
      "Persons with significant control (PSC) reporting",
      "Statutory registers, minutes and resolutions kept in one place",
    ],
    sources: [{ title: "Corporate Affairs Commission (CAC)", url: "https://www.cac.gov.ng" }],
    services: ["CR-01", "CR-02", "CS-04", "CR-05"],
    guides: ["navigating-cac-corporate-filings"],
  },
  {
    slug: "tax-registration",
    name: "Tax registration (NRS)",
    intro: "Registering for tax and keeping recurring returns in order with the Nigeria Revenue Service (NRS), which replaced the Federal Inland Revenue Service (FIRS), and with state revenue services.",
    points: [
      "Getting a Tax ID for the business",
      "Which recurring returns may apply, such as VAT, PAYE and withholding tax",
      "Keeping the records that support each return",
      "Where rules have changed recently, confirming the current position with the NRS before acting",
    ],
    sources: [{ title: "Nigeria Revenue Service (NRS)", url: "https://www.nrs.gov.ng" }],
    services: ["CR-03", "FA-11", "FA-01", "FA-02"],
    guides: ["commercial-tracking-vs-statutory-accounting"],
  },
  {
    slug: "data-protection",
    name: "Data protection (NDPA)",
    intro: "Meeting the Nigeria Data Protection Act 2023 (NDPA) and the Nigeria Data Protection Commission's (NDPC) requirements: knowing what personal data you hold, why, and how it is protected.",
    points: [
      "A record of the personal data you collect and use",
      "Privacy notices and internal data protection policies",
      "Handling requests from the people whose data you hold",
      "Any filings the NDPC requires of your organisation, confirmed with the NDPC",
    ],
    sources: [{ title: "Nigeria Data Protection Commission (NDPC)", url: "https://ndpc.gov.ng" }],
    services: ["CR-06", "TD-05"],
    guides: [],
  },
  {
    slug: "doing-business-in-nigeria",
    name: "Doing business in Nigeria",
    intro: "For foreign companies, investors and diaspora founders: the usual sequence for setting up and operating a company in Nigeria, and which agencies are involved at each step.",
    points: [
      "Company registration with the CAC",
      "The registrations and permits that commonly follow for foreign-owned companies, confirmed for your plan",
      "Tax registration with the NRS",
      "Working remotely with a coordinator in Nigeria, on West Africa Time (UTC+1)",
    ],
    sources: [
      { title: "Corporate Affairs Commission (CAC)", url: "https://www.cac.gov.ng" },
      { title: "Nigerian Investment Promotion Commission (NIPC)", url: "https://nipc.gov.ng" },
      { title: "Nigeria Revenue Service (NRS)", url: "https://www.nrs.gov.ng" },
    ],
    services: ["CS-03", "SA-05", "CR-04", "CR-08"],
    guides: [],
  },
  {
    slug: "funding-readiness",
    name: "Funding readiness",
    intro: "Getting ready before you approach investors, lenders, grant-makers or buyers: records in order, a plan that adds up, and evidence behind every claim.",
    points: [
      "Corporate, financial and operating records organised before review",
      "A business plan and financial model with stated assumptions",
      "Grant, donor and tender submissions that meet each call's requirements",
      "Testing growth options with evidence before committing money",
    ],
    sources: [],
    services: ["FA-05", "FA-04", "FA-06", "FA-07"],
    guides: ["conducting-growth-assessments-and-market-research", "commercial-tracking-vs-statutory-accounting"],
  },
];

export const getTopic = (slug: string) => TOPICS.find((t) => t.slug === slug);
export const topicsForPost = (slug: string) => TOPICS.filter((t) => t.guides.includes(slug));
