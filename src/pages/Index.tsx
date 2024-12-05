import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuBar } from "@/components/MenuBar";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full bg-gradient-to-b from-white to-gray-50">
        <MenuBar />
        <AppSidebar />
        
        {/* Main Content */}
        <main className="flex flex-col items-center justify-between min-h-[calc(100vh-64px)] pt-20 pb-4 px-4 max-w-7xl mx-auto">
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
      </div>
    </SidebarProvider>
  );
};

export default Index;