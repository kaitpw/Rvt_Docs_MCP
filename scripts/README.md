# Scripts Directory

This directory contains utility scripts for the Rvt_Docs_MCP project.

## upload-to-openai.ts

A TypeScript script that uploads all supported files from a specified directory
to OpenAI's file storage and creates a vector store for use with the file search
tool.

### Features

- ✅ Uploads all supported file types to OpenAI file storage
- ✅ Creates a vector store and adds uploaded files to it
- ✅ Batch processing to respect rate limits
- ✅ Progress tracking and error handling
- ✅ Comprehensive logging and status reports
- ✅ Support for all OpenAI-supported file formats

### Supported File Types

The script supports all file types documented by OpenAI:

- Code files: `.c`, `.cpp`, `.cs`, `.css`, `.go`, `.html`, `.htm`, `.java`,
  `.js`, `.json`, `.php`, `.py`, `.rb`, `.sh`, `.ts`
- Documents: `.doc`, `.docx`, `.md`, `.pdf`, `.pptx`, `.tex`, `.txt`

### Prerequisites

1. **OpenAI API Key**: You need a valid OpenAI API key with access to the Files
   and Vector Stores APIs.
2. **Deno Runtime**: The script is designed to run with Deno.

### Usage

1. **Set your OpenAI API key**:
   ```bash
   export OPENAI_API_KEY=your_api_key_here
   ```

2. **Run the script**:
   ```bash
   deno run --allow-env --allow-read --allow-net scripts/upload-to-openai.ts
   ```

   Or make it executable and run directly:
   ```bash
   chmod +x scripts/upload-to-openai.ts
   ./scripts/upload-to-openai.ts
   ```

### Configuration

The script is currently configured to upload files from
`/Users/kai-admin/A/PE/tbc/a`. To change the source directory, edit the
`SOURCE_DIRECTORY` constant at the top of the script.

### Output

The script will:

1. **Scan the directory** for supported files
2. **Create a vector store** named "tbc-blog-docs"
3. **Upload files in batches** to respect rate limits
4. **Add uploaded files to the vector store**
5. **Provide a summary** with success/failure counts
6. **Display the vector store ID** for use in API calls

### Using the Vector Store

After running the script, you'll receive a vector store ID. Use this ID in your
OpenAI API calls:

```typescript
const response = await openai.responses.create({
  model: "gpt-4.1",
  input: "What is covered in the Revit API documentation?",
  tools: [{
    type: "file_search",
    vector_store_ids: ["vs-your-vector-store-id-here"],
  }],
});
```

### Error Handling

The script includes comprehensive error handling:

- Individual file upload failures won't stop the entire process
- Network errors are caught and reported
- Unsupported file types are skipped with warnings
- Final summary shows which files succeeded/failed

### Rate Limiting

The script implements rate limiting strategies:

- Files are processed in batches of 5
- 1-second delay between upload batches
- 200ms delay between vector store additions

### Troubleshooting

**"OPENAI_API_KEY environment variable is required"**

- Set your OpenAI API key: `export OPENAI_API_KEY=your_key`

**"No supported files found"**

- Check that the source directory exists and contains supported file types
- Verify the `SOURCE_DIRECTORY` path in the script

**HTTP 429 (Rate Limit) errors**

- The script includes rate limiting, but you may need to increase delays for
  heavy usage
- Consider upgrading your OpenAI plan for higher rate limits

**File upload failures**

- Check file permissions and that files aren't corrupted
- Very large files may fail - OpenAI has file size limits

