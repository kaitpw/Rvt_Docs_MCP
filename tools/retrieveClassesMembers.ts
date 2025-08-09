import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchWrapper } from "../lib/search.ts";
import { extractRvtDocsText } from "../lib/extractor.ts";
import { descriptions, validators } from "../lib/toolsCommon.ts";

/**
 * Creates the search tool for the MCP server
 * @param server - The MCP server instance
 */
export function createRetrieveClassesMembersTool(server: McpServer) {
  server.registerTool(
    "retrieve-docs-classes-members",
    {
      title: "Retrieve Class Members",
      description: descriptions.retrieveClassesMembers,
      inputSchema: {
        queryString: validators.queryString,
        year: validators.year,
        maxResults: validators.maxResults,
      },
    },
    async ({ queryString, year, maxResults }) => {
      const types = ["Methods", "Properties"] as const;
      const searches = await searchWrapper(
        queryString,
        year,
        maxResults,
        types,
      );
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
