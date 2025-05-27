/**
 * Root Layout Component
 * 
 * This is the main layout component for the entire application.
 * It includes essential providers and the app shell structure.
 * 
 * [2025-05-27] Updated to fix automatic theme detection by adding ThemeScript
 * for proper system theme detection before React hydration.
 * -- Senior Engineer
 */

import "./globals.css";
import { Inter } from "next/font/google";
import AppShell from "@/components/app-shell";
import AppLoaderWrapper from "@/components/AppLoaderWrapper";
// Import ThemeProvider for global theme context
import { ThemeProvider } from "@/components/theme-provider";
// Import ThemeScript for pre-hydration theme detection
import { ThemeScript } from "@/components/theme-script";
import PreloadMediaProvider from "@/components/PreloadMediaProvider";
import CookieConsentBanner from "@/components/ui/CookieConsentBanner";
// ChatbotButtonWrapper import removed as the component is currently disabled. Re-add when re-enabling the chatbot button.
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/components/auth-context";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The main layout structure with all providers and components
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ThemeScript runs before React hydration to detect and apply the correct theme */}
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Analytics />
          <AuthProvider>
            <PreloadMediaProvider>
              <AppLoaderWrapper>
                <AppShell>{children}</AppShell>
                <CookieConsentBanner />
                {/*
                  * ChatbotButtonWrapper is temporarily disabled.
                  * To be re-enabled in a future update when chatbot functionality is ready.
                  */
                }
                {/* <ChatbotButtonWrapper /> */}
              </AppLoaderWrapper>
            </PreloadMediaProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
