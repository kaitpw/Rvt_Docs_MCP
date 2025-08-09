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

export const ZTypeFromImageUrl = z.string().transform((imageUrl) => {
  if (imageUrl.includes("Class.gif")) return "Class";
  if (imageUrl.includes("Constructor.gif")) return "Constructor";
  if (imageUrl.includes("Method.gif")) return "Method";
  if (imageUrl.includes("Property.gif")) return "Property";
  if (imageUrl.includes("Properties.gif")) return "Properties";
  if (imageUrl.includes("Members.gif")) return "Members";
  if (imageUrl.includes("Interface.gif")) return "Interface";
  if (imageUrl.includes("Enum.gif")) return "Enum";
  return "Unknown";
});

export type SearchResultTypes = z.infer<typeof ZTypeFromImageUrl>;
