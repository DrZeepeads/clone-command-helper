import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm fixed top-0 w-full z-10">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          NelsonBot
        </h1>
        <div className="w-10 h-10"></div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-between min-h-screen pt-16 pb-4 px-4 max-w-7xl mx-auto">
        {/* Logo and Welcome Section */}
        <div className="flex-1 flex flex-col items-center justify-center w-full gap-8 animate-fade-in">
          <img 
            src="/lovable-uploads/691f613e-b9e0-47ea-8d4e-7f9bf728f3de.png" 
            alt="NelsonBot Logo" 
            className="w-32 h-32 rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
          />
          <div className="text-center space-y-4 max-w-2xl">
            <h2 className="text-3xl font-bold text-gray-800">
              Your Medical Knowledge Assistant
            </h2>
            <p className="text-gray-600 text-lg">
              Get instant access to reliable medical information and personalized health insights
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mt-8">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full flex items-center gap-2 h-auto py-4"
            >
              <MessageCircle className="w-5 h-5" />
              Ask about symptoms
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full flex items-center gap-2 h-auto py-4"
            >
              <MessageCircle className="w-5 h-5" />
              Get treatment info
            </Button>
          </div>
        </div>

        {/* Auth Section */}
        <div className="w-full max-w-md p-4 mt-8 bg-white rounded-xl shadow-sm">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#7E69AB',
                    brandAccent: '#6E59A5',
                  }
                }
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
              },
            }}
            providers={[]}
            redirectTo={`${window.location.origin}/dashboard`}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;