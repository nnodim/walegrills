"use client"; // This component uses client-side state/hooks

import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { Plan, useMealStore } from "@/store/useMealStore";

const MealPlanSelector: React.FC = () => {
  const { plan, setPlan } = useMealStore();

  const plans = [
    {
      value: 10,
      name: "10 Meal Plan",
      price: "£69.99",
      description:
        "Perfect for individuals or couples. Choose any 10 meals from our weekly rotating menu.",
      features: [
        "$8.99 per meal", // Note: Original HTML had fixed price, this is a derived benefit
        "Free delivery on first order", // This might conflict with fixed delivery fee
        "Pause or cancel anytime",
      ],
    },
    {
      value: 14,
      name: "14 Meal Plan",
      price: "£94.99",
      description:
        "Ideal for families or meal prep enthusiasts. Choose any 14 meals from our weekly rotating menu.",
      features: [
        "$8.49 per meal", // Note: Original HTML had fixed price, this is a derived benefit
        "Free delivery on all orders", // This might conflict with fixed delivery fee
        "Priority customer support",
        "Pause or cancel anytime",
      ],
    },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      <RadioGroup
        defaultValue={plan.toString()}
        onValueChange={(value) => setPlan(parseInt(value) as Plan)}
        className="grid md:grid-cols-2 gap-8 col-span-full" // Span full width for the grid
      >
        {plans.map((p) => (
          <div key={p.value}>
            <RadioGroupItem
              value={p.value.toString()}
              id={`plan${p.value}`}
              className="sr-only"
            />{" "}
            {/* Hide default radio */}
            <Label
              htmlFor={`plan${p.value}`}
              className="relative flex flex-col items-start justify-between rounded-lg border-2 border-gray-200 bg-white h-72 p-6 shadow-md transition-all hover:border-[#B4846C] cursor-pointer"
              style={{
                borderColor:
                  plan === p.value ? "#B4846C" : "" /* gray-300 */,
              }}
            >
              {/* Custom radio indicator */}
              <div className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center">
                <div
                  className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                  data-checked={plan === p.value ? "true" : "false"} // Use data attribute for styling
                  style={{
                    borderColor:
                      plan === p.value ? "#B4846C" : "#d1d5db" /* gray-300 */,
                  }} // Apply border color
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: plan === p.value ? "#B4846C" : "white",
                    }} // Apply background color
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-start mb-4 w-full">
                <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                <span className="text-2xl font-bold text-[#B4846C]">
                  {p.price}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{p.description}</p>
              <ul className="space-y-2 mb-6">
                {p.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center text-[#B4846C] mr-2">
                      <Check />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default MealPlanSelector;
