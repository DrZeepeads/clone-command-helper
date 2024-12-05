import { useNavigate } from "react-router-dom";
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
        </div>
      </div>
    </nav>
  );
};