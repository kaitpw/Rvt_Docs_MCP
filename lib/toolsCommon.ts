import { z } from "zod";
import { SearchResultTypes } from "../types/index.ts";

/**
 * Names for all tools.
 */
export const toolNames = {
  retrieveDoc: "retrieve-doc",
  retrieveDocs: "retrieve-docs",
  searchDocs: "search-docs",
  searchLibrary: "search-library",
};

/**
 * Titles for all tools.
 */
export const toolTitles = {
  retrieveDoc: "Get Single Revit API Documentation Page",
  retrieveDocs: "Get Multiple Revit API Documentation Pages",
  searchDocs: "Search Revit API Documentation",
  searchLibrary: "Search Revit API Learning Resources",
};

/**
 * Descriptions for all tools.
 */
export const toolDescriptions = {
  test: "Test tool",
  retrieveDoc:
    `Retrieves a single Revit API documentation page using its URL slug.

**Use when:** You already have the exact URL slug from a previous search and want the full documentation content.

**Notes:** You MUST first use the "${toolNames.searchDocs}" tool to get the URL slug. An incorrect slug will cause an error.`,
  retrieveDocs:
    `Retrieves full documentation content for multiple Revit API entities based on a search query.

**Use when:** You want to explore API entities and need their complete documentation content, not just search results.

**Notes:** Set maxResults to 1 if you only need the first result.`,
  searchDocs:
    `Searches Revit API documentation to find entities matching your query.

**Use when:** You need to discover API entities, understand their purpose, or find specific functionality.

**Returns:** Entity names, descriptions, namespaces, types, and URL slugs for further exploration.

**Notes:**
- API documentation varies between version years (2025+ includes member info in Class pages)
- Some entities may be deprecated between version years
- Search results may have slight variations in formatting`,
  searchLibrary:
    `Searches a comprehensive library of Revit API resources including The Building Coder blog posts, C# code examples, PDF resources, and practical guides.

**Use when:** You need practical examples, troubleshooting help, or want to learn how to use specific API features.

**Notes:** Results are from a vector store are chunked. If content is cut off, refine your query and search again.`,
};

/**
 * Reusable validators for the docs-related tools (not the openai-related tools).
 */
export const toolValidators = {
  urlSlug: z
    .string()
    .describe("URL slug of the Revit API documentation page to retrieve"),
  year: z.number().min(2023).max(2026).default(2025)
    .describe("Revit API documentation year version (2023-2026)"),
  maxResults: z.number().min(1).max(50).optional().default(10)
    .describe("Maximum number of search results to return"),
  queryTypes: z.array(z.enum(SearchResultTypes)).optional().default([
    ...SearchResultTypes,
  ])
    .describe(
      `Filter results by type: ${SearchResultTypes.join(", ")}`,
    ),
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
      `Must match one of: "AnyName", "Class.Member", or "Constructor(arg1, ...". Only single spaces allowed, and only after commas.`,
    )
    .describe(
      `Search query for Revit API entities. Valid formats: "AnyName", "Class.Member" (2025+ only), or "Constructor(arg1, ...". NOT a phrase, sentence, or natural language query.`,
    ),
};
