import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Internships", path: "/internships" },
    { name: "Courses", path: "/courses" },
    { name: "Units", path: "/units" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex justify-center">
          <a href="/">
            <img
              src="public/logo.png"
              alt="Company Logo"
              className="h-5 w-auto cursor-pointer"
            />
          </a>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              className={`text-sm font-medium ${
                isActive(item.path)
                  ? "text-primary border-b-2 border-primary rounded-none"
                  : "text-black"
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </Button>
          ))}
        </div>

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
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </div>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          {/* User Avatar */}
          <div className="flex items-center space-x-2">
            <div className="flex flex-col space-y-1">
              <div className="w-4 h-0.5 bg-black rounded-full"></div>
              <div className="w-4 h-0.5 bg-black rounded-full"></div>
              <div className="w-4 h-0.5 bg-black rounded-full"></div>
            </div>
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;