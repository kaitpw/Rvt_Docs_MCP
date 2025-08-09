import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { searchWrapper } from "../lib/search.ts";
import { validators } from "../types/toolValidators.ts";

/**
 * Creates the search tool for the MCP server
 * @param server - The MCP server instance
 */
export function createSearchTool(server: McpServer) {
  server.registerTool(
    "search-docs",
    {
      title: "Search All Revit API Documentation Entities",
      description:
        "Search for a Revit API entity based mostly on substring matching. Can accept '<Class>.<Member>' search format for 2025 and 2026.",
      inputSchema: {
        queryString: validators.queryString,
        queryTypes: validators.queryTypes,
        year: validators.year,
        maxResults: validators.maxResults,
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
