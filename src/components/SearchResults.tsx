import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string | null;
  chapter: string | null;
  similarity: number;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
}

export const SearchResults = ({ results, isLoading }: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-8 bg-muted rounded" />
            <CardContent className="h-16 bg-muted rounded mt-2" />
          </Card>
        ))}
      </div>
    );
  }

  if (!results.length) {
    return null;
  }

  return (
    <ScrollArea className="h-[300px] rounded-md border p-4">
      <div className="space-y-4">
        {results.map((result) => (
          <Card key={result.id}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium leading-none">
                {result.title}
                {result.chapter && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    Chapter: {result.chapter}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {result.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};