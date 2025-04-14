import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserCircle2, BookMarked, CheckSquare, LogOut } from "lucide-react";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-heading font-bold">NEET Master</Link>
        <div className="flex items-center">
          {!user ? (
            <div className="flex items-center space-x-4">
              <Link href="/auth">
                <Button variant={location === "/auth" ? "secondary" : "link"} className="text-white hover:text-gray-200">
                  Login
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="secondary" className="text-primary bg-white hover:bg-gray-100">
                  Register
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="mr-4 hidden sm:block">
                <span className="text-sm block">Hello,</span>
                <span className="font-medium">{user.firstName} {user.lastName}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center p-0 border-0"
                  >
                    <span className="text-lg font-medium">{getUserInitials()}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <Link href="/profile" className="w-full">
                    <DropdownMenuItem className="cursor-pointer">
                      <UserCircle2 className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/tasks" className="w-full">
                    <DropdownMenuItem className="cursor-pointer">
                      <CheckSquare className="mr-2 h-4 w-4" />
                      <span>My Tasks</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/bookmarks" className="w-full">
                    <DropdownMenuItem className="cursor-pointer">
                      <BookMarked className="mr-2 h-4 w-4" />
                      <span>Bookmarked Questions</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
