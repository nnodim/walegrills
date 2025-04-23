import React from "react";
import { Check } from "lucide-react";

// Type definitions
export type StepId = number;

export interface Step {
  id: StepId;
  name: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: StepId;
  variant?: "default" | "connected" | "compact";
  accentColor?: string;
  className?: string;
}

/**
 * A reusable progress indicator component that shows a sequence of steps
 * and highlights the current active step.
 */
const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  steps,
  currentStep,
  variant = "default",
  accentColor = "#B4846C",
  className = "",
}) => {
  // Helper function to determine if a step is active or complete
  const isActive = (stepId: StepId) => stepId === currentStep;
  const isComplete = (stepId: StepId) => stepId < currentStep;

  // Dynamically combine classes
  const cn = (...classes: (string | boolean | undefined)[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <div className={cn("flex justify-center w-full mb-10", className)}>
      <div
        className={cn(
          "relative flex",
          variant === "connected"
            ? "w-full justify-between"
            : "items-center space-x-4 sm:space-x-8 md:space-x-16"
        )}
      >
        {/* Connecting line for connected variant */}
        {variant === "connected" && (
          <div className="w-full absolute top-3 h-0.5 bg-gray-200"></div>
        )}

        {/* Steps */}
        {steps.map((step) => {
          const active = isActive(step.id);
          const complete = isComplete(step.id);

          // Determine circle size based on variant
          const circleSize = variant === "compact" ? "w-6 h-6" : "w-10 h-10";
          const textSize = variant === "compact" ? "text-xs" : "text-sm";

          return (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center",
                variant === "connected" && "z-10"
              )}
            >
              {/* Step Circle */}
              <div
                className={cn(
                  circleSize,
                  "rounded-full flex items-center justify-center mb-2",
                  complete || active ? "text-white" : "text-gray-500",
                  complete || active ? `bg-[${accentColor}]` : "bg-gray-200"
                )}
                style={{
                  backgroundColor: complete || active ? accentColor : undefined,
                }}
              >
                {complete ? (
                  <Check
                    className={variant === "compact" ? "w-4 h-4" : "w-6 h-6"}
                  />
                ) : (
                  <span
                    className={cn(
                      "font-medium",
                      variant === "compact" ? "text-xs" : "text-sm"
                    )}
                  >
                    {step.id}
                  </span>
                )}
              </div>

              {/* Step Name */}
              <span
                className={cn(
                  textSize,
                  active ? "font-medium" : "",
                  active ? `text-[${accentColor}]` : "text-gray-600"
                )}
                style={{
                  color: active ? accentColor : undefined,
                }}
              >
                {step.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
