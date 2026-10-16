import { LeadershipProfile } from "@/lib/types";

// Names, titles, credentials and focus areas are from the SCS Work Portfolio 2026
// and the verified LinkedIn profiles supplied by the client. No biographies are
// invented: add a short bio field here once the founders approve wording.
export const leadership: LeadershipProfile[] = [
  {
    slug: "stephen-onyekeja",
    name: "Stephen Onyekeja, Esq.",
    role: "Chairman / Founder",
    initials: "SO",
    credentials: "LL.B., BL, ACArb, CDPO, ACA (in view)",
    focus: [
      "Corporate structuring",
      "Corporate governance",
      "Legal & regulatory compliance",
      "Data protection",
    ],
    linkedin:
      "https://www.linkedin.com/in/stephen-onyekeja-ll-b-bl-acarb-cdpo-aca-in-view-965793221/",
  },
  {
    slug: "chinedum-chidalu-kelvin",
    name: "Dr. Chinedum Chidalu Kelvin",
    role: "Chief Executive Officer",
    initials: "CK",
    credentials: "",
    focus: [
      "Entrepreneurship",
      "Organisational strategy",
      "Data analysis",
      "AI governance",
      "Healthcare & biomedical innovation",
    ],
    linkedin: "https://www.linkedin.com/in/chidalu-kelvin-chinedum/",
  },
];
