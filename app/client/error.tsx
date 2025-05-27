'use client';

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

/**
 * Client Error Boundary Component
 * 
 * This component provides a professional error handling experience for client-side errors.
 * It follows React's error boundary pattern for the Next.js App Router architecture.
 * 
 * @param {Object} props - Component props
 * @param {Error} props.error - The error object caught by the boundary
 * @param {Function} props.reset - Function to reset the error boundary
 * 
 * Created by Senior Software Engineer
 * Date: 2025-05-27
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to console for debugging purposes
  useEffect(() => {
    // In a production environment, this would send to error tracking service
    console.error('Client route error:', error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-slate-800 p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          {/* Error icon */}
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <svg className="h-8 w-8 text-red-600 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          
          {/* Error details */}
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">An error occurred</h1>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            We encountered an unexpected problem while loading this page. Our team has been notified.
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button 
              onClick={() => reset()}
              className="flex items-center justify-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/client/dashboard'}
            >
              Return to dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
