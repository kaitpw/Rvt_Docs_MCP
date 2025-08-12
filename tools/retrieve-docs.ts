import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { extractRvtDocsText } from "../lib/extractDocs.ts";
import { searchWrapper } from "../lib/searchDocs.ts";
import {
  toolDescriptions,
  toolNames,
  toolTitles,
  toolValidators,
} from "../lib/toolsCommon.ts";

/**
 * Creates the retrieve documentation tool for the MCP server
 * @param server - The MCP server instance
 */
export function createRetrieveDocs(server: McpServer) {
  server.registerTool(
    toolNames.retrieveDocs,
    {
      title: toolTitles.retrieveDocs,
      description: toolDescriptions.retrieveDocs,
      inputSchema: {
        queryString: toolValidators.queryString,
        queryTypes: toolValidators.queryTypes,
        year: toolValidators.year,
        maxResults: toolValidators.maxResults,
      },
    },
    async ({ queryString, queryTypes, year, maxResults }) => {
      const searches = await searchWrapper(
        queryString,
        year,
        maxResults,
        queryTypes,
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
