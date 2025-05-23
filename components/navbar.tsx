"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { APP_DISPLAY_NAME } from "@/app/app-details-config";
import { useAuth } from "@/components/auth-context";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  let userName = "";
  if (user) {
    userName = user.name || "User";
  }

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    setScrolled(window.scrollY > 10);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Hide login/register buttons on their respective pages
  const hideLogin = pathname === "/login";
  const hideRegister = pathname === "/register";

  // Conditionally add Dashboard link only if user is authenticated
  // This ensures that only logged-in users see the Dashboard option
  const navLinks = [
    // Only include Dashboard if user is present (authenticated)
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/services", label: "Services" },
    { href: "/contact", label: "Contact" },
  ];

  const isDark = resolvedTheme === "dark";

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        pathname === "/" && !scrolled
          ? "bg-transparent"
          : "bg-background/90 shadow-sm border-b border-border/40"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter">
              {APP_DISPLAY_NAME}
            </span>
          </Link>
        </motion.div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-6">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <Link
                href={link.href}
                className="text-sm font-medium hover:text-primary transition-colors relative group"
              >
                {link.label}
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"
                  whileHover={{ width: "100%" }}
                />
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* Desktop actions */}
        <motion.div
          className="hidden md:flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Theme Toggle */}
          <motion.button
            aria-label="Toggle theme"
            className="p-2 hover:bg-muted rounded-full transition-colors"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mounted && isDark ? (
                <motion.span
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Auth section: user info, avatar, and logout (professional, styled, right-aligned) */}
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3 min-w-[170px] justify-end">
              {/* User info stacked, always visible, themed color, right-aligned */}
              <div className="flex flex-col items-end text-right mr-2">
                <span className="text-xs text-slate-600 dark:text-slate-300 leading-tight">
                  {user?.email || "emailgoeshere"}
                </span>
              </div>
              {/* User icon, themed border for clarity, uses user's profile image or fallback */}
              <div className="flex items-center justify-center border-slate-800 dark:border-white p-0.5">
                <img
                  src={user?.image || "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Background.png"}
                  alt="User Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </div>
              {/* Logout button, styled professionally */}
              <Button onClick={logout} variant="outline" className="ml-2 text-xs px-3 py-1 h-8">Logout</Button>
            </div>
          ) : (
            <>
              {!hideLogin && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                </motion.div>
              )}
              {!hideRegister && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Mobile Theme Toggle */}
          <motion.button
            aria-label="Toggle theme"
            className="p-2 hover:bg-muted rounded-full transition-colors"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {mounted && isDark ? (
                <motion.span
                  key="sun-mobile"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Sun className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon-mobile"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Moon className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-md md:hidden overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-16"></div>
            <nav className="flex flex-col gap-4 p-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-lg font-medium p-3 hover:bg-muted rounded-md block transition-colors",
                      pathname === link.href ? "bg-muted text-primary" : ""
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Auth buttons */}
              <motion.div
                className="flex flex-col gap-3 mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                {user ? (
                  <>
                    <span className="font-semibold text-lg text-primary w-full py-6 text-center">Hi, {user.name}</span>
                    <Button onClick={logout} variant="outline" className="w-full py-6">Logout</Button>
                  </>
                ) : (
                  <>
                    {!hideLogin && (
                      <Button variant="outline" asChild className="w-full py-6">
                        <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                          Login
                        </Link>
                      </Button>
                    )}
                    {!hideRegister && (
                      <Button asChild className="w-full py-6">
                        <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                          Register
                        </Link>
                      </Button>
                    )}
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
