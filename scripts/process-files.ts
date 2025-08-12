#!/usr/bin/env -S deno run --allow-read --allow-write

const targetDir = "/Users/kai-admin/A/PE/tbc/a";

async function processFiles() {
  try {
    // Check if directory exists
    try {
      await Deno.stat(targetDir);
    } catch {
      console.error(`Directory ${targetDir} does not exist`);
      return;
    }

    const entries = [];
    for await (const entry of Deno.readDir(targetDir)) {
      entries.push(entry);
    }

    const files = entries.filter((entry) => entry.isFile).map((entry) =>
      entry.name
    );

    // Group files by base name (without extension)
    const fileGroups = new Map<
      string,
      { md?: string; htm?: string; html?: string }
    >();

    for (const file of files) {
      const ext = file.split(".").pop()?.toLowerCase();
      const baseName = file.substring(0, file.lastIndexOf("."));

      if (!fileGroups.has(baseName)) {
        fileGroups.set(baseName, {});
      }

      const group = fileGroups.get(baseName);
      if (!group) continue;

      if (ext === "md") {
        group.md = file;
      } else if (ext === "htm") {
        group.htm = file;
      } else if (ext === "html") {
        group.html = file;
      }
    }

    let deletedCount = 0;
    let renamedCount = 0;

    // Process each group
    for (const [baseName, group] of fileGroups) {
      // Delete .md if there's a corresponding .htm or .html
      if (group.md && (group.htm || group.html)) {
        const mdPath = `${targetDir}/${group.md}`;
        try {
          await Deno.remove(mdPath);
          console.log(`Deleted: ${group.md}`);
          deletedCount++;
        } catch (error) {
          console.error(
            `Failed to delete ${group.md}:`,
            (error as Error).message,
          );
        }
      }

      // Rename .htm to .html if no .html exists
      if (group.htm && !group.html) {
        const oldPath = `${targetDir}/${group.htm}`;
        const newPath = `${targetDir}/${baseName}.html`;

        try {
          await Deno.rename(oldPath, newPath);
          console.log(`Renamed: ${group.htm} → ${baseName}.html`);
          renamedCount++;
        } catch (error) {
          console.error(
            `Failed to rename ${group.htm}:`,
            (error as Error).message,
          );
        }
      }
    }

    console.log("\nProcessing complete!");
    console.log(`Deleted ${deletedCount} .md files`);
    console.log(`Renamed ${renamedCount} .htm files to .html`);
  } catch (error) {
    console.error("Error processing files:", (error as Error).message);
  }
}

// Run the script
if (import.meta.main) {
  processFiles();
}
