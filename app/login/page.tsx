"use client";

/**
 * Login Page Component
 * 
 * Handles user authentication and proper redirection after login
 * Supports callbackUrl for redirecting users back to their intended destination
 * 
 * [2025-05-27] Fixed black screen issue by properly handling callbackUrl parameter
 * -- Senior Engineer
 */

import React, { useState, FormEvent, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { TruckIcon, LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import RegisterBackground from "@/public/deliveryparcel.jpg";
import { useAuth } from "@/components/auth-context";
import { useRouter, useSearchParams } from "next/navigation"; // Add useSearchParams

/**
 * LoginPage Component - Handles user authentication and redirection
 */
export default function LoginPage() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Authentication and routing hooks
  const { login, loading, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Extract callback URL from search parameters (for redirect after login)
  const callbackUrl = searchParams?.get('callbackUrl') || '/client/dashboard';
  
  // Redirect if user is already authenticated
  // Use a ref to track whether a redirect has been attempted to prevent infinite loops
  const hasRedirected = useRef(false);
  
  useEffect(() => {
    // Only redirect if user is authenticated, not loading, and we haven't redirected yet
    if (!loading && user && !hasRedirected.current) {
      // Mark that we've attempted a redirect
      hasRedirected.current = true;
      
      // Decode the URL if it's encoded
      const decodedUrl = callbackUrl.startsWith('/') ? callbackUrl : decodeURIComponent(callbackUrl);
      
      // Use the callback URL if available, otherwise default to dashboard
      console.log('Redirecting to:', decodedUrl);
      
      // Force a hard navigation instead of a client-side transition
      window.location.href = decodedUrl;
    }
  }, [user, loading, callbackUrl]);

  /**
   * Handle login form submission
   * Validates input, attempts login, and handles errors
   * @param e - Form submit event
   */
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate form input
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Attempt login
    setIsLoading(true);
    const ok = await login(email, password, rememberMe);
    
    // Handle login result
    if (!ok) {
      setError("Invalid email or password. Please try again.");
    } else {
      // Successful login - handle redirect via useEffect
      // Don't call router.replace here as it can create race conditions
      console.log('Login successful, awaiting redirect');
    }
    
    setIsLoading(false);
  };

  // Show loading state while authentication state is being determined
  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="animate-pulse text-lg font-medium">Loading...</div>
    </div>
  );
  
  // If user is already authenticated, show loading while redirect happens
  // Don't return null as this causes the black screen
  if (user) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="animate-pulse text-lg font-medium">Redirecting to dashboard...</div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main
        className="flex-1 flex items-center justify-center px-4 py-12 bg-cover bg-center bg-no-repeat"
        style={{
          minHeight: "calc(100vh - 140px)",
          backgroundImage: "url('/login.jpg')",
        }}
      >
        <div className="w-full max-w-5xl mx-auto">
          <Card className="border-0 shadow-xl overflow-hidden rounded-2xl grid md:grid-cols-2">
            {/* Left side - Image */}
            <div className="relative h-64 md:h-full">
              <Image
                src={RegisterBackground}
                alt="Logistics background"
                placeholder="blur"
                className="object-cover object-center"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-red-700/40 to-red-900/40 mix-blend-multiply" />
              {/* <div className="absolute inset-0 flex flex-col justify-center items-center text-white p-6">
                <TruckIcon size={48} className="mb-4" />
                <h2 className="text-3xl font-bold text-center mb-2">Fast Delivery Services</h2>
                <p className="text-lg text-center max-w-xs">Your trusted partner for reliable shipping solutions</p>
              </div> */}
            </div>

            {/* Right side - Form */}
            <div className="p-6 md:p-8 bg-white dark:bg-slate-800">
              <CardHeader className="px-0 pb-4">
                <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-300">
                  Sign in to your personal account
                </CardDescription>
              </CardHeader>

              <CardContent className="px-0">
                {error && (
                  <Alert
                    variant="destructive"
                    className="mb-4 bg-red-50 dark:bg-red-900/20"
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 dark:text-slate-200"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-slate-700 dark:text-slate-200"
                      >
                        Password
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-red-600 hover:underline hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) =>
                        setRememberMe(checked === true)
                      }
                      className="text-red-600 border-slate-300 dark:border-slate-500"
                    />
                    <Label
                      htmlFor="remember-me"
                      className="text-sm text-slate-600 dark:text-slate-300"
                    >
                      Remember me for 30 days
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-red-600 hover:bg-red-700 transition-all text-white shadow-md"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-5 h-5 border-2 border-red-300 border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4 pt-2 px-0">
                <Separator className="my-2 bg-slate-200 dark:bg-slate-700" />
                <div className="text-sm text-center w-full text-slate-600 dark:text-slate-300">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-red-600 hover:underline font-semibold dark:text-red-400"
                  >
                    Create account
                  </Link>
                </div>
              </CardFooter>
            </div>
          </Card>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
