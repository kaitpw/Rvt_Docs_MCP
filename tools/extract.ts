import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { extractRvtDocsText } from "../lib/extractor.ts";
import { validators } from "../types/toolValidators.ts";

/**
 * Creates the extract documentation tool for the MCP server
 * @param server - The MCP server instance
 */
export function createExtractTool(server: McpServer) {
  server.registerTool(
    "extract-doc",
    {
      title: "Extract Documentation Page",
      description:
        `Extract the content of a singular Revit API documentation page based on a url slug pointing to version year and the page's ID.
        The resulting data will be a best-attempt markdown extraction of the page's html`,
      inputSchema: {
        urlSlug: validators.urlSlug,
      },
    },
    async ({ urlSlug }) => {
      const fullUrl = urlSlug.startsWith("/")
        ? `https://rvtdocs.com${urlSlug}`
        : `https://rvtdocs.com/${urlSlug}`;

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
