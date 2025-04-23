/* eslint-disable @next/next/no-img-element */
"use client"; // This component uses client-side state/hooks

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Meal, useMealStore } from "@/store/useMealStore";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface MealItemCardProps {
  meal: Meal;
  quantity: number;
  mealLimit: number;
  selectedCount: number;
}

const MealItemCard: React.FC<MealItemCardProps> = ({
  meal,
  quantity,
  mealLimit,
  selectedCount,
}) => {
  const { increaseMealQuantity, decreaseMealQuantity } = useMealStore();

  // Disable increase button if adding this meal would exceed the limit,
  // UNLESS the user is decreasing another meal first.
  // A simpler logic: disable increase if the total selected count is already >= mealLimit.
  const disableIncrease = selectedCount >= mealLimit;

  return (
    <div className="meal-item bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="h-48 overflow-hidden relative">
        <img
          src={meal.imageUrl}
          alt={meal.name}
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{meal.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{meal.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline" // Use outline variant
              size="icon" // Use icon size for square button
              className="rounded-l-button rounded-r-none border-r-0" // Apply custom border radius
              onClick={() => decreaseMealQuantity(meal.id)}
              disabled={quantity <= 0} // Disable if quantity is 0
            >
              <Minus />
            </Button>
            <Input
              type="number"
              min="0"
              max="10" // Max per item can be higher than meal limit, but total is capped
              value={quantity}
              readOnly // Make readOnly as buttons control quantity
              className="w-12 border-y border-gray-300 text-center text-gray-700 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none" // Style input
            />
            <Button
              variant="outline"
              size="icon"
              className="rounded-r-button rounded-l-none border-l-0" // Apply custom border radius
              onClick={() => increaseMealQuantity(meal.id)}
              disabled={disableIncrease} // Disable based on total limit
            >
              <Plus />
            </Button>
          </div>
          <span className="text-sm text-gray-500">Single Portion</span>
        </div>
      </div>
    </div>
  );
};

export default MealItemCard;
