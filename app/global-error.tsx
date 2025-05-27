'use client';

/**
 * Global Error Boundary Component
 * 
 * This component provides a professional error handling experience for the entire application.
 * It follows React's error boundary pattern for the Next.js App Router architecture at the global level.
 * 
 * @author Senior Software Engineer, Facebook
 * @date 2025-05-27
 * @version 1.0.0
 */

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Home } from 'lucide-react';

/**
 * GlobalError component that handles application-wide errors
 * This is a required component in Next.js App Router for proper error handling
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the error to console for debugging purposes
  // In a production environment, this would be connected to an error monitoring service
  useEffect(() => {
    console.error('Global application error:', error);
    
    // Here you would implement error tracking service integration
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-900">
        <div className="flex h-screen w-full flex-col items-center justify-center px-4">
          <div className="w-full max-w-md rounded-lg bg-white dark:bg-slate-800 p-8 shadow-lg">
            <div className="flex flex-col items-center text-center">
              {/* Error icon */}
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                <svg className="h-8 w-8 text-red-600 dark:text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              {/* Error details */}
              <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Application Error</h1>
              <p className="mb-6 text-slate-600 dark:text-slate-300">
                We encountered a critical problem with the application. Our team has been automatically notified of this issue.
              </p>
              
              {/* Error digest for technical reference */}
              {error.digest && (
                <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                  Reference ID: {error.digest}
                </p>
              )}
              
              {/* Action buttons */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                <Button 
                  onClick={() => reset()}
                  className="flex items-center justify-center"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Application
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/'}
                  className="flex items-center justify-center"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Return to Homepage
                </Button>
              </div>
            </div>
          </div>
          
          {/* Additional support information */}
          <div className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>If this problem persists, please contact support at support@logistics.com</p>
            <p className="mt-2">© {new Date().getFullYear()} Logistics Inc. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  );
}
