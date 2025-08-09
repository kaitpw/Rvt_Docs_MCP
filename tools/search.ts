import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { SearchResponse, SearchResult } from "../types/index.ts";

/**
 * Creates the search tool for the MCP server
 * @param server - The MCP server instance
 */
export function createSearchTool(server: McpServer) {
  server.tool(
    "search-revit-api",
    {
      query: z.string().describe("Search query for Revit API documentation"),
    },
    async ({ query }) => {
      try {
        // Search for the query
        const results = await searchWrapper(query);

        // Convert results to string format
        const resultsText = results.length > 0
          ? results.map((result) =>
            `${
              getTypeIcon(result.type)
            } **${result.title}**\n${result.description}\nURL: ${result.url}`
          ).join("\n\n")
          : "No results found";

        return {
          content: [{
            type: "text",
            text: resultsText,
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

/**
 * Searches Revit API documentation using the official search endpoint
 * @param query - The search query
 * @returns Promise<SearchResult[]> - Array of search results
 */
export async function searchWrapper(
  query: string,
): Promise<SearchResult[]> {
  try {
    // Construct the search URL with current timestamp
    const timestamp = Date.now();
    const searchUrl = `https://ac.cnstrc.com/autocomplete/${
      encodeURIComponent(query)
    }?query=${
      encodeURIComponent(query)
    }&autocomplete_key=key_yyAC1mb0cTgZTwSo&c=ciojs-2.1233.4&num_results=30&i=d705c917-8e5a-491f-8bc4-9b43e78de48c&s=10&_dt=${timestamp}`;

    // Make the search request
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(
        `Search request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json() as SearchResponse;
    const results: SearchResult[] = [];

    if (data.sections?.Products) {
      for (const item of data.sections.Products) {
        results.push({
          title: item.value,
          description: item.data.description ?? "",
          url: item.data.url,
          id: item.data.id,
          type: item.data.image_url
            ? getTypeFromImageUrl(item.data.image_url)
            : "Unknown",
          matchedTerms: item.matched_terms ?? [],
        });
      }
    }

    console.log(`Found ${results.length} results for query: ${query}`);
    return results;
  } catch (error) {
    console.error("Error searching Revit API docs:", error);
    throw error;
  }
}

/**
 * Extracts type information from the image URL
 * @param imageUrl - The image URL from the search result
 * @returns string - The type of the item
 */
function getTypeFromImageUrl(imageUrl: string): string {
  if (imageUrl.includes("Class.gif")) return "Class";
  if (imageUrl.includes("Constructor.gif")) return "Constructor";
  if (imageUrl.includes("Method.gif")) return "Method";
  if (imageUrl.includes("Property.gif")) return "Property";
  if (imageUrl.includes("Properties.gif")) return "Properties";
  if (imageUrl.includes("Members.gif")) return "Members";
  if (imageUrl.includes("Interface.gif")) return "Interface";
  if (imageUrl.includes("Enum.gif")) return "Enum";
  if (imageUrl.includes("Struct.gif")) return "Struct";
  if (imageUrl.includes("Delegate.gif")) return "Delegate";
  return "Unknown";
}

/**
 * Gets an icon for the type
 * @param type - The type of the item
 * @returns string - An icon representation
 */
export function getTypeIcon(type: string): string {
  switch (type) {
    case "Class":
      return "🏗️";
    case "Constructor":
      return "🔨";
    case "Method":
      return "⚙️";
    case "Property":
      return "📋";
    case "Properties":
      return "📋";
    case "Members":
      return "👥";
    case "Interface":
      return "🔌";
    case "Enum":
      return "📊";
    case "Struct":
      return "🏛️";
    case "Delegate":
      return "📞";
    default:
      return "📄";
  }
}
