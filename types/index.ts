import { z } from "zod";

export interface SearchResult {
  title: string;
  description: string;
  namespace?: string;
  type: string;
  url: string;
}

export interface SearchResponseRvtDocsCom {
  current_version_results?: Array<{
    id?: string;
    title?: string;
    description?: string;
    namespace?: string;
    year_version?: string;
    type?: string;
    url?: string;
  }>;
}

export interface SearchResponseRevirApiDocsCom {
  sections?: {
    Products?: Array<{
      value: string;
      data: {
        description?: string;
        url: string;
        id: string;
        image_url?: string;
      };
      matched_terms?: string[];
    }>;
  };
}

export const SearchResultTypes = [
  "Class",
  "Constructor",
  "Method",
  "Methods",
  "Property",
  "Properties",
  "Members",
  "Interface",
  "Enum",
] as const;

export const ZTypeFromImageUrl = z.string().transform((imageUrl) => {
  for (const t of SearchResultTypes) {
    if (imageUrl.includes(`${t}.gif`)) return t;
  }
  return "Unknown";
});
