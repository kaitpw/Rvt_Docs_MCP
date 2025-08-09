import type { z } from "zod";
import {
  type SearchResponseRevirApiDocsCom,
  type SearchResponseRvtDocsCom,
  type SearchResult,
  type SearchResultTypes,
  ZTypeFromImageUrl,
} from "../types/index.ts";

export async function searchWrapper(
  query: string,
  year: number,
  maxResults: number,
  types: Array<z.infer<typeof ZTypeFromImageUrl>> = [
    "Class",
    "Constructor",
    "Method",
    "Property",
    "Properties",
    "Members",
    "Interface",
    "Enum",
    "Unknown",
  ],
): Promise<SearchResult[]> {
  const results1 = await searchRvtDocsCom(query, year, maxResults * 2);
  const results2 = await searchRevitApiDocsCom(query, year, maxResults * 2);
  let results = Array.from(new Set([...results1, ...results2]));
  results = results.filter((r) => types.includes(r.type as SearchResultTypes));
  const typeOrder = ["Members", "Class", "Constructor", "Enum"];
  results.sort((a, b) => {
    const aIndex = typeOrder.indexOf(a.type);
    const bIndex = typeOrder.indexOf(b.type);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
  return results.slice(0, maxResults);
}

/**
 * Searches Revit API documentation using the rvtdocs.com search endpoint
 */
export async function searchRvtDocsCom(
  query: string,
  year: number,
  maxResults: number,
): Promise<SearchResult[]> {
  try {
    // Using the rvtdocs.com search API endpoint
    const searchUrl = "https://rvtdocs.com/search/api/search";

    const requestBody = {
      query: query,
      current_version: year.toString(),
      include_description: false,
    };

    // Make the search request
    const response = await fetch(searchUrl, {
      method: "POST",
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(
        `Search request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json() as SearchResponseRvtDocsCom;
    const results: SearchResult[] = [];

    // Parse the response based on the expected format
    if (
      data.current_version_results &&
      Array.isArray(data.current_version_results)
    ) {
      for (const item of data.current_version_results.slice(0, maxResults)) {
        results.push({
          title: item.title || "",
          description: (item.description || "").replace(
            /^Description:\s*/i,
            "",
          ),
          namespace: (item.namespace || "").replace(/^Namespace:\s*/i, ""),
          type: item.type || "",
          url: item.url || "",
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Error searching Revit API docs using rvtdocs.com:", error);
    throw error;
  }
}

/**
 * Searches Revit API documentation using the www.revitapidocs.com search endpoint
 */
export async function searchRevitApiDocsCom(
  query: string,
  year: number,
  maxResults: number,
): Promise<SearchResult[]> {
  try {
    // Construct the search URL with current timestamp
    const timestamp = Date.now();
    const searchUrl = `https://ac.cnstrc.com/autocomplete/${
      encodeURIComponent(query)
    }?query=${
      encodeURIComponent(query)
    }&autocomplete_key=key_yyAC1mb0cTgZTwSo&c=ciojs-2.1233.4&num_results=${maxResults}&i=d705c917-8e5a-491f-8bc4-9b43e78de48c&s=10&_dt=${timestamp}`;

    // Make the search request
    const response = await fetch(searchUrl);
    if (!response.ok) {
      throw new Error(
        `Search request failed: ${response.status} ${response.statusText}`,
      );
    }

    const data = await response.json() as SearchResponseRevirApiDocsCom;
    const results: SearchResult[] = [];

    if (data.sections?.Products) {
      for (const item of data.sections.Products) {
        results.push({
          title: item.value,
          description: item.data.description ?? "",
          url: `/${year}/${item.data.url.split(".")[0]}`,
          type: ZTypeFromImageUrl.parse(item.data.image_url),
        });
      }
    }

    return results;
  } catch (error) {
    console.error(
      "Error searching Revit API docs using revitapidocs.com:",
      error,
    );
    throw error;
  }
}
