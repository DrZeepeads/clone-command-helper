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

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50 flex flex-col">
        <MenuBar />
        <AppSidebar />
        
        {/* Main Content with Branding */}
        <main className="flex-1 relative">
          {/* Centered Branding */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <img 
              src="/lovable-uploads/49424ffb-3fb9-4280-8414-1bb6e5e1cd79.png" 
              alt="NelsonAssist-AI"
              className="w-[600px] max-w-[90%] opacity-30"
            />
          </div>

          {/* Chat Content */}
          <div className="relative z-10">
            {/* Your chat messages will go here */}
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
            />
            <Button className="flex-shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;