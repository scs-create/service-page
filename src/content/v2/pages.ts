// v2 page copy shared by Home, Process, Partnership and the Clients pages. Sources: the approved Direction B designs
// (docs/v2/design/*.dc.html) and the Strategy and Content Model (docs/v2/08-STRATEGY-AND-CONTENT-MODEL.md §2, §3, §7,
// §8). Text written in the build (not in either source) was approved by the owner on 3 November 2026.
// No fees, no delivery timelines, nothing that ties SCS to legal work.

export const HOME_HERO = {
  eyebrow: "Corporate services and business support · Abuja, serving clients worldwide",
  title: "One accountable partner for setting up, running and growing your organisation, in Nigeria and across borders.",
  lead: "Company registration, compliance and filings, company secretarial work, documentation and growth projects. Every engagement is scoped in writing and reviewed by our management team before delivery.",
  note: "30 minutes, by video. We respond within 24 hours.",
};

// Proof figures with their approved definitions and no "as at" dates (owner decision 2).
export const FIGURES = [
  { value: "3,000+", label: "Business registrations guided through the CAC by our founding team" },
  { value: "1,800+", label: "Agreements processed for clients" },
  { value: "1,200+", label: "Client and administrative engagements" },
  { value: "10+", label: "Sectors actively served" },
];

// Drive "02 How Work Runs": the six steps (decisions log, 3 November 2026).
export const SIX_STEPS = [
  { title: "Enquiry", text: "Tell us what you need. We respond within 24 hours." },
  { title: "Understand the need", text: "A Discovery Call, or the Quarterly Business Check-Up for Partners." },
  { title: "Propose", text: "A written proposal: scope, deliverables and what is not included." },
  { title: "Agree", text: "Work starts only once the proposal is signed." },
  { title: "Deliver", text: "Vetted specialists do the work. A reviewer checks every deliverable first." },
  { title: "Hand over and close", text: "You accept in writing. Files are handed over and access removed." },
];

// Process page, "What we do and do not do" (strategy §2). Approved wording.
export const WE_DO = [
  "Start every engagement with a diagnosis of what you actually need",
  "Agree scope, deliverables, exclusions, milestones and acceptance in writing before work starts",
  "Assign vetted specialists, each with a named backup",
  "Have our management team review every deliverable before it is sent",
  "Commit to defined work and service levels, and keep them",
];
export const WE_DO_NOT = [
  "Promise outcomes we do not control, such as approvals, grants, investment or sales",
  "Start work, or add to it, without your written agreement",
  "Publish fees: every engagement is priced in its proposal",
  "Take on work we cannot deliver well. If we are not the right fit for a need, we will say so",
];

export const PARTNER_RECEIVES = [
  { title: "Quarterly Business Check-Up", text: "A structured review each quarter that names up to three priorities." },
  { title: "SCS Business Growth Report", text: "The findings and recommendations, written down for your board or team." },
  { title: "One coordinator", text: "A named person who knows your organisation and answers for every task." },
  { title: "Scoped projects", text: "Each new project agreed in writing before work starts, with a review before delivery." },
];

export const PARTNER_SUITS = [
  { title: "Growing companies", text: "Recurring filings, documentation and operations, handled in one place." },
  { title: "NGOs and institutions", text: "Governance records and donor-compliance support, year round." },
  { title: "Foreign-owned companies", text: "A coordinator on the ground in Nigeria, working in your time zone." },
  { title: "International firms", text: "A remote operations partner in Nigeria (see below)." },
];

export const FIT_WE_LOOK_FOR = ["A willingness to share the information a diagnosis needs", "A named contact on your side", "Work we can deliver well"];
export const FIT_YOU_CAN_EXPECT = [
  "A neutral diagnosis, even when the answer is to defer or decline",
  "Scope, deliverables and exclusions in writing",
  "Vetted specialists with a backup, and a review before delivery",
  "Service levels that are defined and kept",
];
export const PARTNERSHIP_AGREED = ["Discovery Call", "Diagnosis or Business Check-Up", "Tailored proposal", "Signed agreement", "Onboarding", "Quarterly review"];
export const REMOTE_OPS_SCOPE = ["Client intake", "Case and file administration", "Billing administration", "Research support", "Back-office and customer support"];

// Start here: 7 audiences plus the Service Finder (05-SITE-SPEC.md §3 H.3; links and wording from design/Main.dc.html).
export const START_HERE = [
  { href: "/clients/founders-and-smes", title: "I'm starting or formalising a business", text: "Choosing a structure, registration, first filings and tax registration." },
  { href: "/clients/growing-companies", title: "I want an ongoing business partner", text: "One coordinator for filings, documentation, operations and growth." },
  { href: "/clients/ngos-and-institutions", title: "I run a non-profit or institution", text: "NGO and foundation registration, governance and donor-compliance support." },
  { href: "/clients/doing-business-in-nigeria", title: "I'm entering Nigeria from abroad", text: "Setting up a Nigerian company, explained plainly and handled remotely." },
  { href: "/partnership/remote-operations", title: "I need a remote operations partner in Nigeria", text: "Client intake, file and billing administration, research and back-office support." },
  { href: "/corporate-college", title: "I want training for my team or myself", text: "Corporate College, and online courses at Stephen Corporate Academy (SCA)." },
  { href: "/career", title: "I want to work with SCS", text: "Join the expert network or apply for an open role." },
  { href: "/find-my-service", title: "Not sure? Use the Service Finder", text: "Three questions, then the services that fit." },
];

