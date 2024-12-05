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
import { toast } from "@/components/ui/use-toast";

export const MenuBar = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast({
        title: "Signed out successfully",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        variant: "destructive",
        duration: 2000,
      });
    }
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
            
            {/* Logo and Slogan */}
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/691f613e-b9e0-47ea-8d4e-7f9bf728f3de.png" 
                alt="NelsonBot Logo" 
                className="w-8 h-8"
              />
              <div className="hidden sm:flex flex-col">
                <span className="font-semibold text-lg">NelsonBot</span>
                <span className="text-xs text-gray-500">Your Medical Knowledge Assistant</span>
              </div>
            </div>
          </div>

          {/* Right side - Auth Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/signin")}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Up</span>
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};