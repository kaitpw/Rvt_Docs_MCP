import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createSearchTool } from "./tools/search.ts";
import { createRetrieveFirstResultTool } from "./tools/retrieveFirstResult.ts";
import { createRetrieveClassesMembersTool } from "./tools/retrieveClassesMembers.ts";
import { createExtractTool } from "./tools/extract.ts";

// Create the MCP server for Revit API documentation
const server = new McpServer({
  name: "revit-docs-mcp",
  version: "1.0.0",
});

// Register tools
createSearchTool(server);
createRetrieveFirstResultTool(server);
createRetrieveClassesMembersTool(server);
createExtractTool(server);

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
