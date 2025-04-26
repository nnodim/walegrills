"use client"; // This page component uses client-side state/hooks

import DeliveryForm from "@/components/DeliveryForm";
import MealCounter from "@/components/meal-plan/MealCounter";
import MealItemCard from "@/components/meal-plan/MealItemCard";
import MealPlanSelector from "@/components/meal-plan/MealPlanSelector";
import NavigationButtons from "@/components/NavigationButtons";
import OrderSummary from "@/components/OrderSummary";
import ProgressIndicator from "@/components/ProgressIndicator";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { createMealOrder } from "@/services/booking";
import { getProducts } from "@/services/products";
import { Step, useMealStore } from "@/store/useMealStore";
import { CreateMealOrderPayload, IProduct } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
// Import Delivery Store if separate
// import { useDeliveryStore } from '@/store/deliveryStore';

interface DeliveryFormData {
  prefix: string;
  name: string;
  email: string;
  deliveryDate: string;
  phoneNumber: string;
  deliveryAddress: string;
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
    selectedPlan,
    mealLimit,
    mealQuantities,
    getSelectedCount,
    resetMealQuantities,
  } = useMealStore();

  // Calculate selected count dynamically
  const selectedCount = getSelectedCount();

  const {
    data: meals,
    isLoading: isLoadingMeals,
    isError: isErrorMeals,
    error: mealsError,
  } = useQuery<IProduct[], Error>({
    queryKey: ["getProducts", "productType=mealprep"],
    queryFn: async () => await getProducts("productType=mealprep"),
    enabled: currentStep === 1 || currentStep === 2,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const {
    mutate: createMealOrderMutation,
    isPending: isPlacingOrder,
    reset: resetMutation,
  } = useMutation({
    mutationFn: createMealOrder, // Use the new service function
    onSuccess: (data) => {
      console.log("Meal order placed successfully:", data);
      const paymentLink = data.paymentLink;
      if (paymentLink) {
        toast("Redirecting to payment...");
        window.location.href = data?.paymentLink;
      } else {
        console.error("Booking successful, but no paymentLink received:", data);
        toast("No paymentLink received");
      }
      resetMealQuantities();
    },
    onError: (error) => {
      console.error("Meal order failed:", error);
      toast.message("An error occurred while placing your meal order.", {
        description: error.message,
      });
    },
  });

  useEffect(() => {
    if (isErrorMeals) {
      console.error("Error fetching meal products:", mealsError);
      toast(`Error fetching meal products. Please try again.`);
    }
  }, [isErrorMeals, mealsError]);

  // Handler for valid form submission (called by react-hook-form's handleSubmit)
  const handleDeliverySubmit = (data: DeliveryFormData) => {
    const deliveryFormData = {
      prefix: data.prefix,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      deliveryAddress: data.deliveryAddress,
      deliveryDate: data.deliveryDate,
    };

    if (!selectedPlan || selectedCount !== mealLimit || !deliveryFormData) {
      console.error("Missing data for placing order.");
      toast("Please complete all steps and select your meals.");
      // Optionally navigate to the first incomplete step
      return;
    }

    // Build itemsSelected array from mealQuantities
    const itemsSelected = Object.entries(mealQuantities)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([productId, quantity]) => quantity > 0)
      .map(([productId, quantity]) => ({
        productId: productId,
        quantity: quantity,
      }));

    // Ensure at least one item is selected (should be guaranteed by mealLimit check, but safety)
    if (itemsSelected.length === 0) {
      toast("Please select meals for your plan.");
      return;
    }

    // Construct the API Payload
    const payload: CreateMealOrderPayload = {
      prefix: deliveryFormData.prefix,
      name: deliveryFormData.name, // Use full name from delivery form
      planId: selectedPlan._id, // Use the _id from the selected plan object
      email: deliveryFormData.email,
      // API expects 'YYYY-MM-DD HH:mm:ss'. Form provides 'YYYY-MM-DD'.
      // Append a default time (e.g., midnight UTC or from example)
      deliveryDate: deliveryFormData.deliveryDate
        ? `${deliveryFormData.deliveryDate} 00:00:00`
        : "", // Append default time
      phoneNumber: deliveryFormData.phoneNumber,
      deliveryAddress: deliveryFormData.deliveryAddress, // Use deliveryAddress field
      itemsSelected: itemsSelected,
    };

    console.log("Attempting to create meal order with payload:", payload);

    // Trigger the mutation to create the order
    createMealOrderMutation(payload);
  };

  // Handler for "Proceed to Delivery" - moves from step 2 to step 3
  const handleProceedToDelivery = () => {
    if (selectedCount === mealLimit && selectedPlan) {
      setCurrentStep(3 as Step); // Move to Step 3 (Delivery)
      window.scrollTo(0, 0);
      resetMutation(); // Reset mutation state
    } else {
      if (!selectedPlan) {
        toast("Please select a meal plan.");
      } else {
        // selectedCount !== mealLimit
        toast(`Please select exactly ${mealLimit} meals.`);
      }
    }
  };

  // Handler for "Back to Meals" - moves from step 3 back to step 2
  const handleBackToMeals = () => {
    setCurrentStep(2); // Go back to Choose Meals step (Step 2)
    window.scrollTo(0, 0); // Scroll to top
  };

  // Determine if the "Proceed" button should be disabled
  const proceedDisabled =
    currentStep === 1 ? !selectedPlan : selectedCount !== mealLimit;

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <ProgressIndicator
        variant="compact"
        steps={steps}
        currentStep={currentStep}
      />

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
          {isLoadingMeals ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin mr-2" size={20} />
              <span>Loading meals...</span>
            </div>
          ) : isErrorMeals ? (
            <div className="flex justify-center items-center h-64 text-red-600">
              <span>{mealsError?.message || "Error loading meals."}</span>
            </div>
          ) : (
            // Render meals grid if data is available and no error/loading
            // Ensure 'meals' array is not null/undefined if successful
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(meals || []).map((meal) => (
                <MealItemCard
                  key={meal._id}
                  meal={meal}
                  quantity={mealQuantities[meal._id] || 0}
                  mealLimit={mealLimit}
                  selectedCount={selectedCount}
                />
              ))}
            </div>
          )}
          {/* Navigation buttons for this section */}
          <div className="flex justify-between mt-8">
            <NavigationButtons // Use the NavigationButtons component
              currentStep={currentStep} // Pass current step to control button visibility
              onProceed={handleProceedToDelivery}
              proceedDisabled={proceedDisabled}
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
                <OrderSummary meals={meals} />
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
                    type="submit"
                    form="deliveryForm"
                    className="w-full rounded-button whitespace-nowrap bg-[#B4846C] hover:bg-[#B4846C]/80"
                  >
                    {isPlacingOrder && (
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        size={16}
                      />
                    )}{" "}
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
