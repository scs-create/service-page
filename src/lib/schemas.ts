import { z } from "zod";

// Runtime schemas for every CMS-managed record (M-05). Used by src/lib/content.ts loaders.
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be lowercase-with-dashes");
const text = z.string().trim().min(1, "must not be empty");
const upload = z.string().startsWith("/", "must be a path starting with /");

export const CLUSTER_SLUGS = ["start-and-structure", "compliance-and-regulatory", "finance-and-tax", "people-and-operations", "technology-and-data", "growth-and-market-presence"] as const;

export const serviceSchema = z.object({
  slug, title: text, cluster: z.enum(CLUSTER_SLUGS), framingSentence: text, introLine: text,
  services: z.array(text).min(1, "needs at least one item"),
  supportingStatement: z.string().optional(), closingStatement: z.string().optional(),
});

export const portfolioSchema = z.object({
  order: z.number().int().positive(), slug, client: text,
  rc: z.string().regex(/^\d{5,9}$/, "RC number must be digits only (5 to 9 digits)"),
  sector: text,
  filter: z.enum(["healthcare-pharma", "real-estate", "tech-digital", "logistics-transport", "hospitality", "agribusiness", "non-profit", "manufacturing", "media-retail-professional"]),
  featured: z.boolean().optional(), headline: text, challenge: text,
  delivered: z.array(text).min(1), impact: text, serviceLines: z.array(text).min(1),
});

export const verificationSchema = z.object({
  slug, title: text, category: z.enum(["Certificate of Incorporation", "Regulatory Permit", "Client Acknowledgment Letter"]),
  client: z.string().optional(), image: upload, alt: z.string().min(3, "describe the image (min 3 characters)"),
  issued: z.string().optional(), issuingBody: z.string().optional(), badge: z.string().optional(),
});

export const topicsSchema = z.object({ topics: z.array(text).min(1) });
export const packageSchema = z.object({ id: z.string().regex(/^[A-Z]$/, "single capital letter"), name: text, audience: text, includes: text });
export const regulatorsSchema = z.object({ regulators: z.array(z.object({ code: text, name: text })).min(1) });
export const industrySchema = z.object({ slug, name: text, summary: text, needs: z.array(text).min(1), regulators: z.array(text).min(1), services: z.array(slug), note: z.string().optional() });
export const faqSchema = z.object({ order: z.number().int().positive(), question: text, answer: text });
export const ipSchema = z.object({
  slug, name: text, type: z.enum(["Trademark", "Patent", "Copyright"]), note: z.string().optional(),
  permission: z.boolean().default(false), // shown publicly ONLY when true
  status: text,
});
export const testimonialSchema = z.object({
  quote: text, name: text, role: z.string().optional(), organisation: z.string().optional(),
  consent: z.boolean().refine((v) => v === true, "a testimonial can only be published with the person's documented consent"),
});
export const programmeSchema = z.object({ order: z.number().int().positive(), title: text, problem: text, solution: text, services: z.array(slug).default([]) });
export const partnershipSchema = z.object({
  title: text, formerlyCalled: text, intro: text, checkupName: text, checkupDescription: text, reportName: text, visitorAssessmentNote: text, terms: text,
});

const option = z.object({ label: text, weights: z.record(z.string(), z.number()) });
const question = z.object({ id: slug, text, options: z.array(option).min(2) });
const outcome = z.object({ title: text, description: text, href: z.string().optional(), ctaLabel: z.string().optional() });
export const quizSchema = z.object({ title: text, intro: text, questions: z.array(question).min(2), outcomes: z.record(z.string(), outcome).default({}), topN: z.number().int().positive().default(1), disclaimer: z.string().optional() });

export const assessmentSchema = z.object({
  stages: z.array(z.object({ id: slug, label: text })).min(2),
  sizes: z.array(text).min(2),
  stagePriority: z.record(z.string(), z.array(z.string())),
  domains: z.array(z.object({ id: slug, label: text, question: text, serviceSlug: slug, related: z.array(slug), issue: text, action: text, how: text, help: text })).min(3),
});
const checkItem = z.object({ text, regulators: z.array(z.string()) });
export const checklistSchema = z.object({
  types: z.array(z.object({ id: slug, label: text, items: z.array(checkItem).min(1) })).min(1),
  sectors: z.array(z.object({ id: slug, label: text, items: z.array(checkItem) })),
  disclaimer: text,
});
export const calendarSchema = z.object({ intro: text, areas: z.array(z.object({ label: text, regulators: z.array(z.string()), note: text })).min(1), disclaimer: text });
