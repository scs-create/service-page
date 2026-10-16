// Cookie categories (SCS Cookie Policy §3). Only categories with inUse:true appear in the banner,
// so no toggle ever controls something the site does not do. When a feature that needs a
// category is added (saved enquiry details, marketing pixels…), set inUse:true.
export const COOKIE_CATEGORIES = [
  {
    id: "necessary",
    label: "Strictly necessary",
    description: "Security, accessibility and remembering your cookie choice. The site cannot work safely without these, so they are always on.",
    required: true,
    inUse: true,
  },
  {
    id: "analytics",
    label: "Performance and analytics",
    description: "Counts visits and measures page performance using aggregated data (Plausible Analytics). Off until you accept.",
    required: false,
    inUse: true,
  },
  {
    id: "functional",
    label: "Functional",
    description: "Remembers choices such as language or saved enquiry details. Off until you accept.",
    required: false,
    inUse: false,
  },
  {
    id: "marketing",
    label: "Marketing and targeting",
    description: "Shows relevant service updates and campaign information. Off until you accept.",
    required: false,
    inUse: false,
  },
] as const;
