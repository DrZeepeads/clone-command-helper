import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SearchResults } from "@/components/SearchResults";
import { AppSidebar } from "@/components/AppSidebar";
import { MenuBar } from "@/components/MenuBar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

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

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    try {
      setIsLoading(true);
      const newMessage = { type: 'user', content: currentMessage };
      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage("");

      // Search for relevant context
      const { data: searchData } = await supabase.functions.invoke('search-knowledge', {
        body: { query: currentMessage }
      });

      const context = searchData?.results?.map((r: any) => r.content).join('\n') || '';

      // Get AI response
      const { data: responseData, error } = await supabase.functions.invoke('medical-qa', {
        body: { 
          query: currentMessage,
          context
        }
      });

      if (error) {
        console.error('Error getting response:', error);
        return;
      }

      const aiMessage = { type: 'bot', content: responseData.answer };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      // Handle file upload logic here
      console.log("File upload not implemented yet");
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <MenuBar />
          
          <div className="flex-1 flex">
            {/* Main chat area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <ChatMessage 
                    key={index} 
                    type={message.type} 
                    content={message.content} 
                  />
                ))}
              </div>
              
              <div className="p-4 border-t">
                <ChatInput 
                  message={currentMessage}
                  setMessage={setCurrentMessage}
                  handleSendMessage={handleSendMessage}
                  handleFileUpload={handleFileUpload}
                  isLoading={isLoading}
                  isUploading={isUploading}
                />
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
    </SidebarProvider>
  );
};

export default Index;