# Revit API Docs MCP Server

A Model Context Protocol (MCP) server that provides access to Revit API
documentation. This server allows LLMs and AI assistants to search and retrieve
Revit API documentation programmatically. Under the hood, it uses both rvtdocs.com and revitapidocs.com. 

## Features

- **Search Revit API**: Search for classes, methods, and properties in the Revit
  API documentation
- **Access Documentation**: Retrieve specific documentation pages for Revit API
  classes

## Features (Planned)

- **Code Examples**: Get code examples for Revit API usage and make them accessible
- **Caching**: Cache responses to reduce traffic to the api doc sites

## Setup

To use the MCP server, add the executable for your operating system into your mcp.config

```json
{
  "mcpServers": {
    "revit-api-docs (macos-arm64)": {
      "command": "path/to/Rvt_Docs_MCP-macos-arm64"
    },
    "revit-api-docs (macos-x64)": {
      "command": "path/to/Rvt_Docs_MCP-macos-x64"
    },
    "revit-api-docs (windows)": {
      "command": "path/to/Rvt_Docs_MCP-windows-x64.exe"
    }
  }
}
```

## Development

This project uses Deno as the runtime. You can simply run the MCP server with `deno task dev` but 
this isn't much help because no port is exposed, best practice for MCPs is to use stdio. Instead 
run the official MCP inspector and interact with the server there. The only downside of this is that it 
doesn't do HMR in the same way that webapp dev normally does.

```bash
# cd to this repo
npx @modelcontextprotocol/inspector deno run -A main.ts
```
