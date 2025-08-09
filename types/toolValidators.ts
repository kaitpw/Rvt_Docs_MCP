import { z } from "zod";

export const validators = {
  urlSlug: z.string().describe(
    "URL of the Revit API documentation page to extract",
  ),
  query: z.string().describe(
    "Search query for a Revit API entity based mostly on substring matching. Can accept '<Class>.<Member>' search format for 2025 and 2026.",
  ),
  year: z.number().min(2023).max(2026).default(2025).describe(
    "Year version of the Revit API documentation set to search",
  ),
  maxResults: z.number().min(1).max(50).optional().default(10).describe(
    "Maximum number of results to return, default is 10",
  ),
};
