import { extractRvtDocsText } from "../lib/extractor.ts";

const testUrls = [
  "https://rvtdocs.com/2024/0530fbf2-5176-ffb5-0726-718023394de2",
  "https://rvtdocs.com/2024/e6742b6a-9c35-5344-736b-7bf9af6f4254",
  "https://rvtdocs.com/2024/1652ef5d-f6bb-2f50-57a4-69b5751ba671",
  "https://rvtdocs.com/2023/9550265f-5760-3c28-d023-d0373285855b",
  "https://rvtdocs.com/2026/263cf06b-98be-6f91-c4da-fb47d01688f3",
  "https://rvtdocs.com/2026/e6742b6a-9c35-5344-736b-7bf9af6f4254",
  "https://rvtdocs.com/2023/7b419d4b-2c3e-17f1-51e6-8b89980a065a",
];

async function testExtraction() {
  try {
    console.log(
      "Testing Revit API documentation extraction for multiple URLs...",
    );
    console.log(`Processing ${testUrls.length} URLs...\n`);

    let allMarkdown = "";
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < testUrls.length; i++) {
      const url = testUrls[i];
      console.log(`[${i + 1}/${testUrls.length}] Processing: ${url}`);

      try {
        const markdown = await extractRvtDocsText(url);

        if (allMarkdown) {
          allMarkdown += "\n\n---\n\n";
        }

        allMarkdown += markdown;
        successCount++;

        console.log(
          `✅ Successfully extracted (${markdown.length} characters)`,
        );
      } catch (error) {
        console.error(`❌ Failed to extract from ${url}:`, error);
        errorCount++;

        if (allMarkdown) {
          allMarkdown += "\n\n---\n\n";
        }
        allMarkdown += `# Error: Failed to extract from ${url}\n\nError: ${
          error instanceof Error ? error.message : "Unknown error"
        }`;
      }
    }

    console.log("\n=== EXTRACTION SUMMARY ===");
    console.log(`Total URLs processed: ${testUrls.length}`);
    console.log(`Successful extractions: ${successCount}`);
    console.log(`Failed extractions: ${errorCount}`);
    console.log(`Total markdown length: ${allMarkdown.length} characters`);

    await Deno.writeTextFile("extracted-docs-combined.md", allMarkdown);
    console.log(
      "\n📄 All extracted documentation saved to extracted-docs-combined.md",
    );
  } catch (error) {
    console.error("Error during extraction:", error);
  }
}

testExtraction();
