"use client";

import React, { useState, useEffect } from 'react';
import './client-globals.css'; // Import client-specific styles
import ClientHeader from './components/header';  // Import the header component (fixed: directory renamed to 'components')
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Clock,
  Settings,
  Headphones,
  Info,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
// Import the authentication context hook for logout functionality
import { useAuth } from "@/components/auth-context";

// Line removed as ThemeProvider is no longer used in this file.
// Interface for sidebar items
interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

// Sidebar item component
const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  active = false,
  onClick,
  collapsed = false
}) => {
  return (
    <div
      className={`sidebar-item flex items-center w-full px-4 py-3 transition-colors duration-200
        ${active ? 'bg-red-900 text-white border-l-4 border-white' : 'text-white hover:bg-red-700 hover:border-0 '}
        cursor-pointer`}
      onClick={onClick}
      style={{ minHeight: '48px' }}
    >
      <span className="flex items-center justify-center">{icon}</span>
      {!collapsed && <span className="ml-3 transition-opacity duration-200">{text}</span>}
    </div>
  );
};

// Main layout component that integrates Sidebar and Header
// ThemeProvider removed (now only in app/layout.tsx)
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, loading } = useAuth(); // Get user information from auth context

  /**
   * Default avatar and user data management
   * Following clean architecture principles with proper state initialization
   */
  // Default avatar URL as specified
  const DEFAULT_AVATAR = "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Background.png";
  
  // State for user data with proper fallback chains
  const [profileImage, setProfileImage] = useState<string>(user?.image || DEFAULT_AVATAR);
  const [userName, setUserName] = useState<string>(user?.name || 'Welcome');
  const [userEmail, setUserEmail] = useState<string>(user?.email || 'Sign in to continue');

  // State for responsive layout (mobile/desktop) and sidebar visibility
  // isMobileView: tracks if current viewport is mobile
  // isSidebarOpen: tracks sidebar visibility (mobile: drawer, desktop: collapse)
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default open on desktop
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Track logout state
  
  // Helper function to get user initials when no profile image is available
  const getUserInitials = () => {
    if (!user?.name) return '👤';
    
    // Split the name and get initials
    const nameParts = user.name.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    
    // Get first and last name initials
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  /**
   * Navigation items updated to match the exact design from the image
   * - Main navigation: Dashboard, Submit Shipment, Shipment History, Settings
   * - Footer navigation: Support, About, log out (lowercase as in design)
   */
  const navItems = [
    // Dashboard entry point with dashboard icon
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/client/dashboard' },
    // Submit Shipment option with package icon
    { icon: <Package size={20} />, text: 'Submit Shipment', path: '/client/submit-shipment' },
    // Shipment History (exact name from design)
    { icon: <Clock size={20} />, text: 'Shipment History', path: '/client/shipment-history' },
    // Settings page with settings icon
    { icon: <Settings size={20} />, text: 'Settings', path: '/client/settings' },
  ];

  // Footer items (excluding logout for custom button)
  const footerItems = [
    { icon: <Headphones size={20} />, text: 'Support', path: '/client/support' },
    { icon: <Info size={20} />, text: 'About', path: '/client/about' },
    // Logout is lowercase in the design image
    { icon: <LogOut size={20} />, text: 'log out', path: '/logout' },
  ];

  // Listen for window resize to detect mobile view
  // Effect: Listen for window resize to update mobile/desktop state
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      // On mobile, sidebar should default to closed for better UX
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /**
   * Toggles sidebar visibility.
   * - On mobile: opens/closes drawer.
   * - On desktop: collapses/expands sidebar.
   */
  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  // We already defined logout in the component scope, so no need to redefine it here

  /**
   * Handles navigation item clicks.
   * For '/logout', calls the logout function and redirects to home.
   * For other paths, navigates normally.
   * Uses async/await for logout to ensure clean flow and SSR safety.
   */
  const handleItemClick = async (path: string) => {
    // Close sidebar on mobile after navigation
    if (isMobileView) setIsSidebarOpen(false);
    if (path === '/logout') {
      try {
        // Await logout for reliability and security
        await logout();
        // Redirect to home after logout
        await router.push('/');
      } catch (err) {
        // Optionally handle/log errors
        console.error('Logout failed:', err);
      }
    } else {
      router.push(path);
    }
  };

  // Helper function to determine if a menu item should be active
  // Explicitly types the parameter and return value for type safety and maintainability
  const isItemActive = (itemPath: string): boolean => {
    // Special handling for the dashboard route: highlights if on /client/dashboard or /client
    if (itemPath === '/client/dashboard' && (pathname === '/client/dashboard' || pathname === '/client')) {
      return true;
    }

    // For other paths, checks if the current pathname exactly matches or starts with the menu item's path
    return pathname === itemPath || pathname.startsWith(itemPath + '/');
  };


  // Add console log for debugging path matching issues
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Current pathname:', pathname);
    }
  }, [pathname]);

  /**
   * Global event handling for cross-component synchronization
   * Follows Observer Pattern from OOP for decoupled communication
   */
  useEffect(() => {
    // Constants for event names - must match those in AccountSettings
    const PROFILE_IMAGE_UPDATED_EVENT = 'profile-image-updated';
    const USER_DATA_UPDATED_EVENT = 'user-data-updated';
    
    // Handler for image update events
    const handleGlobalImageUpdate = (event: CustomEvent<{imageUrl: string}>) => {
      // Update local profile image state
      setProfileImage(event.detail.imageUrl);
      console.log('Layout updated profile image from global event');
    };
    
    // Handler for user data update events
    const handleUserDataUpdate = (event: CustomEvent<{name?: string; email?: string; phone?: string}>) => {
      // Update user data states if provided in the event
      if (event.detail.name) {
        setUserName(event.detail.name);
        console.log('Layout updated user name from global event');
      }
      if (event.detail.email) {
        setUserEmail(event.detail.email);
        console.log('Layout updated user email from global event');
      }
    };
    
    // Add event listeners with proper typing
    window.addEventListener(PROFILE_IMAGE_UPDATED_EVENT, handleGlobalImageUpdate as EventListener);
    window.addEventListener(USER_DATA_UPDATED_EVENT, handleUserDataUpdate as EventListener);
    
    // Cleanup function removes all listeners when component unmounts
    return () => {
      window.removeEventListener(PROFILE_IMAGE_UPDATED_EVENT, handleGlobalImageUpdate as EventListener);
      window.removeEventListener(USER_DATA_UPDATED_EVENT, handleUserDataUpdate as EventListener);
    };
  }, []);

  return (
    <div className="flex h-screen w-full bg-slate-100 dark:bg-slate-900">
      {/* Mobile overlay: closes sidebar when clicked */}
      {isMobileView && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: responsive to mobile/desktop */}
      <div
        className={`
          ${isMobileView
            ? `fixed z-30 top-0 left-0 h-full transition-transform duration-300 ease-in-out shadow-lg ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'relative h-full transition-width duration-300 ease-in-out'
          }
          ${!isSidebarOpen && !isMobileView ? 'w-16' : 'w-60'}
          bg-red-600 text-white
        `}
      >
        <div className="sidebar flex flex-col h-full overflow-hidden">
          {/* Sidebar content */}
          <div className="flex flex-col h-full justify-between">
            {/* Top section with logo and profile */}
            <div>
              {/* Sidebar Header with Logo */}
              <div className="p-4 flex justify-center items-center">
                <h1 className="font-bold text-white text-2xl">
                  Logistics.
                </h1>
                {/* Toggle button - only on mobile */}
                {isMobileView && (
                  <button
                    onClick={toggleSidebar}
                    className="absolute top-1/2 right-2 -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white transition-colors shadow"
                    aria-label="Toggle sidebar"
                  >
                    {!isSidebarOpen ? (
                      <ChevronRight className="text-red-700 transition-transform duration-300" size={24} />
                    ) : (
                      <ChevronLeft className="text-red-700 transition-transform duration-300" size={24} />
                    )}
                  </button>
                )}
              </div>
              
              {/* User profile section - dynamically displays logged-in user's information */}
              <div className="flex flex-col items-center w-full mb-6">
                {/* User avatar - displays user profile image or initials fallback */}
                <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center mb-2 bg-white/20">
                  {profileImage ? (
                    /* Render user's profile image if available */
                    <Image 
                      src={profileImage} 
                      alt={`${user?.name || 'User'} profile`} 
                      width={64} 
                      height={64} 
                      className="object-cover w-full h-full"
                      priority
                      unoptimized={profileImage.startsWith('data:')} /* Allow data URLs for immediate preview */
                    />
                  ) : (
                    /* Render user initials as fallback */
                    <span className="text-xl font-bold text-white">{getUserInitials()}</span>
                  )}
                </div>
                
                {/* User name and email - dynamically populated from auth context */}
                <div className="text-center">
                  <h2 className="font-medium text-lg">{userName}</h2>
                  <p className="text-sm text-white/90">{userEmail}</p>
                </div>
              </div>
              
              {/* Main Navigation Links */}
              <ul className="mt-6 space-y-1">
                {/* Dashboard item with burgundy background when active */}
                <li>
                  <button 
                    onClick={() => handleItemClick('/client/dashboard')} 
                    className={`flex items-center w-full py-3 px-6 ${isItemActive('/client/dashboard') ? 'bg-red-900 border-l-4 border-white' : 'hover:bg-red-700'}`}
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
                    className={`flex items-center w-full py-3 px-6 ${isItemActive('/client/submit-shipment') ? 'bg-red-900 border-l-4 border-white' : 'hover:bg-red-700'}`}
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
                    className={`flex items-center w-full py-3 px-6 ${isItemActive('/client/shipment-history') ? 'bg-red-900 border-l-4 border-white' : 'hover:bg-red-700'}`}
                    disabled={isLoggingOut}
                  >
                    <Clock className="w-6 h-6 mr-3" />
                    <span>Shipment History</span>
                  </button>
                </li>
                
                {/* Settings */}
                <li>
                  <button 
                    onClick={() => handleItemClick('/client/settings')} 
                    className={`flex items-center w-full py-3 px-6 ${isItemActive('/client/settings') ? 'bg-red-900 border-l-4 border-white' : 'hover:bg-red-700'}`}
                    disabled={isLoggingOut}
                  >
                    <Settings className="w-6 h-6 mr-3" />
                    <span>Settings</span>
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Footer Links at bottom of sidebar */}
            <div className="mt-auto">
              <ul className="space-y-1">
                {/* Support */}
                <li>
                  <button 
                    onClick={() => handleItemClick('/client/support')} 
                    className={`flex items-center w-full py-3 px-6 ${isItemActive('/client/support') ? 'bg-red-900 border-l-4 border-white' : 'hover:bg-red-700'}`}
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
                    className={`flex items-center w-full py-3 px-6 ${isItemActive('/client/about') ? 'bg-red-900 border-l-4 border-white' : 'hover:bg-red-700'}`}
                    disabled={isLoggingOut}
                  >
                    <Info className="w-6 h-6 mr-3" />
                    <span>About</span>
                  </button>
                </li>
                
                {/* log out - lowercase as in design */}
                <li>
                  <button 
                    onClick={async () => {
                      setIsLoggingOut(true);
                      try {
                        await logout();
                        await router.push('/');
                      } catch (err) {
                        console.error('Logout failed:', err);
                      } finally {
                        setIsLoggingOut(false);
                      }
                    }}
                    className="flex items-center w-full py-3 px-6 hover:bg-red-700"
                    disabled={isLoggingOut}
                  >
                    <LogOut className="w-6 h-6 mr-3" />
                    <span>log out</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Pass toggleSidebar to header for hamburger menu */}
        <ClientHeader isMobileView={isMobileView} toggleSidebar={toggleSidebar} />
        {/* Main content area grows naturally with content, no fixed or constrained height */}
        <main className="w-full overflow-y-auto bg-slate-50 dark:bg-slate-800">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;