import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string | null;
  chapter: string | null;
  similarity: number;
}

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    console.log("Handling search with query:", query); // Debug log
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('search-knowledge', {
        body: { query },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Search API response:", { data, error }); // Debug log

      if (error) {
        console.error('Search error details:', error);
        toast.error('Error searching knowledge base');
        return null;
      }

      const results = data?.results || [];
      setSearchResults(results);
      return results;
    } catch (error) {
      console.error('Search error full details:', error);
      toast.error('Failed to search knowledge base');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    searchResults,
    isLoading,
    handleSearch
  };
};