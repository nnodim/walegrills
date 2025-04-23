"use client"; // This page component uses client-side state/hooks

import DeliveryForm from "@/components/DeliveryForm";
import ProgressIndicator from "@/components/ProgressIndicator";
import SectionHeader from "@/components/SectionHeader";
import React from "react";
import MealCounter from "@/components/meal-plan/MealCounter";
import MealItemCard from "@/components/meal-plan/MealItemCard";
import MealPlanSelector from "@/components/meal-plan/MealPlanSelector";
import NavigationButtons from "@/components/NavigationButtons";
import { Button } from "@/components/ui/button";
import { meals, useMealStore } from "@/store/useMealStore";
import OrderSummary from "@/components/OrderSummary";
// Import Delivery Store if separate
// import { useDeliveryStore } from '@/store/deliveryStore';

interface DeliveryFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  instructions?: string;
}

const steps = [
  { id: 1, name: "Select Plan" },
  { id: 2, name: "Choose Meals" },
  { id: 3, name: "Delivery" },
  { id: 4, name: "Payment" },
];

const MealSelectionPage: React.FC = () => {
  const {
    currentStep,
    setCurrentStep,
    plan,
    mealLimit,
    mealQuantities,
    paymentMethod, // Get payment method from store
  } = useMealStore();

  // Calculate selected count dynamically
  const selectedCount = Object.values(mealQuantities).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  // Handler for valid form submission (called by react-hook-form's handleSubmit)
  const handleDeliverySubmit = (data: DeliveryFormData) => {
    console.log("Delivery Form Data:", data);
    // Now that we have valid form data, proceed with the order
    // (This is where you would typically send data to a backend)

    console.log("Order Placed!", {
      plan,
      mealQuantities, // This comes from Zustand
      deliveryFormData: data, // This comes from react-hook-form
      paymentMethod, // This comes from Zustand
    });

    alert("Thank you for your order! Your meals will be delivered soon.");

    // Optionally reset relevant states after placing the order
    // resetMealQuantities(); // Maybe don't reset immediately, show order confirmation
    // Consider adding a confirmation step (step 4)
    setCurrentStep(1); // Go back to step 1 for now
    window.scrollTo(0, 0); // Scroll to top
  };

  // Handler for "Proceed to Delivery" - moves from step 2 to step 3
  const handleProceedToDelivery = () => {
    if (selectedCount === mealLimit) {
      setCurrentStep(3); // Move to Delivery step (Step 3)
      window.scrollTo(0, 0); // Scroll to top
    }
    // The button itself is disabled if selectedCount !== mealLimit
  };

  // Handler for "Back to Meals" - moves from step 3 back to step 2
  const handleBackToMeals = () => {
    setCurrentStep(2); // Go back to Choose Meals step (Step 2)
    window.scrollTo(0, 0); // Scroll to top
  };

  // Determine if the "Proceed" button should be disabled
  const proceedDisabled = selectedCount !== mealLimit;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <ProgressIndicator variant="compact" steps={steps} currentStep={currentStep} />

      {/* Step 1 & 2: Select Plan & Choose Meals */}
      {(currentStep === 1 || currentStep === 2) && (
        <div className="meal-plan-section">
          <SectionHeader
            title="Select Your Meal Plan"
            description="Choose the perfect meal plan that fits your lifestyle. Our chef-prepared meals are made with fresh ingredients and delivered right to your door."
          />
          {/* Meal Plan Selection */}
          <MealPlanSelector />
          {/* Choose Meals Section */}
          <MealCounter /> {/* Renders the counter and warning */}
          {/* Render the grid of meal items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {meals.map((meal) => (
              <MealItemCard
                key={meal.id}
                meal={meal}
                quantity={mealQuantities[meal.id] || 0} // Get quantity from store
                mealLimit={mealLimit}
                selectedCount={selectedCount}
              />
            ))}
          </div>
          {/* Navigation buttons for this section */}
          <div className="flex justify-between mt-8">
            <NavigationButtons // Use the NavigationButtons component
              currentStep={currentStep} // Pass current step to control button visibility
              onProceed={handleProceedToDelivery}
              proceedDisabled={proceedDisabled}
              // Pass reset action to NavigationButtons if it has a Reset button
            />
          </div>
        </div>
      )}

      {/* Step 3 & 4: Delivery & Payment */}
      {(currentStep === 3 || currentStep === 4) && (
        <div className="address-section">
          <SectionHeader
            title="Delivery Information"
            description="Please provide your delivery details so we can bring your meals right to your door."
          />
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Pass the handleDeliverySubmit callback to the DeliveryForm */}
              <DeliveryForm onSubmit={handleDeliverySubmit} />
            </div>
            <div>
              <div className="bg-white shadow-md rounded-lg p-6 sticky top-6">
                <OrderSummary />
                <div className="mt-6 space-y-4">
                  <Button
                    variant="outline"
                    className="w-full rounded-button whitespace-nowrap"
                    onClick={handleBackToMeals}
                  >
                    Back to Meals
                  </Button>
                  {/* This button triggers the form submission in DeliveryForm */}
                  <Button
                    type="submit" // Set type to submit
                    form="deliveryForm" // Associate with the form ID
                    className="w-full rounded-button whitespace-nowrap bg-[#B4846C] hover:bg-[#B4846C]/80"
                    // react-hook-form handles disabling based on validation
                    // You could add `disabled={!formState.isValid}` if passing formState down
                    // but type="submit" and required fields handle basic cases
                  >
                    Place Order
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MealSelectionPage;
