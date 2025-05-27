'use client';

/**
 * Not Found Page Component for Client Routes
 * 
 * This component provides a professional 404 error experience for client-side routes.
 * It follows Next.js App Router architecture for custom 404 pages.
 * 
 * @author Senior Software Engineer
 * @date 2025-05-27
 * @version 1.0.0
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

/**
 * NotFound component that handles 404 errors in client routes
 */
export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-slate-800 p-8 shadow-lg">
        <div className="flex flex-col items-center text-center">
          {/* 404 icon */}
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">404</span>
          </div>
          
          {/* Error details */}
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h1>
          <p className="mb-6 text-slate-600 dark:text-slate-300">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            <Button 
              asChild
              className="flex items-center justify-center"
            >
              <Link href="/client/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
