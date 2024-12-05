import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuBar } from "@/components/MenuBar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('chat_images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat_images')
        .getPublicUrl(fileName);

      toast({
        title: "Photo uploaded successfully",
        description: "Your image has been attached to the message.",
      });

      // You can use the publicUrl here to send it with the message
      console.log('Uploaded image URL:', publicUrl);
    } catch (error) {
      console.error('Upload error:', error);
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

    try {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 flex flex-col">
        <MenuBar />
        <AppSidebar />
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col items-center justify-between pt-20 pb-24 px-4 max-w-7xl mx-auto w-full">
          <div className="flex-1 flex flex-col items-center justify-center w-full gap-8 animate-fade-in">
            <div className="text-center space-y-4 max-w-2xl">
              <h2 className="text-3xl font-bold text-gray-800">
                Your Medical Knowledge Assistant
              </h2>
              <p className="text-gray-600 text-lg">
                Get instant access to reliable medical information and personalized health insights
              </p>
            </div>
          </div>
        </main>

        {/* Footer Chat Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
          <div className="max-w-7xl mx-auto flex gap-2 items-center">
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
              <Camera className="h-5 w-5 text-gray-500" />
            </Button>
            <Input
              placeholder="Type your medical question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button 
              className="flex-shrink-0"
              onClick={handleSendMessage}
              disabled={!message.trim()}
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