/**
 * [2025-05-26] Updated ConfirmForm to reflect the simplified shipment flow.
 * Removed sender section and replaced with client/origin information.
 * This aligns with the admin's request to simplify the process and remove sender creation.
 * 
 * [2025-05-26] Added loading state and submit button with professional animation
 * -- Cascade AI
 */

import React, { useCallback } from 'react';
import { DELIVERY_TYPES, PACKAGE_TYPES } from "@/lib/constants";

// Props interface for ConfirmForm following clean code and OOP best practices
interface ConfirmFormProps {
  formData: {
    // Client information
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress?: string;
    clientCity?: string;
    clientState?: string;
    clientZip?: string;
    clientCountry?: string;
    
    // Package origin
    originCountry: string;
    originCity?: string;
    originAddress?: string;
    originState?: string;
    
    // Package details
    packageType: string;
    packageCategory: string;
    packageDescription: string;
    freightType: string;
    packageWeight?: string;
    
    // Any other properties
    [key: string]: any;
  };
  
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onBack: () => void;
  
  // Accepts a form event for proper form submission handling
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  
  // New prop for loading state
  isSubmitting: boolean;
}

/**
 * ConfirmForm component renders a confirmation summary and handles form submission
 * for the simplified shipment flow
 */
const ConfirmForm: React.FC<ConfirmFormProps> = ({
  formData,
  onInputChange,
  onBack,
  onSubmit,
  isSubmitting
}) => {
  // Format section for display
  const SectionTitle = ({ title }: { title: string }) => (
    <h3 className="text-lg font-semibold text-[#1A2B6D] dark:text-[#AEB8D0] border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">{title}</h3>
  );
  
  // Helper function to format values properly
  const formatValue = (value: any): string => {
    if (value === undefined || value === null || value === '') return "-";
    if (typeof value === 'boolean') return value ? "Yes" : "No";
    return String(value);
  };

  // Get delivery type label from its id
  const getDeliveryTypeLabel = (id: string): string => {
    const deliveryType = DELIVERY_TYPES.find(type => type.id === id);
    return deliveryType ? deliveryType.label : id || '-';
  };

  // Get package type label from its id
  const getPackageTypeLabel = (id: string): string => {
    const packageType = PACKAGE_TYPES.find(type => type.id === id);
    return packageType ? packageType.label : id || '-';
  };

  // Component to display a row of information
  const InfoRow = ({ label, value }: { label: string; value: any }) => (
    <div className="flex flex-col sm:flex-row py-2 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
      <div className="font-medium text-gray-600 dark:text-gray-400 w-full sm:w-1/3 mb-1 sm:mb-0">{label}:</div>
      <div className="text-gray-900 dark:text-gray-200 w-full sm:w-2/3">{formatValue(value)}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl text-[#1A2B6D] dark:text-[#AEB8D0] font-bold mb-4">Confirm Package Request</h2>
        <p className="text-gray-500 mb-6">Please review all information before submitting your package request.</p>
      </div>

      {/* Form with memoized submit handler for improved performance */}
      <form onSubmit={useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Ensure we prevent default form submission behavior
        onSubmit(e); // Pass the event to the parent handler
      }, [onSubmit])} className="space-y-6">
        {/* Summary sections */}
        <div className="mt-8 space-y-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6">
          {/* Client Information */}
          <div>
            <SectionTitle title="Your Information" />
            <div className="space-y-1">
              <InfoRow label="Name" value={formData.clientName} />
              <InfoRow label="Email" value={formData.clientEmail} />
              <InfoRow label="Phone" value={formData.clientPhone} />
              <InfoRow label="Address" value={formData.clientAddress} />
              <InfoRow label="City" value={formData.clientCity} />
              <InfoRow label="State" value={formData.clientState} />
              <InfoRow label="Country" value={formData.clientCountry} />
            </div>
          </div>

          {/* Package Origin */}
          <div>
            <SectionTitle title="Package Origin" />
            <div className="space-y-1">
              <InfoRow label="Origin Country" value={formData.originCountry} />
              <InfoRow label="Origin City" value={formData.originCity} />
              <InfoRow label="Origin Address" value={formData.originAddress} />
              <InfoRow label="Origin State" value={formData.originState} />
            </div>
          </div>

          {/* Package Information */}
          <div>
            <SectionTitle title="Package Information" />
            <div className="space-y-1">
              <InfoRow label="Package Type" value={getPackageTypeLabel(formData.packageType)} />
              <InfoRow label="Package Category" value={formData.packageCategory} />
              <InfoRow label="Description" value={formData.packageDescription} />
              <InfoRow label="Delivery Type" value={getDeliveryTypeLabel(formData.freightType)} />
              <InfoRow label="Weight" value={formData.packageWeight ? `${formData.packageWeight} kg` : '-'} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-sm sm:text-base">
            <p>Please confirm that all information is accurate. You will not be able to make changes after submission without contacting customer support.</p>
          </div>

          <div className="p-4 sm:p-6 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg text-sm sm:text-base flex items-start">
            <svg className="w-5 h-5 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-medium mb-1">Next Steps</p>
              <p>After submitting your request, we'll coordinate with the sender to arrange pickup and delivery of your package. You'll receive updates via email and can track the status through your dashboard.</p>
            </div>
          </div>
          
          {/* Form Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
            {/* Back Button */}
            <button
              type="button"
              onClick={onBack}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back to Package Details
            </button>
            
            {/* Submit Button with Loading State - Using red color scheme */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Submit Package Request</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ConfirmForm;