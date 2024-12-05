import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuBar } from "@/components/MenuBar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SearchResults } from "@/components/SearchResults";

interface Message {
  type: 'user' | 'bot';
  content: string;
}

interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string | null;
  chapter: string | null;
  similarity: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data: searchData, error: searchError } = await supabase.functions.invoke('search-knowledge', {
        body: { query }
      });

      if (searchError) {
        console.error('Error searching knowledge base:', searchError);
        throw searchError;
      }

      console.log('Search results:', searchData);
      setSearchResults(searchData.results || []);
    } catch (error) {
      console.error('Error during search:', error);
      toast({
        title: "Search failed",
        description: "Failed to search the knowledge base. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      toast({
        title: "Photo uploaded successfully",
        description: "Your image has been attached to the message.",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // First, search the knowledge base
      await handleSearch(userMessage);
      
      console.log('Sending to medical-qa with results:', { query: userMessage, searchResults });
      const { data, error } = await supabase.functions.invoke('medical-qa', {
        body: { 
          query: userMessage,
          searchResults 
        },
      });

      if (error) {
        console.error('Error from medical-qa function:', error);
        throw error;
      }

      console.log('Received response from medical-qa:', data);
      
      if (!data || !data.response) {
        throw new Error('No response received from the medical-qa function');
      }

      setMessages(prev => [...prev, { type: 'bot', content: data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
        <MenuBar />
        <AppSidebar />
        
        <main className="flex-1 relative p-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4 pb-24">
            {messages.map((msg, index) => (
              <ChatMessage key={index} type={msg.type} content={msg.content} />
            ))}
            {isLoading && (
              <div className="bg-muted p-4 rounded-lg mr-auto max-w-[80%]">
                <div className="animate-pulse flex space-x-2">
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                  <div className="h-2 w-2 bg-current rounded-full"></div>
                </div>
              </div>
            )}
            <SearchResults results={searchResults} isLoading={isSearching} />
            <div ref={messagesEndRef} />
          </div>
        </main>

        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          handleFileUpload={handleFileUpload}
          isLoading={isLoading}
          isUploading={isUploading}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;