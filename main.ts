import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { parseArgs } from "@std/cli";
import { createSearchDocs } from "./tools/search-docs.ts";
import { createRetrieveDocs } from "./tools/retrieve-docs.ts";
import { createRetrieveDoc } from "./tools/retrieve-doc.ts";
import { createSearchLibrary } from "./tools/search-library.ts";

// Parse command line arguments
const parsedArgs = parseArgs(Deno.args, {
  string: ["openai-api-key", "openai-vector-store-id"],
  boolean: ["help", "h"],
  alias: {
    "openai-api-key": ["k", "key"],
    "openai-vector-store-id": ["v", "vector", "store"],
    "help": ["h"],
  },
  default: {
    "openai-api-key": "",
    "openai-vector-store-id": "",
    "help": false,
  },
});

// Show help if requested
if (parsedArgs.help) {
  console.log(`
Revit API Docs MCP Server

Usage: Rvt_Docs_MCP-<os-build> [options]
  <os-build> is the operating system build of the machine running the server.
  For example, on Windows, the os-build is "windows".
  On older Mac machines, the os-build is "macos-x64".
  On Mac Silicon machines, the os-build is "macos-arm64".
  
  The builds above are available on *github releases*. 
  You can also build from source using \`deno task compile\`.
  In this case the executable does not include the os-build in the name.

Options:
  --openai-api-key, -k, --key <key>        OpenAI API key
  --openai-vector-store-id, -v, --vector, --store <id>  OpenAI vector store ID
  --help, -h                               Show this help message

Examples:
  Rvt_Docs_MCP-<os-build> --openai-api-key "sk-..." --openai-vector-store-id "vs_..."
  Rvt_Docs_MCP-<os-build> -k "sk-..." -v "vs_..."

Note: If not provided via CLI, these values will be read from environment variables.
Note: If either -k/--openai-api-key or -v/--openai-vector-store-id are not available, the search-library tool will not be available.
Note: Before adding a command (examples below) to your MCP config, you should first run the full comand with flags to verify that it works.

JSON Integration Examples:
\`\`\`json
  {
    "mcpServers": {
      "revit-api-docs (macos-arm64)": {
        "command": "path/to/Rvt_Docs_MCP-macos-arm64 -k sk-... -v vs_..."
      },
      "revit-api-docs (macos-x64)": {
        "command": "path/to/Rvt_Docs_MCP-macos-x64 -k sk-... -v vs_..."
      },
      "revit-api-docs (windows)": {
        "command": "path\to\Rvt_Docs_MCP-windows.exe -k sk-... -v vs_..."
      }
    }
  }
\`\`\`
`);
  Deno.exit(0);
}

// Set environment variables from CLI arguments if provided
if (parsedArgs["openai-api-key"]) {
  Deno.env.set("OPENAI_API_KEY", parsedArgs["openai-api-key"]);
}

if (parsedArgs["openai-vector-store-id"]) {
  Deno.env.set("OPENAI_VECTOR_STORE_ID", parsedArgs["openai-vector-store-id"]);
}

// Start the server with stdio transport
async function main() {
  // Validate required environment variables
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  const vectorStoreId = Deno.env.get("OPENAI_VECTOR_STORE_ID");

  if (!apiKey) {
    console.warn(
      "Warning: OPENAI_API_KEY is required. Set it via --openai-api-key or environment variable. search-library tool will not be available.",
    );
  }

  if (!vectorStoreId) {
    console.warn(
      "Warning: OPENAI_VECTOR_STORE_ID is required. Set it via --openai-vector-store-id or environment variable. search-library tool will not be available.",
    );
  }
  // Create the MCP server for Revit API documentation
  const server = new McpServer({
    name: "revit-docs-mcp",
    version: "1.0.0",
  });
  // Register tools
  createSearchDocs(server);
  createRetrieveDocs(server);
  createRetrieveDoc(server);
  if (apiKey && vectorStoreId) createSearchLibrary(server);

  console.error("Starting Revit API Docs MCP Server...");
  console.error(`Using OpenAI API Key: ${apiKey?.substring(0, 8)}...`);
  console.error(`Using Vector Store ID: ${vectorStoreId}`);

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Revit API Docs MCP Server is running...");
}

main().catch((error) => {
  console.error("Server error:", error);
  Deno.exit(1);
});
