import { useState } from "react";
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
import { 
  UserCircle2, 
  BookMarked, 
  CheckSquare, 
  LogOut, 
  ShieldAlert, 
  Menu, 
  X, 
  BarChart2 
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose 
} from "@/components/ui/sheet";
import { cn } from "@/utils/cn";

export default function Header() {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return "";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  };

  return (
    <>
      <header className="bg-primary text-white shadow-md fixed w-full top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl md:text-2xl font-heading font-bold">NEET Master</Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
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
                <div className="mr-4">
                  <span className="text-sm block">Hello,</span>
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center p-0 border-0"
                    >
                      <span className="text-sm font-medium">{getUserInitials()}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Link href="/profile" className="w-full">
                      <DropdownMenuItem className="cursor-pointer">
                        <UserCircle2 className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/dashboard" className="w-full">
                      <DropdownMenuItem className="cursor-pointer">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        <span>My Dashboard</span>
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
                    {user.isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <Link href="/admin" className="w-full">
                          <DropdownMenuItem className="cursor-pointer">
                            <ShieldAlert className="mr-2 h-4 w-4" />
                            <span>Admin Dashboard</span>
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
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
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <div className="py-4 flex flex-col h-full">
                  <div className="flex-1 py-6">
                    {user ? (
                      <>
                        <div className="flex items-center mb-6 pb-6 border-b">
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
                            <span className="text-md font-medium">{getUserInitials()}</span>
                          </div>
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <SheetClose asChild>
                            <Link href="/profile" className="block py-2 px-3 rounded-md hover:bg-accent">
                              <div className="flex items-center">
                                <UserCircle2 className="mr-2 h-5 w-5" />
                                <span>My Profile</span>
                              </div>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link href="/dashboard" className="block py-2 px-3 rounded-md hover:bg-accent">
                              <div className="flex items-center">
                                <BarChart2 className="mr-2 h-5 w-5" />
                                <span>My Dashboard</span>
                              </div>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link href="/tasks" className="block py-2 px-3 rounded-md hover:bg-accent">
                              <div className="flex items-center">
                                <CheckSquare className="mr-2 h-5 w-5" />
                                <span>My Tasks</span>
                              </div>
                            </Link>
                          </SheetClose>
                          <SheetClose asChild>
                            <Link href="/bookmarks" className="block py-2 px-3 rounded-md hover:bg-accent">
                              <div className="flex items-center">
                                <BookMarked className="mr-2 h-5 w-5" />
                                <span>Bookmarked Questions</span>
                              </div>
                            </Link>
                          </SheetClose>
                          {user.isAdmin && (
                            <SheetClose asChild>
                              <Link href="/admin" className="block py-2 px-3 rounded-md hover:bg-accent">
                                <div className="flex items-center">
                                  <ShieldAlert className="mr-2 h-5 w-5" />
                                  <span>Admin Dashboard</span>
                                </div>
                              </Link>
                            </SheetClose>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col gap-3 py-4">
                        <SheetClose asChild>
                          <Link href="/auth">
                            <Button className="w-full" variant="default">Login</Button>
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/auth">
                            <Button className="w-full" variant="outline">Register</Button>
                          </Link>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                  {user && (
                    <div className="border-t pt-4">
                      <Button 
                        onClick={handleLogout} 
                        variant="ghost" 
                        className="w-full justify-start"
                      >
                        <LogOut className="mr-2 h-5 w-5" />
                        <span>Logout</span>
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {/* Spacer div to push content below the fixed header */}
      <div className="h-[48px] md:h-[56px]"></div>
    </>
  );
}
