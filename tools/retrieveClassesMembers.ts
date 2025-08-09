import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchWrapper } from "../lib/searchWrapper.ts";
import { extractRvtDocsText } from "../lib/extractor.ts";
import { validators } from "../types/toolValidators.ts";

/**
 * Creates the search tool for the MCP server
 * @param server - The MCP server instance
 */
export function createRetrieveClassesMembersTool(server: McpServer) {
  server.tool(
    "retrieve-docs-classes-members",
    {
      query: validators.query,
      year: validators.year,
      maxResults: validators.maxResults,
    },
    async ({ query, year, maxResults }) => {
      const type = year >= 2025 ? "Class" : "Members";
      const searches = await searchWrapper(query, year, maxResults, [type]);
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
