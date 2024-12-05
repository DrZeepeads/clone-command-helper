import { useNavigate } from "react-router-dom";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Menu, LogIn, LogOut, UserPlus } from "lucide-react";

export const MenuBar = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-4 py-2 bg-white/80 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          <Menubar className="border-none bg-transparent">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Menu className="h-5 w-5" />
              </MenubarTrigger>
              <MenubarContent className="min-w-[200px]">
                <MenubarItem className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/691f613e-b9e0-47ea-8d4e-7f9bf728f3de.png" 
                    alt="NelsonBot Logo" 
                    className="w-6 h-6"
                  />
                  <span className="font-semibold">NelsonBot</span>
                </MenubarItem>
                <MenubarItem className="text-sm text-gray-500">
                  Your Medical Knowledge Assistant
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem onSelect={() => navigate("/")}>
                  Home
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/691f613e-b9e0-47ea-8d4e-7f9bf728f3de.png" 
              alt="NelsonBot Logo" 
              className="w-8 h-8"
            />
            <div className="flex flex-col">
              <span className="font-semibold text-lg">NelsonBot</span>
              <span className="text-xs text-gray-500">Your Medical Knowledge Assistant</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/signin")}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span>Sign Up</span>
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};