import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SearchResults } from "@/components/SearchResults";
import { AppSidebar } from "@/components/AppSidebar";
import { MenuBar } from "@/components/MenuBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";

const Index = () => {
  console.log("Index component initializing"); // Debug log

  const [messages, setMessages] = useState<Array<{type: 'user' | 'bot', content: string}>>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleSearch = async (query: string) => {
    console.log("Handling search with query:", query); // Debug log
    try {
      setIsLoading(true);
      const { data: results, error } = await supabase.functions.invoke('search-knowledge', {
        body: { query }
      });

      if (error) {
        console.error('Error searching knowledge:', error);
        toast.error('Error searching knowledge base');
        return;
      }

      console.log("Search results:", results); // Debug log
      setSearchResults(results?.results || []);
    } catch (error) {
      console.error('Error in search:', error);
      toast.error('Failed to search knowledge base');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    console.log("Handling send message:", currentMessage); // Debug log
    if (!currentMessage.trim()) return;
    
    try {
      setIsLoading(true);
      const newMessage = { type: 'user' as const, content: currentMessage };
      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage("");

      // Search for relevant context
      const { data: searchData } = await supabase.functions.invoke('search-knowledge', {
        body: { query: currentMessage }
      });

      console.log("Search data for context:", searchData); // Debug log
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
        toast.error('Failed to get response');
        return;
      }

      console.log("AI response:", responseData); // Debug log
      const aiMessage = { type: 'bot' as const, content: responseData.answer };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error in chat:', error);
      toast.error('Failed to process message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      console.log("File upload attempted:", file.name); // Debug log
      toast.info('File upload not implemented yet');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
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
                {messages.map((msg, index) => (
                  <ChatMessage 
                    key={index} 
                    type={msg.type} 
                    content={msg.content} 
                  />
                ))}
              </div>
              
              <ChatInput 
                message={currentMessage}
                setMessage={setCurrentMessage}
                handleSendMessage={handleSendMessage}
                handleFileUpload={handleFileUpload}
                isLoading={isLoading}
                isUploading={isUploading}
              />
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