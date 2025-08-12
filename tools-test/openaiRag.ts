import { openaiRag } from "../lib/openaiRag.ts";
import "@std/dotenv/load";

// Test configuration
const VECTOR_STORE_ID = Deno.env.get("OPENAI_VECTOR_STORE_ID");
const API_KEY = Deno.env.get("OPENAI_API_KEY");
const TEST_QUERY = "Visual Studio 2005";

async function testOpenAIRag() {
  try {
    if (!VECTOR_STORE_ID || !API_KEY) {
      throw new Error("OPENAI_VECTOR_STORE_ID and OPENAI_API_KEY must be set");
    }

    const searchResults = await openaiRag(
      API_KEY,
      VECTOR_STORE_ID,
      TEST_QUERY,
      // 5, // max 5 results
      // 0.5, // score threshold
      // true, // rewrite query
    );

    // Log the raw response that would be returned to an LLM
    console.log(`${"=".repeat(100)}`);
    console.log(JSON.stringify(searchResults, null, 2));

    console.log("\n✅ OpenAI RAG tool test completed successfully!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
  }
}

// Run the test if this file is executed directly
if (import.meta.main) {
  testOpenAIRag();
}
