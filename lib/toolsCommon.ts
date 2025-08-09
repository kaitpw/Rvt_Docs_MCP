import { z } from "zod";
import { SearchResultTypes } from "../types/index.ts";

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

const searchToolSuggestion = `\n
To obtain an API entity's url slug to use with the "extract-doc" tool, use the "search-docs" tool.
`;

const searchRules = `\n
Searching is based on entity type and substring-match. 
Valid query strings must be of the following formats: unbroken string, class member ("Class.Member", for 2025+), or class constructor ("Constructor(arg1, ...)".
Valid query types are: ${SearchResultTypes.join(", ")}
`;

const versionDifferences = `\n 
Sometimes API and/or documentation structure changes between years so be open-minded in your searching.
For example, the "Class" type of page doesn't contain member information below 2025 ("Methods" and "Properties" pages do though).
However, in 2025 and above, the "Class" page contains all member information (in addition to "Methods" and "Properties" pages).
`;

export const descriptions = {
  search: `Search for a Revit API entity in the documentation. 
    Use this tool to perform high-level exploration of the API. 
    This tool reveals the description, namespace, entity type, and url slug for an API entity. 
    Search results can differ, an entity's title, description, and namespace may look 
    slightly different (or be empty) when compared to other search results.
    ${searchRules} ${versionDifferences}`,
  retrieveFirstResult:
    `Retrieve the Revit API documentation page matching the first search result. 
    Use this tool only if you are already confident in both the entity name and type
    ${searchToolSuggestion} ${searchRules} `,
  retrieveClassesMembers:
    `Retrieve the Revit API documentation pages detailing a class's members and properties.
    Use this tool to perform medium-level exploration of the API. 
    In the case of multiple search result matches multiple sets of "Methods" and "Properties" pages will be returned.
    ${searchToolSuggestion} ${searchRules} `,
  extract:
    `Extract the content of a singular Revit API documentation page based on a url slug pointing to version year and the page's ID.
    Use this only if you already know the entity's page's slug.
    ${searchToolSuggestion}`,
};
