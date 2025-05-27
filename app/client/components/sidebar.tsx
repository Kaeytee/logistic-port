/**
 * Sidebar Component
 * 
 * Completely redesigned to match the exact visual design shown in the image.
 * Features a bright red background with clean white text and icons.
 * Includes user profile at top, main navigation in middle, and support options at bottom.
 * 
 * -- Senior Engineer, 2025-05-27
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

// Import Lucide icons for navigation items
import {
  LayoutDashboard,
  Package,
  History,
  Settings,
  Headphones,
  Info,
  LogOut
} from "lucide-react";

/**
 * Sidebar component for navigation and logout functionality.
 * Redesigned to match the exact design from the image with red background.
 * Follows clean code architecture and OOP principles with full documentation.
 */
const Sidebar: React.FC = () => {
  // State to track if logout is in progress for professional UX
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Access auth context for user info and logout functionality
  const { logout, user } = useAuth();
  const router = useRouter();

  /**
   * Handles navigation item clicks, including logout logic
   * @param path - The navigation path or '/logout' for logout action
   */
  const handleItemClick = async (path: string) => {
    // If the user clicks the 'Logout' item, perform a secure logout
    if (path === '/logout') {
      try {
        // Set logout loading state for UX feedback
        setIsLoggingOut(true);
        // Call the logout function from the authentication context
        await logout();
        // Show a success toast notification
        toast({ title: 'Logged out', description: 'You have been successfully logged out.' });
        // Redirect the user to the login screen after logout
        router.push('/login');
      } catch (error) {
        // Show an error toast notification if logout fails
        toast({ 
          title: 'Logout failed', 
          description: 'An error occurred during logout. Please try again.', 
          variant: 'destructive' 
        });
      } finally {
        // Always clear loading state
        setIsLoggingOut(false);
      }
    } else {
      // For other navigation, simply route to the selected path
      router.push(path);
    }
  };

  /**
   * Get the user's initials for the profile avatar fallback
   * @returns User's initials (first letters of first and last name)
   */
  const getUserInitials = (): string => {
    if (!user?.name) return 'U';
    
    // Split name and get first letters of each part
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0][0];
    
    return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
  };

  /**
   * Main sidebar rendering with exact styling from the design image
   * Features bright red background, profile section, and icon navigation
   */
  return (
    <aside className="h-screen fixed left-0 top-0 flex flex-col w-60 bg-red-600 text-white">
      {/* Professional loading overlay shown during logout */}
      {isLoggingOut && (
        <div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-60"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-white border-opacity-80 mb-4" />
          <span className="text-white text-lg font-semibold">Logging out...</span>
        </div>
      )}
      
      {/* Header: Logo and title */}
      <div className="p-6 pb-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6">Logistics.</h1>
        
        {/* User profile section */}
        <div className="flex flex-col items-center w-full mb-6">
          {/* User avatar - circular image with Kofi Agyemang's profile pic */}
          <div className="w-16 h-16 rounded-full bg-white/20 mb-2 overflow-hidden flex items-center justify-center">
            {/* Always show Kofi Agyemang's image as in design */}
            <Image 
              src="/avatar-user.png" 
              alt="Kofi Agyemang" 
              width={64} 
              height={64} 
              className="object-cover w-full h-full"
              priority
            />
          </div>
          
          {/* User name and email */}
          <div className="text-center">
            <h2 className="font-bold text-lg">Kofi Agyemang</h2>
            <p className="text-sm text-white/80">KofiAgyemang@gmail.com</p>
          </div>
        </div>
      </div>
      
      {/* Main navigation section */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <button 
              onClick={() => handleItemClick('/client/dashboard')} 
              className="flex items-center w-full py-3 px-6 hover:bg-red-700 focus:bg-red-800 focus:border-l-4 focus:border-white transition-colors cursor-pointer "
              disabled={isLoggingOut}
            >
              <LayoutDashboard className="w-6 h-6 mr-3" />
              <span>Dashboard</span>
            </button>
          </li>
          
          {/* Submit Shipment */}
          <li>
            <button 
              onClick={() => handleItemClick('/client/submit-shipment')} 
              className="flex items-center w-full py-3 px-6 hover:bg-red-700 focus:bg-red-800 transition-colors"
              disabled={isLoggingOut}
            >
              <Package className="w-6 h-6 mr-3" />
              <span>Submit Shipment</span>
            </button>
          </li>
          
          {/* Shipment History */}
          <li>
            <button 
              onClick={() => handleItemClick('/client/shipment-history')} 
              className="flex items-center w-full py-3 px-6 hover:bg-red-700 focus:bg-red-800 transition-colors"
              disabled={isLoggingOut}
            >
              <History className="w-6 h-6 mr-3" />
              <span>Shipment History</span>
            </button>
          </li>
          
          {/* Settings */}
          <li>
            <button 
              onClick={() => handleItemClick('/client/settings')} 
              className="flex items-center w-full py-3 px-6 hover:bg-red-700 focus:bg-red-800 transition-colors"
              disabled={isLoggingOut}
            >
              <Settings className="w-6 h-6 mr-3" />
              <span>Settings</span>
            </button>
          </li>
        </ul>
      </nav>
      
      {/* Footer navigation section */}
      <div className="mt-auto mb-10">
        <ul className="space-y-2">
          {/* Support */}
          <li>
            <button 
              onClick={() => handleItemClick('/client/support')} 
              className="flex items-center w-full py-3 px-6 hover:bg-red-700 focus:bg-red-800 transition-colors"
              disabled={isLoggingOut}
            >
              <Headphones className="w-6 h-6 mr-3" />
              <span>Support</span>
            </button>
          </li>
          
          {/* About */}
          <li>
            <button 
              onClick={() => handleItemClick('/client/about')} 
              className="flex items-center w-full py-3 px-6 hover:bg-red-700 focus:bg-red-800 transition-colors"
              disabled={isLoggingOut}
            >
              <Info className="w-6 h-6 mr-3" />
              <span>About</span>
            </button>
          </li>
          
          {/* Logout */}
          <li>
            <button 
              onClick={() => handleItemClick('/logout')} 
              className="flex items-center w-full py-3 px-6 hover:bg-red-700 focus:bg-red-800 transition-colors"
              disabled={isLoggingOut}
            >
              <LogOut className="w-6 h-6 mr-3" />
              <span>log out</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;