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
      const response = await supabase.functions.invoke('search-knowledge', {
        body: { query },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Search API response:", response); // Debug log

      if (response.error) {
        console.error('Search error details:', response.error);
        toast.error('Error searching knowledge base');
        return;
      }

      setSearchResults(response.data?.results || []);
    } catch (error) {
      console.error('Search error full details:', error);
      toast.error('Failed to search knowledge base');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    console.log("Attempting to send message:", currentMessage); // Debug log
    
    try {
      setIsLoading(true);
      const newMessage = { type: 'user' as const, content: currentMessage };
      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage("");

      // Search for relevant context
      console.log("Fetching search context..."); // Debug log
      const searchResponse = await supabase.functions.invoke('search-knowledge', {
        body: { query: currentMessage },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Search context response:", searchResponse); // Debug log

      if (searchResponse.error) {
        console.error('Search context error:', searchResponse.error);
        toast.error('Failed to get context');
        return;
      }

      const context = searchResponse.data?.results?.map((r: any) => r.content).join('\n') || '';

      // Get AI response
      console.log("Requesting AI response..."); // Debug log
      const aiResponse = await supabase.functions.invoke('medical-qa', {
        body: { 
          query: currentMessage,
          context
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("AI response full details:", aiResponse); // Debug log

      if (aiResponse.error) {
        console.error('AI response error:', aiResponse.error);
        toast.error('Failed to get response');
        return;
      }

      if (!aiResponse.data?.response) {
        console.error('Invalid AI response format:', aiResponse.data);
        toast.error('Received invalid response format');
        return;
      }

      const aiMessage = { type: 'bot' as const, content: aiResponse.data.response };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Full error details:', error);
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
      console.log("Attempting file upload:", file.name); // Debug log
      toast.info('File upload not implemented yet');
    } catch (error) {
      console.error('File upload error:', error);
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