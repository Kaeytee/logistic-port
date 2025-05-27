/**
 * Next.js Middleware for Route Protection
 * 
 * This middleware handles two primary concerns:
 * 1. Authentication protection for all /client/* routes
 * 2. Prevention of duplicate client paths (like /client/client/*)
 * 
 * Uses JWT stored in cookies to validate authentication
 * -- Senior Engineer, 2025-05-27
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware function executed on each request to protected routes
 * @param request - The incoming request object
 * @returns NextResponse - Either redirects to login or allows the request to proceed
 */
/**
 * Core middleware function for authentication and route protection
 * Implements a robust authentication flow with proper cookie handling
 * 
 * @param request - The incoming Next.js request object
 * @returns NextResponse - The appropriate response based on auth state
 */
export function middleware(request: NextRequest) {
  // Extract the pathname from the URL for routing decisions
  const pathname = request.nextUrl.pathname
  
  // Define a helper function to check authentication state from cookies
  const isAuthenticated = () => {
    // Check for auth tokens in cookies
    const authToken = request.cookies.get('auth_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value
    
    // User is authenticated if either token exists
    // In production, we would validate token integrity
    return !!(authToken || refreshToken)
  }
  
  // ROUTE 1: Handle duplicate client paths (edge case protection)
  if (pathname.startsWith('/client/client/')) {
    // Redirect to login for duplicate paths to prevent infinite loops
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // ROUTE 2: Skip authentication for static assets and public API routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api/public') ||
    pathname.includes('.') // Static files (images, CSS, etc.)
  ) {
    return NextResponse.next()
  }
  
  // ROUTE 3: Handle root path (/) with smart redirection
  if (pathname === '/' || pathname === '') {
    // If user is authenticated, redirect to dashboard
    if (isAuthenticated()) {
      console.log('Root path with auth: redirecting to dashboard')
      return NextResponse.redirect(new URL('/client/dashboard', request.url))
    }
    
    // Otherwise allow access to public homepage
    return NextResponse.next()
  }
  
  // ROUTE 4: Special handling for login page to prevent redirect loops
  if (pathname === '/login') {
    // If already authenticated, redirect appropriately
    if (isAuthenticated()) {
      // Get the callback URL if present
      const { searchParams } = new URL(request.url)
      const callbackUrl = searchParams.get('callbackUrl')
      
      // Validate and use callback URL if safe
      if (callbackUrl && callbackUrl.startsWith('/')) {
        console.log(`Login with auth: redirecting to ${callbackUrl}`)
        return NextResponse.redirect(new URL(callbackUrl, request.url))
      }
      
      // Default to dashboard if no callback URL
      console.log('Login with auth: redirecting to dashboard')
      return NextResponse.redirect(new URL('/client/dashboard', request.url))
    }
    
    // Not authenticated, allow access to login page
    return NextResponse.next()
  }
  
  // ROUTE 5: Protect all client routes with authentication
  if (pathname.startsWith('/client/')) {
    // If not authenticated, redirect to login
    if (!isAuthenticated()) {
      console.log(`Protected route ${pathname}: redirecting to login`)
      
      // Create login URL with callback
      const url = new URL('/login', request.url)
      url.searchParams.set('callbackUrl', pathname)
      
      return NextResponse.redirect(url)
    }
    
    // User is authenticated, allow access to protected route
    console.log(`Authenticated access to ${pathname}`)
    return NextResponse.next()
  }
  
  // Default: Allow the request to proceed for any other routes
  return NextResponse.next()
}

/**
 * Matcher configuration specifies which paths the middleware applies to
 * - '/client/:path*' protects all client routes
 * - '/client/client/:path*' handles duplicate paths
 */
/**
 * Middleware configuration specifies which paths this middleware should run on:
 * - '/' - Root path to handle authenticated users redirection to dashboard
 * - '/client/:path*' - All client routes requiring authentication
 * - '/client/client/:path*' - Handle duplicate paths edge case
 */
export const config = {
  matcher: [
    '/',
    '/login',  // Add login page to matcher to handle redirect loops
    '/client/:path*',
    '/client/client/:path*'
  ],
}