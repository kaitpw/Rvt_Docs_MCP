import { type DefaultTreeAdapterMap, parse } from "parse5";

type Element = DefaultTreeAdapterMap["element"];
type ChildNode = DefaultTreeAdapterMap["childNode"];
type TextNode = DefaultTreeAdapterMap["textNode"];
type CommentNode = DefaultTreeAdapterMap["commentNode"];

/**
 * Extracts Revit API documentation from HTML and converts it to markdown
 */
export async function extractRvtDocsText(url: string): Promise<string> {
  const response = await fetch(url);
  const html = await response.text();
  const doc = parse(html);

  const htmlElement = findElement(
    doc.childNodes,
    (node) => node.nodeName === "html",
  );
  if (!htmlElement) throw new Error("HTML element not found");

  const mainContent = findElementAfterComment(
    htmlElement,
    " Main content and footer ",
  );
  if (!mainContent) throw new Error("Main content section not found");

  let markdown = "";

  // Extract left column content
  const leftColumn = findElementAfterComment(
    mainContent,
    " Left Column: Namespace, Title, Description, Remarks ",
  );
  if (leftColumn) {
    markdown += extractLeftColumn(leftColumn);
  }

  // Extract hierarchy
  const rightColumn = findElementAfterComment(
    mainContent,
    " Right Column: Hierarchy - Only show div if hierarchy exists ",
  );
  if (rightColumn) {
    const hierarchyHtml = extractHtmlContent(rightColumn);
    if (hierarchyHtml.trim()) {
      markdown += `## Hierarchy\n\n${htmlToMarkdown(hierarchyHtml)}\n\n`;
    }
  }

  // Extract syntax sections
  const syntaxSections = findAll(
    mainContent,
    (el) => hasClass(el, "card-title") && getText(el).includes("Syntax"),
  );
  for (const section of syntaxSections) {
    markdown += extractSyntax(section);
  }

  // Extract tables
  const tables = findAll(mainContent, (el) => el.nodeName === "table");
  for (const table of tables) {
    const tableMarkdown = extractTable(table);
    if (tableMarkdown.trim()) {
      markdown += `\n${tableMarkdown}`;
    }
  }

  return markdown.replace(/\n{3,}/g, "\n\n").trim();
}

function findElementAfterComment(
  node: ChildNode,
  commentText: string,
): Element | null {
  if (
    node.nodeName === "#comment" &&
    (node as CommentNode).data.includes(commentText)
  ) {
    if (node.parentNode) {
      const siblings = node.parentNode.childNodes;
      const index = siblings.indexOf(node);
      for (let i = index + 1; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling.nodeName !== "#text" && sibling.nodeName !== "#comment") {
          return sibling as Element;
        }
      }
    }
  }

  if ("childNodes" in node) {
    for (const child of node.childNodes) {
      const result = findElementAfterComment(child, commentText);
      if (result) return result;
    }
  }
  return null;
}

function extractLeftColumn(element: Element): string {
  let markdown = "";

  // Namespace
  const namespace = find(element, (el) => hasClass(el, "card-namespace"));
  if (namespace) {
    const text = cleanText(getText(namespace));
    if (text.includes("Namespace:")) {
      markdown += `**Namespace:** ${text.replace("Namespace:", "").trim()}\n\n`;
    }
  }

  // Title
  const titleCard = find(element, (el) => hasClass(el, "card-title"));
  if (titleCard) {
    const h1 = find(titleCard, (el) => el.nodeName === "h1");
    if (h1) {
      markdown += `# ${cleanText(getText(h1))}\n\n`;
    }

    const typeBadge = find(titleCard, (el) => hasClass(el, "bg-gray-200"));
    if (typeBadge) {
      markdown += `**Type:** ${cleanText(getText(typeBadge))}\n\n`;
    }
  }

  // Description
  const description = find(element, (el) => hasClass(el, "card-description"));
  if (description) {
    const html = extractHtmlContent(description).replace(
      "<strong>Description:</strong>",
      "",
    ).trim();
    if (html) {
      markdown += `## Description\n\n${htmlToMarkdown(html)}\n\n`;
    }
  }

  // Remarks
  const remarks = find(element, (el) => hasClass(el, "card-remarks"));
  if (remarks) {
    const html = extractHtmlContent(remarks).replace(
      "<strong>Remarks:</strong>",
      "",
    ).trim();
    if (html) {
      markdown += `## Remarks\n\n${htmlToMarkdown(html)}\n\n`;
    }
  }

  return markdown;
}

