import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { extractRvtDocsText } from "../lib/extractor.ts";
import { searchWrapper } from "../lib/search.ts";
import { descriptions, validators } from "../lib/toolsCommon.ts";

/**
 * Creates the retrieve documentation tool for the MCP server
 * @param server - The MCP server instance
 */
export function createRetrieveFirstResultTool(server: McpServer) {
  server.registerTool(
    "retrieve-docs-first-result",
    {
      title: "Retrieve First Result from Revit API Documentation",
      description: descriptions.retrieveFirstResult,
      inputSchema: {
        queryString: validators.queryString,
        queryTypes: validators.queryTypes,
        year: validators.year,
      },
    },
    async ({ queryString, queryTypes, year }) => {
      const search = await searchWrapper(queryString, year, 1, queryTypes);
      const url = search[0].url;
      const fullUrl = url.startsWith("/")
        ? `https://rvtdocs.com${url}`
        : `https://rvtdocs.com/${url}`;

      try {
        return {
          content: [{
            type: "text" as const,
            text: await extractRvtDocsText(fullUrl),
          }],
        };
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error occurred";
        return {
          content: [{
            type: "text" as const,
            text:
              `Error extracting documentation from ${fullUrl}: ${errorMessage}`,
          }],
        };
      }
    },
  );
}
