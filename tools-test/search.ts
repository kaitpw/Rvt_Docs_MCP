import { searchWrapper } from "../lib/searchWrapper.ts";
import type { SearchResult } from "../types/index.ts";

async function testSearch() {
  try {
    console.log("Testing Revit API documentation search...");

    // Test search for "FilteredElementCollector"
    const query = "string";
    console.log(`Searching for: ${query}`);

    const results = await searchWrapper(query, 2023, 10);

    console.log("\n=== SEARCH RESULTS ===");
    console.log(`Found ${results.length} results:`);

    results.forEach((result: SearchResult, index: number) => {
      console.log(`\n${index + 1}. ${result.title} (${result.type})`);
      console.log(`   Description: ${result.description}`);
      console.log(`   Namespace: ${result.namespace}`);
      console.log(`   URL: ${result.url}`);
    });

    console.log("\n=== END SEARCH RESULTS ===");
  } catch (error) {
    console.error("Error during search:", error);
  }
}

// Run the test
testSearch();
