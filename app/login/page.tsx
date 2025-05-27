/**
 * Login Page Component - Server Component
 * 
 * This component follows Next.js best practices for handling client-side interactivity
 * by using a proper architecture with Suspense boundaries for hooks like useSearchParams().
 * 
 * [2025-05-27] Refactored to fix Vercel build errors with static site generation
 * -- Senior Engineer
 */

import React, { Suspense } from "react";
import LoginClientPage from "./client-page";

/**
 * Static loading fallback displayed during client component hydration
 * Provides a visually consistent loading experience
 */
function LoginLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="animate-pulse text-lg font-medium">Loading login page...</div>
    </div>
  );
}

/**
 * Main LoginPage component that properly handles client-side hydration
 * with Suspense boundaries to prevent SSG errors in production builds
 * 
 * This pattern follows Facebook's production architecture for Next.js applications
 * with proper separation between server and client components
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginClientPage />
    </Suspense>
  );
}
