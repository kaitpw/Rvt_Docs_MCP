import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { extractRvtDocsText } from "../lib/extractor.ts";
import { searchWrapper } from "../lib/searchWrapper.ts";
import { validators } from "../types/toolValidators.ts";

/**
 * Creates the retrieve documentation tool for the MCP server
 * @param server - The MCP server instance
 */
export function createRetrieveFirstResultTool(server: McpServer) {
  server.tool(
    "retrieve-docs-first-result",
    {
      query: validators.query,
      year: validators.year,
    },
    async ({ query, year }) => {
      const search = await searchWrapper(query, year, 1);
      const url = search[0].url;
      const fullUrl = url.startsWith("/")
        ? `https://rvtdocs.com${url}`
        : `https://rvtdocs.com/${url}`;

      try {
        return {
          content: [{
            type: "text",
            text: await extractRvtDocsText(fullUrl),
          }],
        };
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error occurred";
        return {
          content: [{
            type: "text",
            text:
              `Error extracting documentation from ${fullUrl}: ${errorMessage}`,
          }],
        };
      }
    },
  );
}
