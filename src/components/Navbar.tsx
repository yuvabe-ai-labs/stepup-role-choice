import { Search, Bell, Menu, User, FileText, MessageSquare, HelpCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-2.png";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Fetch user role and profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserRole(null);
        setAvatarUrl(null);
        setProfileId(null);
        return;
      }

      try {
        // First, get the user's profile and role
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("user_id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          return;
        }

        if (!profileData) {
          return;
        }

        setUserRole(profileData.role);
        setProfileId(profileData.id);

        // Then, fetch the avatar based on role
        if (profileData.role === "student") {
          const { data: studentData, error: studentError } = await supabase
            .from("student_profiles")
            .select("avatar_url")
            .eq("profile_id", profileData.id)
            .maybeSingle();

          if (studentError) {
            console.error("Error fetching student avatar:", studentError);
            return;
          }

          setAvatarUrl(studentData?.avatar_url || null);
        } else if (profileData.role === "unit") {
          const { data: unitData, error: unitError } = await supabase
            .from("units")
            .select("avatar_url")
            .eq("profile_id", profileData.id)
            .maybeSingle();

          if (unitError) {
            console.error("Error fetching unit avatar:", unitError);
            return;
          }

          setAvatarUrl(unitData?.avatar_url || null);
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [user]);

  const allNavItems = [
    { name: "Internships", path: "/internships" },
    { name: "Courses", path: "/courses" },
    { name: "Units", path: "/units" },
  ];

  // Filter navigation items based on user role
  const navItems = userRole === "unit" ? [] : allNavItems;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Handle profile navigation based on user role
  const handleProfileClick = () => {
    if (userRole === "unit") {
      navigate("/unit-profile");
    } else {
      navigate("/profile");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-20">
        {/* Logo */}
        <div className="flex justify-center">
          <a href="/dashboard">
            <img src={logo} alt="Company Logo" className="h-5 w-auto cursor-pointer" />
          </a>
        </div>

        {/* Navigation Links - Only show if user is not a unit */}
        {navItems.length > 0 && (
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                className={`text-sm font-medium ${isActive(item.path) ? "text-primary rounded-none" : "text-black"}`}
                onClick={() => navigate(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </div>
        )}

        {/* Search and User Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-10 w-64 bg-white border border-gray-300 rounded-full"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <Bell className="h-5 w-5 text-black fill-black" />
            {/* <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span> */}
          </div>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* User Avatar with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-between bg-[var(--indigo-50,#F0F5FF)] rounded-full pl-3 pr-1 gap-2 py-1.5 shadow-sm w-fit">
                {/* Three Bars */}
                <div className="flex flex-col justify-center space-y-[3px] m-1.5">
                  {/* Line 1 - Left aligned, half width */}
                  <div className="h-[3px] w-3 bg-gray-500 rounded-full self-start"></div>

                  {/* Line 2 - Wider middle line */}
                  <div className="h-[3px] w-[26px] bg-gray-500 rounded-full mx-auto"></div>

                  {/* Line 3 - Right aligned, half width */}
                  <div className="h-[3px] w-3 bg-gray-500 rounded-full self-end"></div>
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10 border-1 border-white shadow-md">
                  <AvatarImage src={avatarUrl || undefined} alt={user?.email || "User"} />
                  <AvatarFallback className="text-sm bg-[#F8F6F2] text-gray-800">
                    {user?.email?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-lg">
              <DropdownMenuItem
                onClick={handleProfileClick}
                className="cursor-pointer hover:!text-blue-500 hover:bg-transparent focus:bg-transparent transition-colors [&_svg]:hover:!text-blue-500"
              >
                <User className="mr-2 h-4 w-4" />
                <span>My Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigate("")}
                className="cursor-pointer hover:!text-blue-500 hover:bg-transparent focus:bg-transparent transition-colors [&_svg]:hover:!text-blue-500"
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>My Tasks</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("")}
                className="cursor-pointer hover:!text-blue-500 hover:bg-transparent focus:bg-transparent transition-colors [&_svg]:hover:!text-blue-500"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>Feedbacks</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("")}
                className="cursor-pointer hover:!text-blue-500 hover:bg-transparent focus:bg-transparent transition-colors [&_svg]:hover:!text-blue-500"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("")}
                className="cursor-pointer hover:!text-blue-500 hover:bg-transparent focus:bg-transparent transition-colors [&_svg]:hover:!text-blue-500"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-red-600 focus:bg-transparent focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
