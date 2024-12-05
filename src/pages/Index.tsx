import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SearchResults } from "@/components/SearchResults";
import { AppSidebar } from "@/components/AppSidebar";
import { MenuBar } from "@/components/MenuBar";

const Index = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const { data: results, error } = await supabase.functions.invoke('search-knowledge', {
        body: { query }
      });

      if (error) {
        console.error('Error searching knowledge:', error);
        return;
      }

      setSearchResults(results?.results || []);
    } catch (error) {
      console.error('Error in search:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    try {
      setIsLoading(true);
      const newMessage = { role: 'user', content: message };
      setMessages(prev => [...prev, newMessage]);

      // Search for relevant context
      const { data: searchData } = await supabase.functions.invoke('search-knowledge', {
        body: { query: message }
      });

      const context = searchData?.results?.map((r: any) => r.content).join('\n') || '';

      // Get AI response
      const { data: responseData, error } = await supabase.functions.invoke('medical-qa', {
        body: { 
          query: message,
          context
        }
      });

      if (error) {
        console.error('Error getting response:', error);
        return;
      }

      const aiMessage = { role: 'assistant', content: responseData.answer };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col">
        <MenuBar />
        
        <div className="flex-1 flex">
          {/* Main chat area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
            </div>
            
            <div className="p-4 border-t">
              <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>

          {/* Search results sidebar */}
          <div className="w-80 border-l bg-muted/30 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="font-semibold">Search Results</div>
              <SearchResults results={searchResults} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;