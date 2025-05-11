import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


/// ICON LOGO PART
// images.d.ts or declarations.d.ts
// declare module '*.png' {
//   const value: import('next/image').StaticImageData;
//   export default value;
// }



// import Image from 'next/image';
// import SWAP_SHOP_logo from './SWAP_SHOP_logo.png'; // ✅ no JSX here, just a regular import
// import Link from 'next/link';


// TILL HERE

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Get unread message count
  const { data: unreadMessages } = useQuery({
    queryKey: ["/api/messages/unread"],
    queryFn: getUnreadMessageCount,
    enabled: !!user,
  });

  function getUnreadMessageCount() {
    return fetch("/api/messages/unread", {
      credentials: "include",
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch unread message count");
      }
      return res.json();
    });
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {/* <i className="ri-store-2-fill text-primary text-2xl mr-2"></i> */}
              
              <i className="ri-shopping-cart-line text-primary text-2xl mr-2"></i>

              {/* Logo part */}

              <span className="text-xl font-bold text-primary">SWAP SHOP</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search for items..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-2 text-gray-400 hover:text-primary">
                <i className="ri-search-line text-lg"></i>
              </button>
            </form>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              <i className="ri-search-line text-lg"></i>
            </button>

            {user ? (
              <>
                <Link href="/messages">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral relative">
                    <i className="ri-message-2-line text-lg"></i>
                    {unreadMessages?.count > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                        {unreadMessages.count}
                      </span>
                    )}
                  </div>
                </Link>
                <Link href="/create-listing">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral">
                    <i className="ri-add-circle-line text-lg"></i>
                  </div>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar} alt={user.username} />
                        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        Your Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=listings" className="cursor-pointer">
                        Your Listings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile?tab=settings" className="cursor-pointer">
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="default" className="ml-2">
                Sign In
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar - Mobile */}
        {showMobileSearch && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search for items..."
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-2 text-gray-400 hover:text-primary">
                <i className="ri-search-line text-lg"></i>
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
