import { Home, ClipboardList, TrendingUp, BookOpen, User, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Assessments", url: "/assessment/technical", icon: ClipboardList },
  { title: "Career Path", url: "/career-path", icon: TrendingUp },
  { title: "Upskilling", url: "/upskilling", icon: BookOpen },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/auth");
    }
  };

  return (
    <Sidebar className={open ? "w-64" : "w-16"}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={!open ? "justify-center" : ""}>
            {open && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 ${
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted/50"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleSignOut} className="flex items-center gap-3 hover:bg-muted/50">
                  <LogOut className="h-4 w-4" />
                  {open && <span>Sign Out</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
