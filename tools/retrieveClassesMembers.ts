import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchWrapper } from "../lib/search.ts";
import { extractRvtDocsText } from "../lib/extractor.ts";
import { validators } from "../types/toolValidators.ts";

/**
 * Creates the search tool for the MCP server
 * @param server - The MCP server instance
 */
export function createRetrieveClassesMembersTool(server: McpServer) {
  server.registerTool(
    "retrieve-docs-classes-members",
    {
      title: "Retrieve Class Members",
      description:
        `Retrieve the Revit API documentation page detailing all of a class's members based on a search query and year. 
        In the case of multiple search matches, multiple results will be returned. 
        Documentation years below 2025 will return a dedicated "Members" page while 2025 and above will return a "Class" page.
        Use this tool to perform high-level exploration of the Revit API. 
        Then perform more granular searches using the "search-docs" tool as needed.`,
      inputSchema: {
        queryString: validators.queryString,
        year: validators.year,
        maxResults: validators.maxResults,
      },
    },
    async ({ queryString, year, maxResults }) => {
      const type = year >= 2025 ? "Class" : "Members";
      const searches = await searchWrapper(queryString, year, maxResults, [
        type,
      ]);
      const results = [];
      for (const s of searches) {
        const fullUrl = s.url.startsWith("/")
          ? `https://rvtdocs.com${s.url}`
          : `https://rvtdocs.com/${s.url}`;

        try {
          results.push({
            text: await extractRvtDocsText(fullUrl),
          });
        } catch (error) {
          const errorMessage = error instanceof Error
            ? error.message
            : "Unknown error occurred";
          return {
            content: [{
              type: "text",
              text: `Error searching Revit API documentation: ${errorMessage}`,
            }],
          };
        }
      }
      return {
        content: [{
          type: "text",
          text: JSON.stringify(results, null, 2),
        }],
      };
    },
  );
}
