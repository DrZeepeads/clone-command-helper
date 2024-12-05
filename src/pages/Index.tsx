import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <button className="p-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <h1 className="text-2xl font-bold">NelsonBot</h1>
        <div className="w-10 h-10"></div> {/* Placeholder for symmetry */}
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-between h-[calc(100vh-64px)]">
        {/* Logo Section */}
        <div className="flex-1 flex items-center justify-center w-full">
          <img 
            src="/lovable-uploads/691f613e-b9e0-47ea-8d4e-7f9bf728f3de.png" 
            alt="NelsonBot Logo" 
            className="w-32 h-32"
          />
        </div>

        {/* Auth Section - Only shown when not logged in */}
        <div className="w-full max-w-md p-4">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#000000',
                    brandAccent: '#333333',
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