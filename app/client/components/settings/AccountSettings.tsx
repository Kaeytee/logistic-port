"use client";

import React, { useState, useImperativeHandle, forwardRef } from "react";
import Image from "next/image";
import { useAuth } from "@/components/auth-context";
import { DUMMY_USER } from "@/app/app-config";
import { initialUserData } from "@/lib/constants";

/**
 * AccountSettings component
 * 
 * Displays and allows editing of user account information
 * Implements the exact design from the provided mockup with clean architecture
 * Following OOP principles for state management and event handling
 * @returns React component
 */
const AccountSettings = React.forwardRef((props, ref) => {
  // Get user data from auth context with proper fallbacks
  const { user } = useAuth();
  
  // Initialize form state with user data from auth context or fall back to dummy data
  // Following clean architecture principles with proper data abstraction
  const [formData, setFormData] = useState({
    fullName: user?.name || DUMMY_USER.fullName,
    email: user?.email || DUMMY_USER.email,
    phoneNumber: user?.phone || DUMMY_USER.phone,
    country: initialUserData.senderCountry,
    city: initialUserData.senderCity,
    address: initialUserData.senderAddress,
    zipCode: initialUserData.senderZip
  });

  // Track form submission state for user feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  // Default avatar URL as specified
  const DEFAULT_AVATAR = "https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Background.png";
  
  // State to track the current profile image with proper fallbacks
  // Following clean architecture principles with proper fallback chain
  const [profileImage, setProfileImage] = useState<string>(
    user?.image || // First try to use authenticated user's image
    DEFAULT_AVATAR // Default fallback image
  );
  
  // Track if the image has been changed but not saved
  const [imageChanged, setImageChanged] = useState(false);
  
  // Handle input changes with proper type checking
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Reset saved state when form is modified
    if (isSaved) setIsSaved(false);
  };
  
  /**
   * Form submission handler - follows clean architecture principles
   * Can be called directly via ref or through the form's onSubmit
   * @param e - Optional form event (may be undefined when called via ref)
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    // Prevent default form behavior if called from form submit
    if (e) e.preventDefault();
    setIsSubmitting(true);
    try {
      // In a real app, this would be an API call to update user info
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dispatch user data update event to synchronize across components
      // This follows observer pattern from OOP principles
      window.dispatchEvent(new CustomEvent(USER_DATA_UPDATED_EVENT, { 
        detail: { 
          // Pass only the necessary data for UI updates
          name: formData.fullName,
          email: formData.email,
          phone: formData.phoneNumber
        } 
      }));
      
      // Provide feedback to user
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
      
      // Signal successful completion for Promise chaining
      return Promise.resolve();
    } catch (error) {
      // Proper error handling following best practices
      console.error('Error updating account settings:', error);
      return Promise.reject(error);
    } finally {
      // Always clean up loading state
      setIsSubmitting(false);
    }
  };
  
  /**
   * Expose methods to parent component via ref
   * This implements an interface-based approach following OOP principles
   */
  useImperativeHandle(ref, () => ({
    // Public method to submit the form programmatically including image changes
    submitForm: async () => handleSaveChanges()
  }));
  
  /**
   * File input reference for hidden file uploader
   * This creates a clean approach to custom upload buttons
   */
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  /**
   * Photo upload handler
   * Creates and manages a hidden file input element
   * Handles file selection and upload process
   */
  const handlePhotoUpload = () => {
    // Trigger the hidden file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  /**
   * Custom events for profile updates
   * Following clean architecture by decoupling components using an event-driven system
   * This pattern allows for instant synchronization across UI components
   */
  const PROFILE_IMAGE_UPDATED_EVENT = 'profile-image-updated';
  const USER_DATA_UPDATED_EVENT = 'user-data-updated';
  
  /**
   * Handles file selection from the file input
   * Provides immediate image preview without requiring save
   * Syncs image updates across components
   * @param e - Change event from file input
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Show loading state and feedback
      setIsSubmitting(true);
      
      // Create a FileReader to get image preview
      const reader = new FileReader();
      
      // When the reader has loaded the file, update the profile image
      reader.onload = (event) => {
        // Update image state with the new image data URL
        if (event.target?.result) {
          const imageUrl = event.target.result as string;
          setProfileImage(imageUrl);
          setImageChanged(true); // Mark that image has been changed
          
          // Update the image globally for immediate preview in all components
          // This follows clean OOP by using a global event system
          window.dispatchEvent(new CustomEvent(PROFILE_IMAGE_UPDATED_EVENT, { 
            detail: { imageUrl } 
          }));
          
          // In a real implementation, this would upload to a server and get a URL back
          // Simulate API call completion with delay
          setTimeout(() => {
            console.log("Photo uploaded and available for preview");
            setIsSubmitting(false);
          }, 800);
        }
      };
      
      // Read the file as a data URL (base64 encoded string)
      reader.readAsDataURL(file);
    }
  };
  
  /**
   * Photo deletion handler
   * Properly handles user confirmation and state updates
   * Immediately resets the profile image to default and syncs across components
   */
  const handlePhotoDelete = () => {
    if (confirm("Are you sure you want to delete your profile photo?")) {
      // Show loading state and feedback
      setIsSubmitting(true);
      
      // Use the consistent default avatar
      
      // Simulate API call delay
      setTimeout(() => {
        // Reset profile image to default
        setProfileImage(DEFAULT_AVATAR);
        setImageChanged(true); // Mark that image has been changed
        
        // Update image globally across all components
        window.dispatchEvent(new CustomEvent(PROFILE_IMAGE_UPDATED_EVENT, { 
          detail: { imageUrl: DEFAULT_AVATAR } 
        }));
        
        console.log("Photo deletion confirmed and processed");
        setIsSubmitting(false);
      }, 800);
    }
  };
  
  /**
   * Function to handle the form submission
   * Includes the profile image changes along with other form data
   * Following clean architecture principles for complete data handling
   */
  const handleSaveChanges = async () => {
    // This would be called from the Save Changes button in the parent component
    if (imageChanged) {
      // In a real implementation, this would update the auth context and server
      console.log("Saving profile image changes to server");
      
      // Update user image in auth context or global state
      // This would be a permanent storage update in a real implementation
      if (user) {
        // Simulating updating the user object with the new image
        console.log(`Updating user ${user.name}'s profile picture to ${profileImage.substring(0, 30)}...`);
      }
      
      // Mark changes as saved
      setImageChanged(false);
    }
    
    // Continue with the regular form submission
    return await handleSubmit();
  };
  
  /**
   * Effect to initialize global image update listeners
   * This allows image updates to propagate across components
   */
  React.useEffect(() => {
    // Initialize listener for other components updating the image
    const handleGlobalImageUpdate = (event: CustomEvent<{imageUrl: string}>) => {
      // Only update if the image URL is different
      if (event.detail.imageUrl !== profileImage) {
        setProfileImage(event.detail.imageUrl);
      }
    };
    
    // Add event listener with proper typing
    window.addEventListener(
      PROFILE_IMAGE_UPDATED_EVENT, 
      handleGlobalImageUpdate as EventListener
    );
    
    // Cleanup function removes listener when component unmounts
    return () => {
      window.removeEventListener(
        PROFILE_IMAGE_UPDATED_EVENT, 
        handleGlobalImageUpdate as EventListener
      );
    };
  }, [profileImage]);

  return (
    <div>
      {/* Account Settings Header with User icon */}
      <div className="flex items-center mb-6">
        <div className="text-2xl font-semibold">Account Settings</div>
      </div>
      
      {/* User Profile Photo and Info */}
      <div className="flex items-center mb-8">
        {/* Hidden file input for photo upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          aria-label="Upload profile photo"
        />
        
        {/* Profile photo with upload button at bottom right */}
        <div className="relative mr-4" style={{ width: '72px', height: '72px' }}>
          {/* Profile image with perfect circle mask - uses dynamic profileImage state */}
          <div 
            className="w-[72px] h-[72px] rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer" 
            onClick={handlePhotoUpload}
          >
            <Image 
              src={profileImage} 
              alt={formData.fullName} 
              width={72} 
              height={72} 
              className="object-cover w-full h-full"
              unoptimized={profileImage.startsWith('data:')} /* Allow data URLs for immediate preview */
            />
          </div>
          
          {/* Upload icon positioned at bottom right - sticky style */}
          <div 
            className="absolute bottom-0 right-0 w-7 h-7 bg-red-600 rounded-full flex items-center justify-center cursor-pointer shadow-md border border-white"
            onClick={handlePhotoUpload}
            title="Upload new photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M12.75 20.25V15.75H15.75L12 11.25L8.25 15.75H11.25V20.25H7.5V20.2125C7.374 20.22 7.254 20.25 7.125 20.25C5.63316 20.25 4.20242 19.6574 3.14752 18.6025C2.09263 17.5476 1.5 16.1168 1.5 14.625C1.5 11.739 3.6825 9.387 6.483 9.0645C6.72854 7.78094 7.41368 6.62306 8.42057 5.79001C9.42746 4.95696 10.6932 4.5008 12 4.5C13.307 4.50072 14.5729 4.95682 15.5801 5.78985C16.5872 6.62289 17.2727 7.78081 17.5185 9.0645C20.319 9.387 22.4985 11.739 22.4985 14.625C22.4985 16.1168 21.9059 17.5476 20.851 18.6025C19.7961 19.6574 18.3653 20.25 16.8735 20.25C16.7475 20.25 16.626 20.22 16.4985 20.2125V20.25H12.75Z" fill="white"/>
            </svg>
          </div>
          
          {/* Loading indicator during photo upload/delete */}
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        
        {/* User info and photo actions */}
        <div className="flex flex-col">
          <div className="font-medium text-lg">{formData.fullName}</div>
          <div className="text-gray-600 text-sm mb-2">{formData.email}</div>
          <div className="flex space-x-2">
            <button 
              onClick={handlePhotoUpload}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Uploading...
                </>
              ) : 'Upload New Photo'}
            </button>
            <button 
              onClick={handlePhotoDelete}
              className="border border-gray-300 hover:bg-gray-100 px-4 py-1 rounded text-sm"
              disabled={isSubmitting}
              // Only enable delete if we're not using the default image
              title={profileImage === '/avatar-user.png' ? 'No custom profile photo to delete' : 'Delete profile photo'}
            >
              Delete
            </button>
            {imageChanged && !isSubmitting && (
              <div className="text-sm text-green-600 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Preview only - Click Save Changes
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Country and City - side by side */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Address <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          {/* Zip Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Zip Code <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
});

/**
 * Export the AccountSettings component as the default export
 * This follows clean code architecture with proper documentation
 */
export default AccountSettings;
