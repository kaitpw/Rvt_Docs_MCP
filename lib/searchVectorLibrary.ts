import OpenAI from "@openai/openai";

/**
 * Search OpenAI vector store using semantic similarity
 * @param apiKey - OpenAI API key
 * @param vectorStoreId - OpenAI vector store ID
 * @param queryString - Search query string
 * @param maxResults - Maximum number of results
 * @param scoreThreshold - Minimum similarity score threshold (0.0 to 1.0)
 * @param rewriteQuery - Whether to automatically rewrite the query for better results
 * @returns Promise with search results
 */
export async function searchVectorLibrary(
  apiKey: string,
  vectorStoreId: string,
  queryString: string,
  maxResults: number,
  scoreThreshold: number,
  rewriteQuery = true,
) {
  const client = new OpenAI({
    apiKey: apiKey,
  });

  const results = await client.vectorStores.search(vectorStoreId, {
    query: queryString,
    max_num_results: maxResults, // Ensure between 1 and 50
    ranking_options: {
      ranker: "auto",
      score_threshold: scoreThreshold,
    },
    rewrite_query: rewriteQuery,
  });

  // Return the results directly - they should have the proper type from the OpenAI SDK
  return results;
}
