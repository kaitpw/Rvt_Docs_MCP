import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createSearchTool } from "./tools/search.ts";
import { createRetrieveTool } from "./tools/retrieve.ts";

// Create the MCP server for Revit API documentation
const server = new McpServer({
  name: "revit-api-docs",
  version: "1.0.0",
});

// Register tools
createSearchTool(server);
createRetrieveTool(server);

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
