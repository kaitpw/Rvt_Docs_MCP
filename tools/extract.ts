import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { extractRvtDocsText } from "../lib/extractor.ts";
import { descriptions, validators } from "../lib/toolsCommon.ts";

/**
 * Creates the extract documentation tool for the MCP server
 * @param server - The MCP server instance
 */
export function createExtractTool(server: McpServer) {
  server.registerTool(
    "extract-doc",
    {
      title: "Extract Documentation Page",
      description: descriptions.extract,
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
