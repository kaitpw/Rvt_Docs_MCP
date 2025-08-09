# Revit API Docs MCP Server

A Model Context Protocol (MCP) server that provides access to Revit API
documentation. This server allows LLMs and AI assistants to search and retrieve
Revit API documentation programmatically.

## Features (Planned)

- **Search Revit API**: Search for classes, methods, and properties in the Revit
  API documentation
- **Access Documentation**: Retrieve specific documentation pages for Revit API
  classes
- **Code Examples**: Generate code examples for Revit API usage

## Project Structure

```
Rvt_Docs_MCP/
├── main.ts              # Main MCP server implementation
├── deno.json            # Deno configuration and dependencies
├── mcp-config.json      # MCP configuration for testing
├── test-server.ts       # Test script for the server
├── TESTING.md           # Detailed testing guide
└── README.md            # This file
```

## Development

This project uses Deno as the runtime. To run the server in development mode:

```bash
deno task dev
```

## Testing with Cursor

### Quick Setup

1. **Use the provided MCP configuration**:
   - The `mcp-config.json` file is already configured for your project
   - Update the `cwd` path in `mcp-config.json` if needed

2. **Configure Cursor**:
   - Open Cursor Settings (Cmd/Ctrl + ,)
   - Search for "MCP" or "Model Context Protocol"
   - Add the path to your `mcp-config.json` file
   - Restart Cursor

3. **Test the server**:
   - Ask Cursor: "What MCP tools are available?"
   - Try: "Search the Revit API for 'Wall' class"

### Alternative: Environment Variable

```bash
export CURSOR_MCP_CONFIG="/path/to/your/Rvt_Docs_MCP/mcp-config.json"
```

## Testing with Other Clients

### Claude Desktop

Create `~/.config/claude/desktop_config.json`:

```json
{
  "mcpServers": {
    "revit-api-docs": {
      "command": "deno",
      "args": ["run", "--allow-net", "main.ts"],
      "cwd": "/path/to/your/Rvt_Docs_MCP"
    }
  }
}
```

### MCP Inspector (Development)

```bash
npm install -g @modelcontextprotocol/inspector
mcp-inspector --server "deno run --allow-net main.ts" --cwd "/path/to/your/Rvt_Docs_MCP"
```

## Dependencies

- `@modelcontextprotocol/sdk`: The MCP TypeScript SDK for building MCP servers
- `zod`: Schema validation library for input validation

## Implementation Status

This is currently a barebones skeleton. The following components need to be
implemented:

1. **Revit API Documentation Scraper**: Logic to fetch and parse Revit API
   documentation from the official website
2. **Search Functionality**: Implement the actual search logic in the
   `search-revit-api` tool
3. **Documentation Retrieval**: Implement fetching specific class documentation
   in the resource handler
4. **Error Handling**: Add proper error handling for network requests and
   parsing
5. **Caching**: Implement caching to avoid repeated requests to the
   documentation website

## Usage

Once implemented, this MCP server can be used with any MCP-compatible client
(like Claude Desktop, Cursor, etc.) to access Revit API documentation through
natural language queries.

## Testing

See [TESTING.md](./TESTING.md) for detailed testing instructions and
troubleshooting.

## License

[Add your license here]
