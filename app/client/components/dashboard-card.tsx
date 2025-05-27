import Image from 'next/image';
import React from 'react';
import { Box, Clock, History, MapPin, Settings } from 'lucide-react'; // Import icons that match the design

/**
 * Type definition for icon component names available in dashboard cards
 * Each name corresponds to a specific Lucide icon component
 * 
 * [2025-05-27] Added 'settings' option for account management card
 * -- Senior Engineer
 */
type IconComponentName = "box" | "clock-delivery" | "history" | "location" | "settings";

// Interface for DashboardCard props
export interface DashboardCardProps {
  title: string;
  description: string;
  imageSrc: string;
  iconComponent: IconComponentName;
  onClick?: () => void;
}

/**
 * DashboardCard component that exactly matches the design in the image
 */
const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  description, 
  imageSrc, 
  iconComponent, 
  onClick 
}) => {
  /**
   * Function to render the appropriate icon based on the iconComponent prop
   * Maps each icon name to its corresponding Lucide component
   * Falls back to Box icon if an unsupported name is provided
   * 
   * @returns JSX Element with the appropriate icon
   */
  const renderIcon = () => {
    switch (iconComponent) {
      case "box":
        return <Box className="h-8 w-8 text-white" />;
      case "clock-delivery":
        return <Clock className="h-8 w-8 text-white" />;
      case "history":
        return <History className="h-8 w-8 text-white" />;
      case "location":
        return <MapPin className="h-8 w-8 text-white" />;
      case "settings":
        return <Settings className="h-8 w-8 text-white" />;
      default:
        return <Box className="h-8 w-8 text-white" />;
    }
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden cursor-pointer w-full hover:shadow-xl shadow-lg transition-shadow dark:bg-slate-800 dark:hover:bg-slate-700"
      onClick={onClick}
    >
      {/* Image Background - full size to match the image design */}
      <div className="w-full h-64 relative">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Content overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white">
        <h3 className="text-lg font-medium dark:text-gray-700">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      
      {/* Circular icon on the right side - exactly as in the image */}
      <div className="absolute bottom-4 right-4 bg-blue-800 rounded-full p-3 flex items-center justify-center my-8">
        {renderIcon()}
      </div>
    </div>
  );
};

export default DashboardCard;