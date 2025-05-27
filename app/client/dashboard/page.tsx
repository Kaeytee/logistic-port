"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";
import DashboardCard, { DashboardCardProps } from "../components/dashboard-card";

// Dashboard card configuration with exact cards from the image
// Type the array to ensure iconComponent is properly typed as IconComponentName
type DashboardCardConfig = Omit<DashboardCardProps, 'onClick'> & { href: string };

const dashboardCards: DashboardCardConfig[] = [
  {
    title: "Submit Shipment",
    description: "Create a new delivery",
    imageSrc: "/submit-girl.png", // Person signing for package
    href: "/client/submit-shipment",
    iconComponent: "box" // Using the box icon from the image
  },
  {
    title: "Shipment History",
    description: "Visit previous orders",
    imageSrc: "/shipment-history.jpg", // Smiling courier with boxes
    href: "/client/shipment-history",
    iconComponent: "history" // Using the history icon from the image
  },
  {
    title: "Track Shipment",
    description: "Receive Live Updates on delivery",
    imageSrc: "/track.png", // Map with pins
    href: "/client/track-shipment",
    iconComponent: "location" // Using the location icon from the image
  },
  {
    title: "Settings",
    description: "Manage your account settings",
    imageSrc: "/awaiting-time.png", // Reusing the same image temporarily
    href: "/client/settings",
    iconComponent: "settings" // Changed to settings icon for appropriate visual cue
  }
];

/**
 * Dashboard page for Logistics app
 * - Matches the exact design from the provided image
 */
const ClientDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen px-4 sm:px-10 py-6 bg-gray-100 dark:bg-slate-900 transition-colors duration-300">
      {/* Welcome Header - exactly as in the image */}
      <h1 className="text-2xl font-bold mb-2">Welcome</h1>
      
      {/* Prompt - exactly as in the image */}
      <div className="mb-12">
        <p className="mb-6 text-gray-400">What would you like to do?</p>
      </div>
      
      {/* 2x2 Grid of Dashboard Cards - exact layout from image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl h-full mx-auto">
        {dashboardCards.map((card, index) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            description={card.description}
            imageSrc={card.imageSrc}
            iconComponent={card.iconComponent}
            onClick={() => router.push(card.href)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;