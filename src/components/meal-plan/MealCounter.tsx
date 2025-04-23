"use client"; // This component uses client-side state/hooks

import { useMealStore } from "@/store/useMealStore";
import { AlertCircle } from "lucide-react";
import React from "react";

const MealCounter: React.FC = () => {
  const { mealQuantities, mealLimit } = useMealStore();

  // Calculate selected count dynamically
  const selectedCount = Object.values(mealQuantities).reduce(
    (sum, quantity) => sum + quantity,
    0
  );
  const showWarning = selectedCount > 0 && selectedCount === mealLimit; // Show warning only when limit is reached AND some meals are selected

  return (
    <>
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Choose Your Meals</h2>
          <div className="meal-counter px-4 py-2 bg-opacity-10 rounded-full text-[#B4846C] font-medium">
            Selected: <span id="selectedCount">{selectedCount}</span>/
            <span id="mealLimit">{mealLimit}</span>
          </div>
        </div>

        {showWarning && (
          <div className="mb-6 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
            <div className="flex items-start">
              <div className="w-5 h-5 flex items-center justify-center mr-2 mt-0.5">
                <AlertCircle />
              </div>
              <div>
                <p className="font-medium">You&apos;ve reached your meal limit!</p>
                <p className="text-sm">
                  To add more meals, please remove some from your selection or
                  upgrade your plan.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Meal items will be mapped here in the parent page/component */}
        </div>
        {/* Buttons will be here in the parent page/component */}
      </div>
    </>
  );
};

export default MealCounter;
