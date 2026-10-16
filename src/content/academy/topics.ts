// Training topics read from topics-cms.json (Decap-editable), validated at build time.
// They feed the Corporate College topic list and the training-request form.
import { loadJsonFile } from "@/lib/content";
import { topicsSchema } from "@/lib/schemas";

export const trainingTopics: string[] = loadJsonFile("src/content/academy/topics-cms.json", topicsSchema).topics;

// Structural (tied to form logic), not editorial content.
export const audienceTypes: string[] = ["Individual", "Company", "NGO", "Government Agency"];
