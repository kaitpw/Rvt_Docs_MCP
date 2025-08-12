import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { openaiRag } from "../lib/openaiRag.ts";
import "@std/dotenv/load";
import { toolDescriptions, toolNames, toolTitles } from "../lib/toolsCommon.ts";

/**
 * Creates the OpenAI RAG tool for the MCP server
 * @param server - The MCP server instance
 */
export function createSearchLibrary(server: McpServer) {
  server.registerTool(
    toolNames.searchLibrary,
    {
      title: toolTitles.searchLibrary,
      description: toolDescriptions.searchLibrary,
      inputSchema: {
        queryString: z.string().describe("Search query string"),
        maxResults: z.number().min(1).max(50).optional().default(10).describe(
          "Maximum number of results (1-50)",
        ),
        scoreThreshold: z.number().min(0).max(1).optional().describe(
          "Minimum similarity score threshold (0.0 to 1.0)",
        ),
      },
    },
    async ({
      queryString,
      maxResults = 10,
      scoreThreshold,
    }) => {
      try {
        const apiKey = Deno.env.get("OPENAI_API_KEY");
        const vectorStoreId = Deno.env.get("OPENAI_VECTOR_STORE_ID");
        if (!apiKey || !vectorStoreId) {
          throw new Error(
            "OPENAI_API_KEY and OPENAI_VECTOR_STORE_ID must be set",
          );
        }
        // Search using OpenAI vector store
        const results = await openaiRag(
          apiKey,
          vectorStoreId,
          queryString,
          maxResults,
          scoreThreshold,
        );

        // Return the raw search results as JSON
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
            text: `Error searching OpenAI vector store: ${errorMessage}`,
          }],
        };
      }
    },
  );
}
