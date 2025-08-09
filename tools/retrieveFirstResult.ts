import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { extractRvtDocsText } from "../lib/extractor.ts";
import { searchWrapper } from "../lib/search.ts";
import { validators } from "../types/toolValidators.ts";

/**
 * Creates the retrieve documentation tool for the MCP server
 * @param server - The MCP server instance
 */
export function createRetrieveFirstResultTool(server: McpServer) {
  server.registerTool(
    "retrieve-docs-first-result",
    {
      title: "Retrieve First Result from Revit API Documentation",
      description:
        `Retrieve a Revit API documentation page matching the first search result based on the query and year.
        The resulting data will be a best-attempt markdown extraction of the page's html.
        Use this tool to retrieve the docs for a Revit API entity for which `,
      inputSchema: {
        queryString: validators.queryString,
        year: validators.year,
      },
    },
    async ({ queryString, year }) => {
      const search = await searchWrapper(queryString, year, 1);
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
