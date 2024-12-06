import { useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SearchResults } from "@/components/SearchResults";
import { AppSidebar } from "@/components/AppSidebar";
import { MenuBar } from "@/components/MenuBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSearch } from "@/hooks/useSearch";
import { Message, handleModelLoading, sendMessage } from "@/services/chatService";
import { toast } from "sonner";

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const { searchResults, isLoading, handleSearch } = useSearch();

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    
    try {
      const newMessage = { type: 'user' as const, content: currentMessage };
      setMessages(prev => [...prev, newMessage]);
      setCurrentMessage("");

      // Search for relevant context
      const searchResults = await handleSearch(currentMessage);
      const context = searchResults?.map(r => r.content).join('\n') || '';

      let shouldRetry = true;
      while (shouldRetry && retryCount < 3) {
        const response = await sendMessage(currentMessage, context, retryCount);
        
        if (response === 'loading') {
          shouldRetry = await handleModelLoading(retryCount);
          if (!shouldRetry) return;
          setRetryCount(prev => prev + 1);
          continue;
        }

        if (response) {
          const aiMessage = { type: 'bot' as const, content: response };
          setMessages(prev => [...prev, aiMessage]);
          shouldRetry = false;
        } else {
          return;
        }
      }

    } catch (error) {
      console.error('Full error details:', error);
      toast.error('Failed to process message');
    } finally {
      setRetryCount(0);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
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
        
        {/* Left side - Search Results */}
        <div className="w-80 border-r bg-muted/30">
          <div className="p-4 space-y-4">
            <div className="font-semibold">Search Results</div>
            <SearchResults results={searchResults} isLoading={isLoading} />
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <MenuBar />
          
          {/* Chat area */}
          <main className="flex-1 relative mt-16">
            <div className="absolute inset-0 overflow-y-auto px-4 pb-32">
              <div className="max-w-3xl mx-auto space-y-4 py-4">
                {messages.map((msg, index) => (
                  <ChatMessage 
                    key={index} 
                    type={msg.type} 
                    content={msg.content} 
                  />
                ))}
              </div>
            </div>
            
            <ChatInput 
              message={currentMessage}
              setMessage={setCurrentMessage}
              handleSendMessage={handleSendMessage}
              handleFileUpload={handleFileUpload}
              isLoading={isLoading}
              isUploading={isUploading}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;