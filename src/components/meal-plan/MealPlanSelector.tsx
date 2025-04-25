"use client";

import React, { useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useMealStore } from "@/store/useMealStore";
import { getPlans } from "@/services/plans";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { IMealPlan } from "@/types";

// Skeleton component for meal plan card
const MealPlanSkeleton: React.FC = () => {
  return (
    <div className="relative flex flex-col items-start justify-between rounded-lg border-2 border-gray-200 bg-white h-72 p-6 shadow-md">
      {/* Skeleton for radio */}
      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gray-200 animate-pulse"></div>

      <div className="flex justify-between items-start mb-4 w-full">
        {/* Skeleton for title */}
        <div className="h-7 w-40 bg-gray-200 rounded animate-pulse"></div>
        {/* Skeleton for price */}
        <div className="h-7 w-20 bg-gray-200 rounded animate-pulse mr-5"></div>
      </div>

      {/* Skeleton for description */}
      <div className="h-5 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-4"></div>

      {/* Skeleton for features */}
      <ul className="space-y-3 w-full mb-6">
        <li className="flex items-center">
          <div className="w-5 h-5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </li>
        <li className="flex items-center">
          <div className="w-5 h-5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
        </li>
        <li className="flex items-center">
          <div className="w-5 h-5 bg-gray-200 rounded-full mr-2 animate-pulse"></div>
          <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
        </li>
      </ul>
    </div>
  );
};

const MealPlanSelector: React.FC = () => {
  const { selectedPlan, setSelectedPlan } = useMealStore();
  const selectedPlanId = selectedPlan?._id || null;

  const {
    data: plans,
    isLoading,
    isError,
    error,
  } = useQuery<IMealPlan[], Error>({
    queryKey: ["mealPlans"],
    queryFn: getPlans,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      console.error("Error fetching meal plans:", error);
      toast("Error fetching meal plans. Please try again.");
    }
  }, [isError, error]);

  useEffect(() => {
    if (plans && plans.length > 0 && !selectedPlan) {
      const defaultPlan =
        plans.find((p) => p.name.includes("10 Meal Plan")) || plans[0];
      setSelectedPlan(defaultPlan);
    }
  }, [plans, selectedPlan, setSelectedPlan]);

  // Show error state if fetching failed and no plans are available
  if (!isLoading && (!plans || plans.length === 0)) {
    return (
      <div className="flex justify-center items-center h-32 text-red-600">
        <span>Could not load meal plans. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {isLoading ? (
        // Show skeleton loaders when loading
        <>
          <div className="md:col-span-1">
            <MealPlanSkeleton />
          </div>
          <div className="md:col-span-1">
            <MealPlanSkeleton />
          </div>
        </>
      ) : (
        // Show actual content when data is loaded
        <RadioGroup
          value={selectedPlanId || undefined}
          onValueChange={(planId: string) => {
            const plan = plans?.find((p) => p._id === planId);
            if (plan) {
              setSelectedPlan(plan);
            } else {
              console.warn(`Selected plan with ID ${planId} not found.`);
            }
          }}
          className="grid md:grid-cols-2 gap-8 col-span-full"
        >
          {plans?.map((p) => (
            <div key={p._id}>
              <RadioGroupItem
                value={p._id}
                id={`plan-${p._id}`}
                className="sr-only"
              />
              <Label
                htmlFor={`plan-${p._id}`}
                className="relative flex flex-col items-start justify-between rounded-lg border-2 border-gray-200 bg-white h-72 p-6 shadow-md transition-all hover:border-[#B4846C] cursor-pointer"
                style={{
                  borderColor: selectedPlanId === p._id ? "#B4846C" : "",
                }}
              >
                <div className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center">
                  <div
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    data-checked={selectedPlanId === p._id ? "true" : "false"}
                    style={{
                      borderColor:
                        selectedPlanId === p._id ? "#B4846C" : "#d1d5db",
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          selectedPlanId === p._id ? "#B4846C" : "white",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-start mb-4 w-full">
                  <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                  <span className="text-2xl font-bold text-[#B4846C] mr-5">
                    £{p.amount.toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{p.description}</p>
                <ul className="space-y-2 mb-6">
                  {(p.name.includes("10 Meal Plan")
                    ? [
                        "Save time and money",
                        "Eat balanced, nutritious meals",
                        "Reduce decision fatigue",
                        "Halal and Healthy Meals",
                      ]
                    : [
                        "Save time and money",
                        "Eat balanced, nutritious meals",
                        "Reduce decision fatigue",
                        "Halal and Healthy Meals",
                      ]
                  ).map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-5 h-5 flex items-center justify-center text-[#B4846C] mr-2">
                        <Check size={20} />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

export default MealPlanSelector;
