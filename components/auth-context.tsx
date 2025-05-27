"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

/**
 * DUMMY_USER Configuration
 * 
 * Comprehensive mock user object for development and testing environments.
 * Follows enterprise standards for user modeling with all necessary properties.
 * 
 * @author Senior Software Engineer
 * @version 1.0.0
 */
const DUMMY_USER = {
  id: "user-001",
  name: "Austin Bediako",
  email: "austin@logistics.com",
  password: "password123", // Never stored in production, only for development
  image: "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Background.png",
  role: "client",
  verified: true,
  firstName: "Austin",
  lastName: "Bediako",
  phoneNumber: "+1 (555) 123-4567",
  address: "2000 Global Trade Plaza",
  city: "Wilmington",
  state: "Delaware",
  zip: "19801",
  country: "United States",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  preferences: {
    notifications: true,
    theme: "light"
  }
};

// User type is based on the shape of the DUMMY_USER object, omitting the password for security
export type User = (Omit<typeof DUMMY_USER, "password"> & { [key: string]: any }) | null;

// Define the shape of our authentication context
interface AuthContextType {
  user: User;
  loading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  authMode: 'real' | 'dummy';
  setAuthMode: (mode: 'real' | 'dummy') => void;
  role: string;
}

// Create the context with undefined default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to consume the authentication context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/**
 * AuthProvider Component
 * 
 * Central authentication manager following clean architecture principles.
 * Implements Observer pattern for cross-component communication.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // State management
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthModeInternal] = useState<'real' | 'dummy'>('dummy');
  
  // Event constants for global synchronization
  const USER_AUTH_CHANGED = 'user-auth-changed';
  const USER_DATA_UPDATED = 'user-data-updated';
  
  /**
   * Dispatches an event when auth state changes to synchronize components
   */
  const dispatchAuthStateChanged = (currentUser: User) => {
    window.dispatchEvent(new CustomEvent(USER_AUTH_CHANGED, { 
      detail: { user: currentUser } 
    }));
  };

  /**
   * Dispatches an event when user data changes to synchronize components
   */
  const dispatchUserDataUpdated = (userData: { name?: string; email?: string; image?: string }) => {
    window.dispatchEvent(new CustomEvent(USER_DATA_UPDATED, { 
      detail: userData 
    }));
  };

  /**
   * Updates authentication mode with validation
   */
  const setAuthMode = (mode: 'real' | 'dummy') => {
    if (mode !== authMode) {
      console.log(`Switching auth mode: ${authMode} -> ${mode}`);
      setAuthModeInternal(mode);
    }
  };

  /**
   * Hydrates user state from cookies on component mount
   */
  useEffect(() => {
    const hydrateUserState = async () => {
      setLoading(true);
      
      try {
        // Check for existing auth tokens in cookies
        const authToken = Cookies.get('auth_token');
        const refreshToken = Cookies.get('refresh_token');
        
        // If we have tokens, restore the user session
        if (authToken || refreshToken) {
          console.log('Found existing auth cookies, restoring session');
          
          // For demo, just use the dummy user without password
          const authenticatedUser = { ...DUMMY_USER };
          delete (authenticatedUser as any).password;
          
          // Update state
          setUser(authenticatedUser);
          dispatchAuthStateChanged(authenticatedUser);
        } else {
          // No valid tokens found
          setUser(null);
          dispatchAuthStateChanged(null);
        }
      } catch (error) {
        console.error('Session restoration error:', error);
        setUser(null);
        dispatchAuthStateChanged(null);
      } finally {
        setLoading(false);
      }
    };
    
    hydrateUserState();
  }, []);

  /**
   * Login function with comprehensive cookie persistence
   */
  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<boolean> => {
    setLoading(true);
    
    try {
      console.log(`Authentication attempt: ${email}`);
      
      // Case-insensitive email comparison for better UX
      if (email.toLowerCase() === DUMMY_USER.email.toLowerCase() && 
          password === DUMMY_USER.password) {
          
        // Create authenticated user (never include password)
        const authenticatedUser = { ...DUMMY_USER };
        delete (authenticatedUser as any).password;
        
        // Generate tokens
        const tokenTimestamp = Date.now();
        const tokenNonce = Math.random().toString(36).substring(2);
        const fakeAuthToken = `auth_${tokenTimestamp}_${tokenNonce}`;
        const fakeRefreshToken = `refresh_${tokenTimestamp}_${tokenNonce}`;
        
        // Set cookie options
        const cookieOptions = {
          expires: rememberMe ? 30 : 1, // days
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' as const
        };
        
        // Set authentication cookies
        Cookies.set('auth_token', fakeAuthToken, cookieOptions);
        Cookies.set('refresh_token', fakeRefreshToken, cookieOptions);
        
        // Update state
        setUser(authenticatedUser);
        dispatchAuthStateChanged(authenticatedUser);
        dispatchUserDataUpdated({
          name: authenticatedUser.name,
          email: authenticatedUser.email,
          image: authenticatedUser.image
        });
        
        console.log('Login successful', { email: authenticatedUser.email });
        setLoading(false);
        return true;
      }
      
      // Invalid credentials
      console.warn('Login failed: Invalid credentials');
      setUser(null);
      dispatchAuthStateChanged(null);
      
      // Clean up any existing cookies
      Cookies.remove('auth_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      dispatchAuthStateChanged(null);
      
      // Clean up cookies on error
      Cookies.remove('auth_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
      
      setLoading(false);
      return false;
    }
  };

  /**
   * Logout function with comprehensive cleanup
   */
  const logout = async (): Promise<void> => {
    setLoading(true);
    
    try {
      console.log('Logout initiated');
      
      // Clear state
      setUser(null);
      dispatchAuthStateChanged(null);
      
      // Remove cookies
      Cookies.remove('auth_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
      
      console.log('Logout successful');
      
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      
      // Force logout even on error
      setUser(null);
      dispatchAuthStateChanged(null);
      Cookies.remove('auth_token', { path: '/' });
      Cookies.remove('refresh_token', { path: '/' });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Effect to refresh auth state when requested by other components
   */
  useEffect(() => {
    const handleAuthRefresh = () => {
      if (user) {
        const refreshedUser = { ...user };
        (refreshedUser as any).updatedAt = new Date().toISOString();
        setUser(refreshedUser);
        dispatchAuthStateChanged(refreshedUser);
      }
    };
    
    window.addEventListener('auth-refresh-requested', handleAuthRefresh);
    
    return () => {
      window.removeEventListener('auth-refresh-requested', handleAuthRefresh);
    };
  }, [user]);

  // Provide context to children
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        authMode,
        setAuthMode,
        role: user?.role || ''
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
