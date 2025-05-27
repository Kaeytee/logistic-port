/**
 * Theme Detection Script Component
 * 
 * This component provides an inline script that runs before React hydration
 * to detect the system's color scheme preference and apply it immediately.
 * This prevents the flash of incorrect theme that can happen with client-side detection.
 * 
 * The script:
 * 1. Checks localStorage for user preference
 * 2. Falls back to system preference if set to "system" or not set
 * 3. Applies the theme before the page renders
 * 
 * -- Senior Engineer, 2025-05-27
 */

import React from "react";

// Using a function component for consistency and potential future enhancements
export function ThemeScript() {
  // This script runs inline in the HTML head before any React hydration
  // It ensures that the correct theme is applied immediately on page load
  const script = `
    (function() {
      // Try-catch to handle any localStorage access errors
      try {
        // Check for existing theme preference in localStorage
        const theme = localStorage.getItem('theme');
        // Check for system setting if theme is "system" or not set
        const systemTheme = (!theme || theme === 'system') && 
          window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        // Apply the appropriate theme
        const activeTheme = (theme === 'light' || theme === 'dark') ? theme : systemTheme;
        
        // Apply theme to document immediately
        document.documentElement.classList.toggle('dark', activeTheme === 'dark');
        
        // Store for debugging
        window.__theme = activeTheme;
        
        // Set up listener for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
          if (localStorage.getItem('theme') === 'system') {
            document.documentElement.classList.toggle('dark', e.matches);
            window.__theme = e.matches ? 'dark' : 'light';
          }
        });
      } catch (e) {
        // Fallback to default light theme if there's any error
        console.warn('Error accessing localStorage for theme:', e);
      }
    })();
  `;

  // Return the script as a non-rendering inline script
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
