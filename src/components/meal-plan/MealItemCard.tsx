// components/MealItemCard.tsx
"use client";

import React from "react";
import Image from "next/image"; // Assuming you use Next.js Image
import { Button } from "@/components/ui/button"; // Shadcn Button
import { useMealStore } from "@/store/useMealStore"; // Adjust import path
import { Plus, Minus } from "lucide-react"; // Icons
import { IProduct } from "@/types";

// Update MealItemCardProps to use IProduct type for 'meal'
interface MealItemCardProps {
  meal: IProduct; // Expecting an IProduct object from API
  quantity: number; // Quantity selected for this meal (from store)
  mealLimit: number; // Total meals allowed in the plan (from store)
  selectedCount: number; // Total meals currently selected (from store)
}

const MealItemCard: React.FC<MealItemCardProps> = ({
  meal, // This is now an IProduct fetched from the API
  quantity,
  mealLimit,
  selectedCount,
}) => {
  // Access increase/decrease actions directly from the store
  const { increaseMealQuantity, decreaseMealQuantity } = useMealStore();

  // Determine if the '+' button should be disabled
  const canIncrease = selectedCount < mealLimit; // Cannot add more if limit is reached

  // Determine if the '-' button should be disabled
  const canDecrease = quantity > 0; // Cannot decrease if quantity is already 0

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
      {/* Image */}
      {/* Use Next.js Image component */}
      <div className="relative w-full h-48">
        {" "}
        {/* Container for Image */}
        <Image
          src={meal.imageurl || "/placeholder-meal.jpg"} // Use imageUrl from IProduct, fallback to placeholder
          alt={meal.name} // Use name from IProduct
          fill // Fill the parent container
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive sizes
          // Optional: Add priority for LCP images
          // priority={...}
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {" "}
        {/* flex-grow to push control to bottom */}
        {/* Meal Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {meal.name}
        </h3>{" "}
        {/* Use name from IProduct */}
        {/* Meal Description */}
        <p className="text-sm text-gray-600 mb-3">{meal.description}</p>{" "}
        {/* Use description from IProduct */}
        {/* Calories (if available in IProduct) */}
        {meal.calories && (
          <p className="text-sm font-medium text-gray-700 mb-4">
            {meal.calories} calories
          </p>
        )}
        {/* Quantity Control */}
        {/* mt-auto pushes this control div to the bottom */}
        <div className="flex items-center justify-between mt-auto">
          {/* Quantity Display */}
          <span className="text-lg font-bold text-gray-900">{quantity}</span>

          {/* Add/Remove Buttons */}
          <div className="flex items-center gap-2">
            {/* Minus Button */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full" // Make buttons round
              // Call decrease action with product._id
              onClick={() => decreaseMealQuantity(meal._id)}
              disabled={!canDecrease} // Disable if quantity is 0
              aria-label={`Decrease quantity of ${meal.name}`} // Accessibility
            >
              <Minus size={16} /> {/* Use Lucide Minus icon */}
            </Button>

            {/* Plus Button */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full" // Make buttons round
              // Call increase action with product._id
              onClick={() => increaseMealQuantity(meal._id)}
              disabled={!canIncrease} // Disable if meal limit is reached
              aria-label={`Increase quantity of ${meal.name}`} // Accessibility
            >
              <Plus size={16} /> {/* Use Lucide Plus icon */}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealItemCard;
