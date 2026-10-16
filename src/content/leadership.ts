import { LeadershipProfile } from "@/lib/types";

// Names, titles, credentials and focus areas are from the SCS Work Portfolio 2026
// and the verified LinkedIn profiles supplied by the client. Photos supplied by the client
// (16 October 2026). No biographies exist: add a short bio field only once the founders approve wording.
// Never publish signatures anywhere on the site.
export const leadership: LeadershipProfile[] = [
  {
    slug: "stephen-onyekeja",
    name: "Stephen Onyekeja, Esq.",
    role: "Chairman / Founder",
    initials: "SO",
    photo: "/images/team/stephen-onyekeja.jpg",
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
    photo: "/images/team/chinedum-chidalu-kelvin.jpg",
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