export type AudienceAction = "book" | "partnership" | "proposal";
export type Audience = {
  slug: string;
  name: string;
  title: string;
  lead: string;
  whoFor: string[];
  firstSteps: { title: string; text: string }[];
  services: string[]; // v2 service IDs
  caseStudy: string; // portfolio slug
  action: AudienceAction;
};

// Audience pages (strategy §3; template A in 05-SITE-SPEC.md §3). Copy approved by the owner.
export const AUDIENCES: Audience[] = [
  {
    slug: "founders-and-smes",
    name: "Founders and SMEs",
    title: "Starting or formalising a business in Nigeria.",
    lead: "From choosing the right structure to the first filings and tax registration, one coordinator takes you through each step and tells you what comes next.",
    whoFor: ["Founders turning an idea into a registered business", "Sole traders and partnerships moving to a limited company", "Small businesses that registered but never completed the follow-up filings"],
    firstSteps: [
      { title: "Choose the structure", text: "A business name or a limited company, decided against your plans, not by default." },
      { title: "Register with the CAC", text: "Name search, documents and filing with the Corporate Affairs Commission (CAC), Nigeria's company registry." },
      { title: "Register for tax", text: "Your Tax ID and the tax registrations your activities need." },
      { title: "Keep it in good standing", text: "A calendar of the annual returns and filings that follow registration." },
    ],
    services: ["CS-01", "CR-03", "CR-01", "FA-01", "FA-04", "TD-01"],
    caseStudy: "premier-pharmaceuticals-ltd",
    action: "book",
  },
  {
    slug: "growing-companies",
    name: "Growing companies",
    title: "An ongoing business partner for a growing company.",
    lead: "When filings, documentation, staff and operations multiply, one accountable coordinator keeps them in order, so your team can focus on the work that grows the business.",
    whoFor: ["Companies with recurring filings and documentation", "Owners spending too much time on administration", "Teams preparing for investment, new markets or new hires"],
    firstSteps: [
      { title: "A Business Check-Up", text: "A structured look at structure, compliance, operations and growth, with up to three priorities." },
      { title: "One calendar of obligations", text: "Every filing, renewal and deadline in one place, tracked for you." },
      { title: "Projects scoped in writing", text: "Each priority agreed as a project before work starts." },
    ],
    services: ["SA-01", "CS-04", "CR-05", "HO-02", "FA-03", "HO-01"],
    caseStudy: "kendy-global-logistics-ltd",
    action: "partnership",
  },
  {
    slug: "ngos-and-institutions",
    name: "NGOs and institutions",
    title: "Support for non-profits, foundations, schools and faith organisations.",
    lead: "Registration as incorporated trustees, governance records and the documentation donors and partners ask for, kept in order year round.",
    whoFor: ["Founders of NGOs, foundations and associations", "Schools and faith organisations formalising their structure", "Registered non-profits preparing for donor or partner reviews"],
    firstSteps: [
      { title: "Register as incorporated trustees", text: "A constitution and trustee structure that fit how you will actually run." },
      { title: "Set up governance records", text: "Trustee decisions, minutes and registers kept properly." },
      { title: "Be ready for funders", text: "The records and applications donors usually ask for." },
    ],
    services: ["CS-02", "CS-04", "CR-01", "FA-06", "CR-06", "MC-03"],
    caseStudy: "light-bearers-education-empowerment-foundation",
    action: "book",
  },
  {
    slug: "doing-business-in-nigeria",
    name: "Doing business in Nigeria",
    title: "Entering Nigeria from abroad, explained plainly and handled remotely.",
    lead: "For foreign companies, investors and diaspora founders: a clear set-up sequence, every step coordinated from Abuja, and updates on West Africa Time (UTC+1).",
    whoFor: ["Foreign companies opening a Nigerian company", "Investors and diaspora founders managing a business from abroad", "Foreign-owned companies that need a local coordinator after set-up"],
    firstSteps: [
      { title: "A set-up plan", text: "Each registration and permit in the order it is needed, written down before you commit." },
      { title: "Company registration", text: "Incorporation with the CAC, with documents signed and certified remotely where the rules allow." },
      { title: "The registrations that follow", text: "Tax and the other registrations your plan needs, coordinated by one person." },
    ],
    services: ["CS-03", "SA-05", "CR-03", "CR-04", "CR-08", "HO-02"],
    caseStudy: "fortuna-investment-ltd",
    action: "proposal",
  },
];

export const audience = (slug: string) => AUDIENCES.find((a) => a.slug === slug);

// Where "Start a partnership conversation" goes (design/Partnership.dc.html). The contact form pre-selects the topic.
export const PARTNERSHIP_CTA = "/contact?topic=partnership";
