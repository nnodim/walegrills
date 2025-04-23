"use client"; // This component uses client-side state/hooks

import React from "react";
import { Button } from "@/components/ui/button";
import { useMealStore } from "@/store/useMealStore";
// Import delivery store if handling place order logic here or needing form validity state
// import { useDeliveryStore } from '@/store/deliveryStore';

interface NavigationButtonsProps {
  currentStep: 1 | 2 | 3 | 4;
  onProceed?: () => void;
  onBack?: () => void;
  onPlaceOrder?: () => void;
  proceedDisabled?: boolean;
  placeOrderDisabled?: boolean; // If form validity is checked elsewhere
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentStep,
  onProceed,
  onBack,
  onPlaceOrder,
  proceedDisabled = false,
  placeOrderDisabled = false,
}) => {
  // Use store if buttons directly interact with step change
  const { resetMealQuantities } = useMealStore(); // Or handle step change in page.tsx

  if (currentStep === 1 || currentStep === 2) {
    // Select Plan / Choose Meals step
    return (
      <div className="flex justify-between w-full mt-8">
        <Button
          variant="outline" // Use outline variant
          className="rounded-button whitespace-nowrap"
          onClick={() => {
            // Assuming reset happens in parent component or via store action triggered by a dedicated button
            // If this button triggers reset, uncomment below:
            resetMealQuantities();
          }}
        >
          Reset Selections
        </Button>
        <Button
          className="rounded-button whitespace-nowrap bg-[#B4846C] disabled:bg-[#B4846C]/80"
          onClick={onProceed} // Trigger proceed logic passed from parent
          disabled={proceedDisabled}
        >
          Proceed to Delivery
        </Button>
      </div>
    );
  }

  if (currentStep === 3 || currentStep === 4) {
    // Delivery / Payment step
    return (
      <div className="mt-6 space-y-4">
        {" "}
        {/* Use space-y for vertical buttons */}
        <Button
          variant="outline"
          className="w-full rounded-button whitespace-nowrap"
          onClick={onBack} // Trigger back logic passed from parent
        >
          Back to Meals
        </Button>
        <Button
          className="w-full rounded-button whitespace-nowrap bg-[#B4846C] hover:bg-[#B4846C]/80"
          onClick={onPlaceOrder} // Trigger place order logic
          disabled={placeOrderDisabled} // Disable based on form validity etc.
        >
          Place Order
        </Button>
      </div>
    );
  }

  return null; // Don't render buttons on other steps if any
};

export default NavigationButtons;
