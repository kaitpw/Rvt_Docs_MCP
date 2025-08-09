export interface SearchResult {
  title: string;
  description: string;
  url: string;
  id: string;
  type: string;
  matchedTerms: string[];
}

export interface SearchResponse {
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
