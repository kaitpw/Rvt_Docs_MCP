import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchWrapper } from "../lib/searchDocs.ts";
import {
  toolDescriptions,
  toolNames,
  toolTitles,
  toolValidators,
} from "../lib/toolsCommon.ts";

/**
 * Creates the search tool for the MCP server
 * @param server - The MCP server instance
 */
export function createSearchDocs(server: McpServer) {
  server.registerTool(
    toolNames.searchDocs,
    {
      title: toolTitles.searchDocs,
      description: toolDescriptions.searchDocs,
      inputSchema: {
        queryString: toolValidators.queryString,
        queryTypes: toolValidators.queryTypes,
        year: toolValidators.year,
        maxResults: toolValidators.maxResults,
      },
    },
    async ({ queryString, year, maxResults, queryTypes }) => {
      try {
        // Search for the query
        const results = await searchWrapper(
          queryString,
          year,
          maxResults,
          queryTypes,
        );

        // return json of the search results
        return {
          content: [{
            type: "text",
            text: JSON.stringify(results, null, 2),
          }],
        };
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
    },
  );
}
