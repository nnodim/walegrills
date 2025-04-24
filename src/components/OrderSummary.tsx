// components/OrderSummary.tsx
"use client"; // This component uses client-side state/hooks

import { useMealStore } from "@/store/useMealStore"; // Import useMealStore
import { IProduct } from "@/types";
import React from "react";
// Import the IProduct type

// Define props interface, including the meals data
interface OrderSummaryProps {
  meals: IProduct[] | undefined; // Accept the fetched meals data as a prop
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ meals }) => {
  // Access state from the useMealStore
  const { selectedPlan, mealQuantities, deliveryFee } = useMealStore(); // Use selectedPlan from the updated store

  // Calculate total price based on the selected plan's amount
  // Use the getter from the store if available, or calculate here
  const total = useMealStore((state) => state.getTotalPrice()); // Use the store's getter

  // Use the selectedPlan object's name and amount for display
  const planName = selectedPlan?.name || "No Plan Selected";
  const planPrice = selectedPlan?.amount ?? 0;

  // Get selected meals with quantities > 0 using the passed 'meals' prop
  // Ensure 'meals' is an array before filtering
  const selectedMeals = (meals || [])
    .filter((meal) => mealQuantities[meal._id] > 0) // Filter using product._id as key
    .map((meal) => ({
      ...meal, // Include original meal/product data
      quantity: mealQuantities[meal._id], // Add the selected quantity
    }));

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {" "}
      {/* Added container div with styling */}{" "}
      {/* Sticky positioning might be applied to a parent or wrapper */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6">
        {/* Display selected plan */}
        <div className="flex justify-between">
          {/* Use planName from selectedPlan */}
          <span className="text-gray-600">{planName}</span>
          {/* Use planPrice from selectedPlan amount */}
          <span className="font-medium text-gray-900">
            £{planPrice.toFixed(2)}
          </span>
        </div>

        {/* Display selected meals */}
        {selectedMeals.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Selected Meals:
            </h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              {/* Map over selectedMeals (derived from the 'meals' prop) */}
              {selectedMeals.map((item) => (
                <li key={item._id} className="flex justify-between">
                  {" "}
                  {/* Use item._id as key */}
                  <span>{item.name}</span> {/* Use item.name */}
                  <span className="font-medium">x{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display delivery fee */}
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium text-gray-900">
            £{deliveryFee.toFixed(2)}
          </span>
        </div>

        {/* Display total */}
        <div className="border-t pt-4 flex justify-between">
          <span className="font-medium text-gray-900">Total</span>
          {/* Use the calculated total */}
          <span className="font-bold text-primary text-xl">
            £{total.toFixed(2)}
          </span>
        </div>
      </div>
      {/* Payment method selection and Navigation buttons are handled in the parent (page.tsx) */}
    </div>
  );
};

export default OrderSummary;
