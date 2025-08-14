# Revit API MCP Server

## Overview

Because of the absurd surface area of the Revit API, AI often hallucinates
classes, methods, properties, or even entire namespaces. Furthermore, useful,
but unofficial or uncommon uses of the API are so niche that AI's have no
knowledge of it. To curb this, this MCP server provides LLMs access to Revit API
documentation and other related content (see
[Rvt_Docs_Tbc_Embedder](https://github.com/kaitpw/Rvt_Docs_TBC_Embedder)). Under
the hood, it uses both rvtdocs.com and revitapidocs.com, and if enabled, the
Building Coder Blog.

Simply ask your MCP client what the Revit API docs say about something and it
will use a combination of tools to explore the API docs on its own.

### Features

- **Search Revit API**: Search for classes, methods, and properties (or any API
  entity) in the Revit API documentation.
- **Access Documentation**: Retrieve the content of an API entity's docs page
  either via the url or the entities name.
- **Search/Access TBC Blog**: Perform semantic search over a vector space of The
  Building Coder blog embeddings.

### Features (Planned)

- **Code Examples**: Get code examples for Revit API usage and make them
  accessible. See
  [RevitSdkSamples](https://github.com/jeremytammik/RevitSdkSamples). Or maybe
  even entire repos, like those from ricuan-io, Nice3point, chuongmep, kilkellym, and of
  course jeremytammik.
- **More Resources**: Add other content to the vector store. Candidates include
  tbc-related pdfs, random blog posts, and Autodesk University resources.
- **Caching (Unlikely)**: Cache responses to reduce traffic to the api doc
  sites.

## Tools

This repository provides four MCP tools for working with Revit API
documentation:

- **`search-docs`** - Search Revit API documentation to find entities matching
  your query. Returns entity names, descriptions, namespaces, types, and URL
  slugs for further exploration (but not the documentation itself).

- **`retrieve-doc`** - Retrieve a single Revit API documentation page using its
  URL slug. Use this after getting a URL slug from a search operation.

- **`retrieve-docs`** - Get full documentation content for multiple Revit API
  entities based on a search query. Useful when you need complete documentation
  content, not just search results.

- **`search-library`** - Search a comprehensive library of Revit API learning
  resources including blog posts, code examples, PDFs, and practical guides.
  Powered by OpenAI's vector store for semantic search.

## Setup

Download the executable for your OS from
[Releases](https://github.com/kaitpw/Rvt_Docs_MCP/releases). Or you can clone
and build from source using `deno task compile`. Add this executable somewhere
in your file system that makes sense. Good practice for Windows is
`<username>/bin/`, but it can be anywhere.

Run `path\to\executable -h` in your terminal to see the help menu. FYI: This
executable is useless to run in the terminal besides for the help menu and for
testing the command you will be adding to your mcp config.

### Abbreviated Help Menu

To use the MCP server, add the executable to your mcp config for whatever MCP
client and OS your using.

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
      "command": "path\\to\\Rvt_Docs_MCP-windows.exe"
    },
    "revit-api-docs (with search-library enabled)": {
      "command": "path\\to\\Rvt_Docs_MCP-windows.exe -k 'sk-xxx' -v 'vs_xxx'",
      "args": ["-v", "vs_xxx", "-k", "sk-proj-xxx"]

    }
  }
}
```

To enable search-library, you must first follow the steps described in
[Rvt_Docs_Tbc_Embedder](https://github.com/kaitpw/Rvt_Docs_TBC_Embedder). After
doing so, run the executable with the `-k` (OpenAI API key) and `-v` (OpenAI
vector store ID) flags as seen above. To verify that this runs properly, run the
command on its own in your terminal. The ouput is informative, though as
mentioned above its meaningless otherwise.

## Development & Contribution

This project is open everything. Please contribute. Frankly I've never released
code for others to use before so I don't really know how licensing and pull
requests work so bear with me. Any help on anything is appreciated.

**Another note on licensing. I am using both rvtdocs.com and revitapidocs.com
search API's (which I ripped from the network console). I am concerned about the
legality of this but could not find licenses for them. I don't intend to do
anything in bad faith, so please tell me if this is wrong.**

This project uses Deno as the runtime. You can simply run the MCP server with
`deno task dev`. I've made this command such that it runs the mcp inspector on
localhost and listens to the repo with HMR. The HMR is a little slow since the
inspector runs it so just mindful of that.

The source code should hopefully be self explanatory and I'm open to any new
tools being added. My only stipulation is that you must set up an easy pipeline
to make the tool usable if it requires further setup (for example
[Rvt_Docs_Tbc_Embedder](https://github.com/kaitpw/Rvt_Docs_TBC_Embedder)).

A simple cross platform compilation is set up with Deno in Github workflows. To
trigger a build make a new git tag. Then push with `git push --follow-tags`.
