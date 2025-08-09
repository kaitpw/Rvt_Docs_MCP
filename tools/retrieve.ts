import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { extractRvtDocsText } from "../lib/extractor.ts";

/**
 * Creates the retrieve documentation tool for the MCP server
 * @param server - The MCP server instance
 */
export function createRetrieveTool(server: McpServer) {
  server.tool(
    "retrieve-revit-docs",
    {
      url: z.string().describe(
        "URL of the Revit API documentation page to extract",
      ),
      year: z.number().min(2023).max(2026).describe(
        "Year version of the Revit API documentation page to extract",
      ),
    },
    async ({ url, year }) => {
      try {
        console.log(`Extracting docs for: ${url}`);
        const fullUrl = `https://rvtdocs.com/${year}/${url}`;

        // Extract the documentation
        const markdown = await extractRvtDocsText(fullUrl);

        return {
          content: [{
            type: "text",
            text: markdown,
          }],
        };
      } catch (error) {
        const errorMessage = error instanceof Error
          ? error.message
          : "Unknown error occurred";
        return {
          content: [{
            type: "text",
            text: `Error extracting documentation from ${url}: ${errorMessage}`,
          }],
        };
      }
    },
  );
}