function extractSyntax(syntaxTitle: Element): string {
  let markdown = "## Syntax\n\n";

  const parentCard = findParent(syntaxTitle, (el) => hasClass(el, "card"));
  if (parentCard) {
    const codeSnippets = findAll(
      parentCard,
      (el) => hasClass(el, "code-snippet"),
    );
    for (const snippet of codeSnippets) {
      const codeElement = find(snippet, (el) => el.nodeName === "code");
      if (codeElement) {
        const code = cleanText(getText(codeElement));
        if (code) {
          const codeClass = getAttr(codeElement, "class") || "";
          const language = codeClass.includes("vbnet")
            ? "vbnet"
            : codeClass.includes("cpp")
            ? "cpp"
            : "csharp";
          markdown += `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
        }
      }
    }
  }
  return markdown;
}

function extractTable(table: Element): string {
  let markdown = "";

  const thead = find(table, (el) => el.nodeName === "thead");
  const tbody = find(table, (el) => el.nodeName === "tbody");

  if (thead) {
    const headerRow = find(thead, (el) => el.nodeName === "tr");
    if (headerRow) {
      const headers = findAll(headerRow, (el) => el.nodeName === "th").map(
        (el) => cleanText(getText(el)),
      );
      markdown += `| ${headers.join(" | ")} |\n`;
      markdown += `|${headers.map(() => "---").join("|")}|\n`;
    }
  }

  if (tbody) {
    const rows = findAll(tbody, (el) => el.nodeName === "tr");
    for (const row of rows) {
      const cells = findAll(row, (el) => el.nodeName === "td").map((el) =>
        cleanText(getText(el))
      );
      if (cells.length > 0) {
        markdown += `| ${cells.join(" | ")} |\n`;
      }
    }
  }

  return `${markdown}\n`;
}

// Consolidated helper functions
function find(
  element: Element | ChildNode,
  predicate: (el: Element) => boolean,
): Element | null {
  if (
    "nodeName" in element && element.nodeName !== "#text" &&
    element.nodeName !== "#comment"
  ) {
    const el = element as Element;
    if (predicate(el)) return el;
  }

  if ("childNodes" in element) {
    for (const child of element.childNodes) {
      const result = find(child, predicate);
      if (result) return result;
    }
  }
  return null;
}

function findElement(
  node: ChildNode | ChildNode[],
  predicate: (el: Element) => boolean,
): Element | null {
  const nodes = Array.isArray(node) ? node : [node];
  for (const n of nodes) {
    const result = find(n, predicate);
    if (result) return result;
  }
  return null;
}

function findAll(
  element: Element,
  predicate: (el: Element) => boolean,
): Element[] {
  const results: Element[] = [];

  if (predicate(element)) {
    results.push(element);
  }

  if (element.childNodes) {
    for (const child of element.childNodes) {
      if (child.nodeName !== "#text" && child.nodeName !== "#comment") {
        results.push(...findAll(child as Element, predicate));
      }
    }
  }
  return results;
}

function findParent(
  element: Element,
  predicate: (el: Element) => boolean,
): Element | null {
  let current = element.parentNode;
  while (current && "attrs" in current) {
    const el = current as Element;
    if (predicate(el)) return el;
    current = el.parentNode;
  }
  return null;
}

function hasClass(element: Element, className: string): boolean {
  return element.attrs?.some((attr) =>
    attr.name === "class" && attr.value.includes(className)
  ) ?? false;
}

function getAttr(element: Element, name: string): string | undefined {
  return element.attrs?.find((attr) => attr.name === name)?.value;
}

function getText(node: ChildNode): string {
  if (node.nodeName === "#text") {
    return (node as TextNode).value;
  }
  if ("childNodes" in node) {
    return node.childNodes.map(getText).join("");
  }
  return "";
}

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function extractHtmlContent(element: Element): string {
  let html = "";
  if (element.childNodes) {
    for (const child of element.childNodes) {
      if (child.nodeName === "#text") {
        html += (child as TextNode).value;
      } else if (child.nodeName === "br") {
        html += "\n";
      } else if (child.nodeName === "strong") {
        html += `<strong>${getText(child)}</strong>`;
      } else if (["ul", "ol", "li", "p"].includes(child.nodeName)) {
        html += `<${child.nodeName}>${
          extractHtmlContent(child as Element)
        }</${child.nodeName}>`;
      } else {
        html += extractHtmlContent(child as Element);
      }
    }
  }
  return html;
}

function htmlToMarkdown(html: string): string {
  return html
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<p>/g, "")
    .replace(/<\/p>/g, "\n")
    .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
    .replace(/<ul>/g, "")
    .replace(/<\/ul>/g, "")
    .replace(/<ol>/g, "")
    .replace(/<\/ol>/g, "")
    .replace(/<li>(.*?)<\/li>/g, "- $1")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+/g, " ")
    .replace(/\n /g, "\n")
    .trim();
}
