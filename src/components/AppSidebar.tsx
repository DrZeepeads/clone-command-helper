import { useNavigate } from "react-router-dom";
import { Activity, BookOpen, FileText, User, MessageSquare, HelpCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Pediatric Diagnosis",
    icon: Activity,
    url: "/diagnosis"
  },
  {
    title: "Treatment Protocols",
    icon: FileText,
    url: "/protocols"
  },
  {
    title: "Medical Resources",
    icon: BookOpen,
    url: "/resources"
  },
  {
    title: "Patient Management",
    icon: User,
    url: "/patients"
  },
  {
    title: "Chat with AI",
    icon: MessageSquare,
    url: "/"
  },
  {
    title: "FAQs/Help",
    icon: HelpCircle,
    url: "/help"
  }
];

export function AppSidebar() {
  const navigate = useNavigate();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <item.icon className="h-5 w-5 text-gray-600" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}