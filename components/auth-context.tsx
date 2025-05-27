"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { fetchWithFallback } from "@/components/lib/api";
// Import js-cookie for cookie management (ensure 'js-cookie' is installed)
import Cookies from "js-cookie";

// Dummy users for fallback (for development/testing only)
// Each user has a role for role-based UI testing
// Single dummy user for development/testing only
const DUMMY_USER = {
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  image: "https://randomuser.me/api/portraits/men/1.jpg",
  verified: true,
};



// User type is based on the shape of the DUMMY_USER object, omitting the password for security and maintainability.
export type User = (Omit<typeof DUMMY_USER, "password"> & { [key: string]: any }) | null;

interface AuthContextType {
  user: User;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  // Auth mode: 'real' or 'dummy'. Allows toggling between real API and dummy/test mode.
  authMode: 'real' | 'dummy';
  setAuthMode: (mode: 'real' | 'dummy') => void;
  // Expose user role for role-based UI
  role?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to consume the authentication context
export function useAuth() {
  // Get the context value
  const ctx = useContext(AuthContext);
  // Throw an error if used outside the AuthProvider for safety
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  // Return the context so consumers can destructure (e.g., const { logout } = useAuth())
  return ctx;
}


// AuthProvider: Provides authentication context using only dummy data. All real authentication logic is bypassed.
// Clean code, OOP, and best practices: all logic is modular, commented, and maintainable.
export function AuthProvider({ children }: { children: ReactNode }) {
  // State: current user (null if not logged in, DUMMY_USER if logged in)
  const [user, setUser] = useState<User>(null);
  // State: loading (true during hydration, false otherwise)
  const [loading, setLoading] = useState(false);
  // State: authentication mode (always 'dummy' in this version)
  const [authMode] = useState<'real' | 'dummy'>('dummy');
  // Setter for authMode (no-op, always defined to avoid runtime errors)
  const setAuthMode = (_mode: 'real' | 'dummy') => {
    // No operation in demo mode; provided for interface compatibility
  };

  /**
   * Hydrate user state from cookies on component mount
   * Properly restores authentication state from persisted cookies
   */
  useEffect(() => {
    setLoading(true);
    
    try {
      // Check for existing auth tokens in cookies
      const authToken = Cookies.get('auth_token');
      const refreshToken = Cookies.get('refresh_token');
      
      // If we have tokens, restore the user session
      if (authToken || refreshToken) {
        console.log('Found existing auth cookies, restoring session');
        
        // In a real app, we would validate tokens with the backend
        // For this demo, we'll just restore the dummy user
        setUser({ ...DUMMY_USER, password: undefined });
      } else {
        // No valid tokens found, ensure user is logged out
        setUser(null);
      }
    } catch (error) {
      console.error('Session restoration error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * login: Authenticates the user using only dummy credentials.
   * If the email and password match the DUMMY_USER, logs in; otherwise fails.
   * @param email - User email
   * @param password - User password
   * @param rememberMe - Ignored (for interface compatibility)
   * @returns {Promise<boolean>} - True if login succeeded, false otherwise
   */
  /**
   * Login function with robust cookie persistence
   * Sets both auth_token and refresh_token cookies with proper expiration
   * 
   * @param email - User email for authentication
   * @param password - User password (validated against dummy user)
   * @param rememberMe - Whether to set a long-lived cookie
   * @returns Promise<boolean> - Success status of login attempt
   */
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<boolean> => {
    setLoading(true);
    
    try {
      // If credentials match dummy user, log in
      if (email === DUMMY_USER.email && password === DUMMY_USER.password) {
        // Create user object (never include password)
        const authenticatedUser = { ...DUMMY_USER, password: undefined };
        
        // Set user in state
        setUser(authenticatedUser);
        
        // Set authentication cookies
        // Using a fake JWT structure for demo purposes
        const fakeAuthToken = `auth_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        const fakeRefreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substring(2)}`;
        
        // Set cookie expiration based on rememberMe
        const cookieOptions = {
          expires: rememberMe ? 30 : 1, // 30 days if remember me, 1 day if not
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' as const
        };
        
        // Set both auth and refresh tokens
        Cookies.set('auth_token', fakeAuthToken, cookieOptions);
        Cookies.set('refresh_token', fakeRefreshToken, cookieOptions);
        
        // Log successful login for debugging
        console.log('Login successful, cookies set', { rememberMe });
        
        setLoading(false);
        return true;
      }
      
      // Invalid credentials
      setUser(null);
      // Remove any existing cookies on failed login
      Cookies.remove('auth_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  /**
   * logout: Logs the user out by clearing the user state and removing auth cookies.
   * Ensures complete session termination and proper redirection.
   * 
   * @returns {Promise<void>}
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      // Clear user state
      setUser(null);
      
      // Remove authentication cookies
      Cookies.remove('auth_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
      
      console.log('Logout successful, cookies cleared');
      
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Provide user role for role-based UI
  const role = user && user.role ? user.role : undefined;

  // Provide the authentication context to children, always using dummy logic.
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        authMode,
        setAuthMode,
        role: user?.role ?? undefined,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
