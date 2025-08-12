import {
  type SearchResponseRevirApiDocsCom,
  type SearchResponseRvtDocsCom,
  type SearchResult,
  SearchResultTypes,
} from "../types/index.ts";
import { z } from "zod";

export async function searchWrapper(
  query: string,
  year: number,
  max: number,
  types: ReadonlyArray<(typeof SearchResultTypes)[number]> = SearchResultTypes,
): Promise<SearchResult[]> {
  const results1 = await searchRvtDocsCom(query, year, max * 2, types);
  const results2 = await searchRevitApiDocsCom(query, year, max * 2, types);

  const allResults = [...results1, ...results2];
  const dedupedResults = dedupeByUrl(allResults);
  const sortedResults = sortByType(dedupedResults);
  return sortedResults.slice(0, max);
}

function dedupeByUrl(results: SearchResult[]): SearchResult[] {
  const urlMap = new Map<string, SearchResult>();
  const countEmpty = (obj: SearchResult) =>
    Object.values(obj).filter((v) => v === "").length;

  for (const result of results) {
    const url = result.url;
    if (!urlMap.has(url)) {
      urlMap.set(url, result);
    } else {
      const existing = urlMap.get(url);
      if (existing && countEmpty(result) < countEmpty(existing)) {
        urlMap.set(url, result);
      }
    }
  }
  return Array.from(urlMap.values());
}

function sortByType(results: SearchResult[]): SearchResult[] {
  const typeOrder = [
    "Class",
    "Methods",
    "Properties",
    "Constructor",
  ];

  return results.sort((a, b) => {
    const aIndex = typeOrder.indexOf(a.type);
    const bIndex = typeOrder.indexOf(b.type);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

/**
 * Searches Revit API documentation using the rvtdocs.com search endpoint
 */
export async function searchRvtDocsCom(
  query: string,
  year: number,
  maxResults: number,
  types: ReadonlyArray<(typeof SearchResultTypes)[number]> = SearchResultTypes,
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

    return results.filter((r) =>
      types.includes(r.type as (typeof SearchResultTypes)[number])
    );
  } catch (error) {
    console.error("Error searching Revit API docs using rvtdocs.com:", error);
    throw error;
  }
}

/**
 * Searches Revit API documentation using the www.revitapidocs.com search endpoint
 * This is necessary to keep because it makes "Properties" and "Methods" pages available
 */
export async function searchRevitApiDocsCom(
  query: string,
  year: number,
  maxResults: number,
  types: ReadonlyArray<(typeof SearchResultTypes)[number]> = SearchResultTypes,
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
        if (TypeFromTitle.parse(item.value) !== "Members") {
          results.push({
            title: item.value,
            url: `/${year}/${item.data.url.split(".")[0]}`,
            type: TypeFromTitle.parse(item.value),
          });
        }
      }
    }

    return results.filter((r) =>
      types.includes(r.type as (typeof SearchResultTypes)[number])
    );
  } catch (error) {
    console.error(
      "Error searching Revit API docs using revitapidocs.com:",
      error,
    );
    throw error;
  }
}

const TypeFromTitle = z.string().transform((title) => {
  const parts = title.trim().split(/\s+/);
  const lastPart = parts[parts.length - 1];

  for (const t of [...SearchResultTypes, "Members"]) {
    if (lastPart === t) return t;
  }
  return "Unknown";
});
