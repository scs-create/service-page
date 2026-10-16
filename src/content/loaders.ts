// Loaders for the CMS collections added in this release (all schema-validated at build time).
import { loadJsonDir, loadJsonFile } from "@/lib/content";
import {
  assessmentSchema, calendarSchema, checklistSchema, faqSchema, industrySchema, ipSchema, packageSchema,
  partnershipSchema, programmeSchema, quizSchema, regulatorsSchema, testimonialSchema,
} from "@/lib/schemas";

export const regulators = loadJsonFile("src/content/regulators.json", regulatorsSchema).regulators;
export const regulatorName = (code: string) => regulators.find((r) => r.code === code)?.name ?? code;

export const SUPPORT_PACKAGES = loadJsonDir("src/content/packages/entries", packageSchema).sort((a, b) => a.id.localeCompare(b.id));
export const industries = loadJsonDir("src/content/industries/entries", industrySchema).sort((a, b) => a.name.localeCompare(b.name));
export const faqs = loadJsonDir("src/content/faqs/entries", faqSchema).sort((a, b) => a.order - b.order);
export const ipAll = loadJsonDir("src/content/ip/entries", ipSchema);
export const ipVisible = ipAll.filter((i) => i.permission); // nothing public until the client confirms permission
export const testimonials = loadJsonDir("src/content/testimonials/entries", testimonialSchema);
export const programmes = loadJsonDir("src/content/programmes/entries", programmeSchema).sort((a, b) => a.order - b.order);
export const partnership = loadJsonFile("src/content/partnership.json", partnershipSchema);

export const assessment = loadJsonFile("src/content/tools/assessment.json", assessmentSchema);
export const checklist = loadJsonFile("src/content/tools/checklist.json", checklistSchema);
export const calendar = loadJsonFile("src/content/tools/calendar.json", calendarSchema);
export const structureQuiz = loadJsonFile("src/content/tools/structure.json", quizSchema);
export const finderQuiz = loadJsonFile("src/content/tools/finder.json", quizSchema);
