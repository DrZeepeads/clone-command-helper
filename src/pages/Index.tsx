import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuBar } from "@/components/MenuBar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Handle file upload logic here
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
      console.log('Searching knowledge base:', userMessage);
      
      // First, search the knowledge base
      const { data: searchData, error: searchError } = await supabase.functions.invoke('search-knowledge', {
        body: { query: userMessage }
      });

      if (searchError) {
        console.error('Error searching knowledge base:', searchError);
        throw searchError;
      }

      console.log('Search results:', searchData);
      const results: SearchResult[] = searchData.results || [];

      // Then, get AI response using the medical-qa function
      const { data, error } = await supabase.functions.invoke('medical-qa', {
        body: { 
          query: userMessage,
          searchResults: results 
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
        
        {/* Main Content */}
        <main className="flex-1 relative p-4 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-4 pb-24">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-lg max-w-[80%]",
                  msg.type === 'user' 
                    ? "bg-primary text-primary-foreground ml-auto" 
                    : "bg-muted mr-auto"
                )}
              >
                {msg.content}
              </div>
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
            <div ref={messagesEndRef} />
          </div>
        </main>

        {/* Footer Chat Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4">
          <div className="max-w-3xl mx-auto flex gap-4 items-center">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={() => document.getElementById('photo-upload')?.click()}
              disabled={isUploading}
            >
              <Camera className="h-5 w-5 text-muted-foreground" />
            </Button>
            <Input
              placeholder="Ask me anything about pediatric care..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button 
              className="flex-shrink-0"
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;