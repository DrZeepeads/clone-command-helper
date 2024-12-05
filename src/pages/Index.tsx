import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuBar } from "@/components/MenuBar";

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
      <MenuBar />
      
      {/* Main Content */}
      <main className="flex flex-col items-center justify-between min-h-[calc(100vh-64px)] pt-20 pb-4 px-4 max-w-7xl mx-auto">
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
            redirectTo={window.location.origin + "/dashboard"}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;