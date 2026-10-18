import type { LeadershipProfile } from "@/lib/types";

// ABOUT PAGE CONTENT. src/app/about/page.tsx is a pure renderer: edit, reorder, hide or add sections HERE
// (use { type: "text", ... } for a new profile block) — no layout code needs to change.

export const ABOUT_INTRO =
  "Stephen Corporate Services Ltd (SCS) is a multidisciplinary corporate services, business support, consulting and advisory company providing integrated solutions to businesses, entrepreneurs, organisations, investors and institutions.";

export type AboutSection =
  | { type: "identity"; paragraphs: string[] }
  | { type: "leadership"; eyebrow: string; title: string; intro: string; network: { heading: string; paragraphs: string[] } }
  | { type: "vision-mission" }
  | { type: "process" }
  | { type: "journey" }
  | { type: "industries" }
  | { type: "text"; eyebrow?: string; title: string; paragraphs: string[] }
  | { type: "cta" };

export const JOURNEY_STAGES = [
  {
    label: "Start",
    steps: [
      "Business idea",
      "Business structuring",
      "Registration",
      "Tax & regulatory setup",
      "Brand & IP",
      "Contracts",
      "People",
      "Operations",
    ],
  },
  {
    label: "Build",
    steps: [
      "Accounting & finance",
      "Compliance",
      "Marketing",
      "Customer management",
      "Technology",
      "Data",
      "Human resources",
      "Business development",
    ],
  },
  {
    label: "Scale",
    steps: [
      "Strategy",
      "Investment",
      "Market expansion",
      "M&A",
      "Corporate restructuring",
      "Digital transformation",
      "Internationalisation",
    ],
  },
  {
    label: "Sustain",
    steps: [
      "Governance",
      "Risk management",
      "Compliance monitoring",
      "Performance management",
      "Operational optimisation",
      "Succession & continuity",
      "Long-term growth",
    ],
  },
];

export const INDUSTRIES = [
  "Financial Services & Fintech",
  "Technology & Digital Businesses",
  "Energy, Oil & Gas",
  "Power & Utilities",
  "Real Estate & Construction",
  "Manufacturing",
  "Healthcare & Pharmaceuticals",
  "Retail & Consumer Businesses",
  "Agriculture & Agribusiness",
  "Professional Services",
  "Media & Entertainment",
  "Nonprofits & Social Enterprises",
  "Education",
  "Government & Public Sector",
  "International Businesses",
  "Startups & Scale-ups",
  "Family Businesses",
  "SMEs and Growing Enterprises",
];

export const VISION = { heading: "Our Vision", paragraphs: [
  "To be a world-class partner empowering professionals and entrepreneurs through company formation, corporate governance, and digital transformation. We strive to build a global community of innovation and sustainable success by providing practical training, corporate services and business advisory institution, empowering businesses and organisations with the expertise, technology, systems and strategic support required to build enduring enterprises.",
  "We envision a business environment where entrepreneurs and organisations can access sophisticated corporate support without unnecessary complexity, fragmented service providers or inefficient processes."
] };
export const MISSION = { heading: "Our Mission", paragraphs: [
  "To provide integrated, practical and technology-enabled corporate services and advisory solutions that help businesses establish properly, operate efficiently, remain compliant, solve complex problems and achieve sustainable growth.",
  "We combine professional expertise, business intelligence, technology, operational discipline and client-focused service to become a trusted long-term partner throughout the business lifecycle."
] };

export const ABOUT_SECTIONS: AboutSection[] = [
  {
    type: "identity",
    paragraphs: [
      "From business formation and corporate structuring to regulatory compliance, tax, human resources, technology and growth advisory, SCS provides an integrated platform for businesses at every stage of their lifecycle.",
      "We exist because most businesses do not fail from a lack of ambition; they fail from a lack of structure. SCS builds that structure: the documents, the filings, the policies, the systems and the compliance posture that let a business function, scale and survive scrutiny.",
    ],
  },
  {
    type: "leadership",
    eyebrow: "Our team & network",
    title: "Led by Practitioners, Backed by Specialists",
    intro:
      "SCS is led by a core team with direct experience across corporate law, regulatory compliance and business administration, supported by a wider network of specialists engaged as each engagement requires.",
    network: {
      heading: "A specialist network model",
      paragraphs: [
        "Company secretarial practitioners, tax consultants, data protection advisors, chartered professionals and sector specialists are engaged as each engagement requires. This lets SCS scale specialist capability to match each client's sector and complexity, without the overhead or the delay of a traditional large-firm structure.",
        "Where specialist legal or regulated professional services are required, SCS partners with the relevant professionals and coordinates the work. SCS does not present itself as a law firm.",
      ],
    },
  },
  { type: "vision-mission" },
  { type: "process" },
  { type: "journey" },
  { type: "industries" },
  { type: "cta" },
];

export type { LeadershipProfile };
