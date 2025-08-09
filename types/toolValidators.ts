import { z } from "zod";
import { SearchResultTypes } from "./index.ts";
export const validators = {
  urlSlug: z
    .string()
    .describe("URL of the Revit API documentation page to extract"),
  queryString: z
    .string()
    .refine(
      (val) => {
        const trimmed = val.trim();
        const base = "[a-zA-Z][a-zA-Z0-9_]*";
        const simpleStringPattern = new RegExp(`^${base}$`);
        const classMemberPattern = new RegExp(
          `^${base}\\.${base}$`,
        );
        const constructorPattern = new RegExp(
          `^${base}\\(${base}(?:,\\s${base})*\\)$`,
        );

        return simpleStringPattern.test(trimmed) ||
          classMemberPattern.test(trimmed) ||
          constructorPattern.test(trimmed);
      },
      `Queries must look like "str", "str.str", or "str(str, ...)". Queries can only have single spaces and only after commas.`,
    )
    .describe(
      "Search query for a Revit API entity based mostly on substring matching.",
    ),
  queryTypes: z.array(z.enum(SearchResultTypes)).optional().default([
    ...SearchResultTypes,
  ])
    .describe(
      `Types of results to return, one of ${SearchResultTypes.join(", ")}`,
    ),
  year: z.number().min(2023).max(2026).default(2025)
    .describe("Year version of the Revit API documentation set to search"),
  maxResults: z.number().min(1).max(50).optional().default(10)
    .describe("Maximum number of results to return, default is 10"),
};
