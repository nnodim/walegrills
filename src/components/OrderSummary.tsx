"use client"; // This component uses client-side state/hooks

import { meals, useMealStore } from "@/store/useMealStore";
import React from "react";

const OrderSummary: React.FC = () => {
  const { plan, mealQuantities, deliveryFee } = useMealStore();

  // Calculate total price based on the plan (as per original HTML logic)
  const planPrice = plan === 10 ? 69.99 : 94.99;
  const total = planPrice + deliveryFee;

  // Get selected meals with quantities > 0
  const selectedMeals = meals
    .filter((meal) => mealQuantities[meal.id] > 0)
    .map((meal) => ({
      ...meal,
      quantity: mealQuantities[meal.id],
    }));

  return (
    <div>
      {" "}
      {/* Sticky positioning */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6">
        {/* Display selected plan */}
        <div className="flex justify-between">
          <span className="text-gray-600">{plan} Meal Plan</span>
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
              {selectedMeals.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
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
          <span className="font-bold text-primary text-xl">
            £{total.toFixed(2)}
          </span>
        </div>
      </div>
      {/* Payment method selection will be placed here in the parent */}
      {/* Navigation buttons will be placed here in the parent */}
    </div>
  );
};

export default OrderSummary;
