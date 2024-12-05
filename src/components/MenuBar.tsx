import { useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Menu, Clock } from "lucide-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const MenuBar = () => {
  const navigate = useNavigate();

  const viewHistory = () => {
    navigate("/history");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Menu and Logo */}
          <div className="flex items-center gap-4">
            <Menubar className="border-none bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Menu className="h-5 w-5" />
                </MenubarTrigger>
                <MenubarContent className="min-w-[320px]">
                  <MenubarItem className="flex items-center gap-2 p-3">
                    <img 
                      src="/lovable-uploads/16cb4f6f-aec8-411b-a3e2-4e5db51158e3.png" 
                      alt="NelsonBot Logo" 
                      className="w-8 h-8"
                    />
                    <span className="font-semibold text-lg">NelsonBot</span>
                  </MenubarItem>
                  <MenubarItem className="text-sm text-gray-500 px-3 py-2">
                    Your Pediatric Assistant
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem 
                    className="flex items-center gap-2 cursor-pointer p-3"
                    onClick={viewHistory}
                  >
                    <Clock className="h-4 w-4" />
                    <span>View History</span>
                  </MenubarItem>
                  <MenubarSeparator />
                  <div className="p-4">
                    <Auth
                      supabaseClient={supabase}
                      appearance={{
                        theme: ThemeSupa,
                        variables: {
                          default: {
                            colors: {
                              brand: '#E91E63',
                              brandAccent: '#D81B60',
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
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            
            {/* Logo and Slogan */}
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/16cb4f6f-aec8-411b-a3e2-4e5db51158e3.png" 
                alt="NelsonBot Logo" 
                className="w-10 h-10 object-contain"
              />
              <div className="hidden sm:flex flex-col">
                <span className="font-semibold text-lg leading-tight">NelsonBot</span>
                <span className="text-xs text-gray-500">Your Pediatric Assistant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};