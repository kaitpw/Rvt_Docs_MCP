import { z } from "zod";
import { SearchResultTypes } from "../types/index.ts";

export const toolNames = {
  retrieveDoc: "retrieve-doc",
  retrieveDocs: "retrieve-docs",
  searchDocs: "search-docs",
  searchLibrary: "search-library",
};

export const toolTitles = {
  retrieveDoc: "Retrieve Revit API Documentation Page",
  retrieveDocs: "Retrieve Revit API Documentation Pages",
  searchDocs: "Search Revit API Documentation",
  searchLibrary: "Search Revit Content Library",
};

const searchToolSuggestion = `\n
To obtain an API entity's url slug to use with the "${toolNames.retrieveDoc}" tool, use the "${toolNames.searchDocs}" tool.
`;

const versionDifferences = `\n
Sometimes API and/or documentation structure changes between years so be open-minded in your searching.
For example, the "Class" type of page doesn't contain member information below 2025 ("Methods" and "Properties" pages do though).
However, in 2025 and above, the "Class" page contains all member information (in addition to "Methods" and "Properties" pages).
`;

export const toolDescriptions = {
  retrieveDoc:
    `Retrieve a Revit API documentation *page* based on its *url slug*.
    Use this only if you already know the entity's page's slug.
    This is the most direct way to get the documentation for an entity, but an incorrect slug will error.
    ${searchToolSuggestion}`,
  retrieveDocs:
    `Retrieve the Revit API documentation *pages (or page)* matching a search query. 
    Use this tool to perform low-level exploration of the API. 
    
    Tips:
    - set maxResults to 1 to get the first result only.
    - set queryTypes to ["Methods", "Properties"] to get lists of class members
    ${searchToolSuggestion} `,
  searchDocs:
    `Search for a Revit API entity in the documentation based on queryString subtring matching and queryTypes. 
    Use this tool to perform high-level exploration of the API. 
    This tool reveals the description, namespace, entity type, and url slug for an API entity. 
    Search results can differ, an entity's title, description, and namespace may look 
    slightly different (or be empty) when compared to other search results.
    ${versionDifferences}`,
  searchLibrary: "Search the library content related to Revit and Revit API.",
};

export const toolValidators = {
  urlSlug: z
    .string()
    .describe("URL of the Revit API documentation page to extract"),
  year: z.number().min(2023).max(2026).default(2025)
    .describe("Year version of the Revit API documentation set to search"),
  maxResults: z.number().min(1).max(50).optional().default(10)
    .describe("Maximum number of search results to return."),
  queryTypes: z.array(z.enum(SearchResultTypes)).optional().default([
    ...SearchResultTypes,
  ])
    .describe(
      `Types of results to return, one of ${SearchResultTypes.join(", ")}`,
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
      `Must match one of: "Name", "Class.Member" (2025+), or "Constructor(arg1, ...)". Only single spaces allowed, and only after commas.`,
    )
    .describe(
      `Search query for a Revit API entity.
      Valid formats:
      - Unbroken string: "Name"
      - Class member: "Class.Member" (2025+)
      - Constructor: "Constructor(arg1, ...)"
      Only single spaces allowed, and only after commas.`,
    ),
};
