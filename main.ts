import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createSearchDocs } from "./tools/search-docs.ts";
import { createRetrieveDocs } from "./tools/retrieve-docs.ts";
import { createRetrieveDoc } from "./tools/retrieve-doc.ts";
import { createSearchLibrary } from "./tools/search-library.ts";

// Create the MCP server for Revit API documentation
const server = new McpServer({
  name: "revit-docs-mcp",
  version: "1.0.0",
});

// Register tools
createSearchDocs(server);
createRetrieveDocs(server);
createRetrieveDoc(server);
createSearchLibrary(server);

// Start the server with stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Revit API Docs MCP Server is running...");
}

main().catch((error) => {
  console.error("Server error:", error);
  Deno.exit(1);
});
