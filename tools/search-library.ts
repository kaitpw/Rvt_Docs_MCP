import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchVectorLibrary } from "../lib/searchVectorLibrary.ts";
import "@std/dotenv/load";
import {
  toolDescriptions,
  toolNames,
  toolTitles,
  toolValidators,
} from "../lib/toolsCommon.ts";

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
        queryString: z.string().describe("Semantic search query string."),
        maxResults: toolValidators.maxResults,
        rewriteQuery: z.boolean().optional().default(true).describe(
          "Rewrite the query to improve search results. In rare cases where search results are not as expected, this may be useful to disable.",
        ),
        scoreThreshold: z.number().min(0).max(1).optional().default(0.6)
          .describe(
            "Minimum similarity score between query and result. Lower values will return more, but less relevant, results.",
          ),
      },
    },
    async ({
      queryString,
      maxResults,
      scoreThreshold,
      rewriteQuery,
    }) => {
      try {
        const apiKey = Deno.env.get("OPENAI_API_KEY");
        const vectorStoreId = Deno.env.get("OPENAI_VECTOR_STORE_ID");
        if (!apiKey || !vectorStoreId) {
          throw new Error(
            "OPENAI_API_KEY and OPENAI_VECTOR_STORE_ID must be set",
          );
        }

        const results = await searchVectorLibrary(
          apiKey,
          vectorStoreId,
          queryString,
          maxResults,
          scoreThreshold,
          rewriteQuery,
        );

        return {
          content: [{
            type: "text",
            text: JSON.stringify(results.data, null, 2),
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
