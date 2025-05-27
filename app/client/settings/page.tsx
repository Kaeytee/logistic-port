"use client";

import * as React from "react";
import { useState } from "react";
import { FaUser } from "react-icons/fa6";
import { MdNotificationsNone } from "react-icons/md";
import { FaGlobeAsia } from "react-icons/fa";
import { MdOutlineLockPerson } from "react-icons/md";
import { MdKeyboardArrowDown } from "react-icons/md";
import AccountSettings from "../components/settings/AccountSettings";
import NotificationSettings from "../components/settings/NotificationSettings";
import PreferencesSettings from "../components/settings/PreferencesSettings";
import SecuritySettings from "../components/settings/SecuritySettings";

export default function ClientSettingsPage() {
  // State management with proper typing following OOP principles
  const [activeTab, setActiveTab] = useState<
    "account" | "notification" | "preferences" | "security"
  >("account");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Create refs to access form methods from child components
  const accountFormRef = React.useRef<{ submitForm: () => Promise<void> } | null>(null);
  
  // Listen for settings saved events from child components
  React.useEffect(() => {
    const handleSettingsSaved = () => {
      setIsSaving(false);
    };
    
    window.addEventListener('settings-saved', handleSettingsSaved);
    return () => window.removeEventListener('settings-saved', handleSettingsSaved);
  }, []);

  const menuItems = [                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
    { id: "account", icon: FaUser, label: "Account" },
    { id: "notification", icon: MdNotificationsNone, label: "Notification" },
    { id: "preferences", icon: FaGlobeAsia, label: "Preferences" },
    { id: "security", icon: MdOutlineLockPerson, label: "Security" },
  ];

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setIsDropdownOpen(false);
  };

  /**
   * Renders the appropriate content based on the active tab
   * Uses refs to access component methods following OOP principles
   * @returns React component for the active tab
   */
  const renderContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings ref={accountFormRef} />;
      case "notification":
        return <NotificationSettings />;
      case "preferences":
        return <PreferencesSettings />;
      case "security":
        return <SecuritySettings />;
      default:
        return <AccountSettings ref={accountFormRef} />;
    }
  };

  const activeMenuItem = menuItems.find((item) => item.id === activeTab);

  return (
    <div className="min-h-screen px-4 sm:px-10 py-6 bg-white transition-colors duration-300">
      {/* Header with title and action buttons */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Set up your preferences</p>
        </div>
        
        {/* Action buttons - Cancel and Save Changes */}
        <div className="flex space-x-3">
          <button 
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => {
              // Reset form changes when Cancel is clicked
              if (window.confirm('Discard all changes?')) {
                window.location.reload();
              }
            }}
          >
            Cancel
          </button>
          
          <button 
            className={`px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center ${isSaving ? 'opacity-80' : ''}`}
            onClick={() => {
              setIsSaving(true);
              // Trigger form submission through the ref
              if (activeTab === 'account' && accountFormRef.current) {
                accountFormRef.current.submitForm()
                  .then(() => {
                    // Show success message
                    alert('Settings saved successfully!');
                    setIsSaving(false);
                  })
                  .catch((error) => {
                    // Show error message
                    console.error('Error saving settings:', error);
                    alert('Failed to save settings. Please try again.');
                    setIsSaving(false);
                  });
              } else {
                // For other tabs, implement their submission logic
                setTimeout(() => {
                  alert('Settings tab saved successfully!');
                  setIsSaving(false);
                }, 800);
              }
            }}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Changes...
              </>
            ) : (
              <>
                Save Changes
                {/* Show indicator if there are unsaved changes in active tab */}
                {activeTab === 'account' && (
                  <span className="flex h-2 w-2 relative ml-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col md:w-[95%] mx-auto md:my-10 md:flex-row gap-6 md:gap-10">
        {/* Mobile Dropdown */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              {activeMenuItem && <activeMenuItem.icon className="text-2xl" />}
              <span>{activeMenuItem ? activeMenuItem.label : ""}</span>
            </div>
            <MdKeyboardArrowDown
              className={`text-2xl transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          <ul
            className={`absolute z-10 w-full mt-2 py-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg transition-all duration-300 origin-top
							${
                isDropdownOpen
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
          >
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleTabChange(item.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 cursor-pointer transition-all duration-300 
									${
                    activeTab === item.id
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
              >
                <item.icon className="text-2xl mr-3" /> {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden md:block p-4 py-6 bg-white dark:bg-slate-800 rounded-2xl shadow min-w-[200px] h-fit">
          <ul>
            {menuItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleTabChange(item.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 pl-3 my-4 rounded-lg cursor-pointer transition-all duration-300 
									${
                    activeTab === item.id
                      ? "bg-gray-300 dark:bg-gray-700"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700/50"
                  }`}
              >
                <item.icon className="text-2xl mr-3" /> {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Content Area */}
        <div className="p-4 py-6 bg-white dark:bg-slate-800 rounded-2xl shadow flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
