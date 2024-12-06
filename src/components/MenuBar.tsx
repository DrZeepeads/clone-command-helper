import { useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Menu, Search, User, HelpCircle, Settings } from "lucide-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

export const MenuBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <Menubar className="border-none bg-transparent">
              <MenubarMenu>
                <MenubarTrigger className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
                  <Menu className="h-5 w-5" />
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem className="flex items-center gap-2 p-3">
                    <span className="font-semibold text-lg">NelsonBot</span>
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
                              brand: '#1A1F2C',
                              brandAccent: '#6E59A5',
                            }
                          }
                        }
                      }}
                      providers={[]}
                    />
                  </div>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            
            {/* Brand Name */}
            <div className="flex items-center">
              <span className="text-xl font-semibold text-[#1A1F2C]">NelsonBot</span>
              <span className="ml-2 text-sm text-gray-500">Pediatric Assistant</span>
            </div>
          </div>

          {/* Right Side Navigation */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Search className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <HelpCircle className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <User className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};