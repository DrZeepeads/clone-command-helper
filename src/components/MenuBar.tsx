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
import { Menu } from "lucide-react";

export const MenuBar = () => {
  const navigate = useNavigate();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
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
          <MenubarSeparator />
          <MenubarItem onSelect={() => navigate("/signin")}>
            Sign In
          </MenubarItem>
          <MenubarItem onSelect={() => navigate("/signup")}>
            Sign Up
          </MenubarItem>
          <MenubarItem onSelect={handleSignOut}>
            Sign Out
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};