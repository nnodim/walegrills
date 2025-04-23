// components/booking/PersonalInfoForm.tsx
"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form"; // Import useForm and SubmitHandler
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"; // Import Shadcn Select
import { cn } from "@/lib/utils"; // Assuming cn utility
import { useBookingStore } from "@/store/bookingStore"; // Adjust import path
import { ChevronDown } from "lucide-react";

// Define the type for this step's form data
interface PersonalInfoFormData {
  title: string;
  fullName: string;
  phone: string;
  email: string;
}

interface PersonalInfoFormProps {
  // Callback to handle valid form submission, passed from parent (page.tsx)
  onSuccess: (data: PersonalInfoFormData) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSuccess }) => {
  // Get existing data from the store to pre-fill the form if user goes back
  const { personalInfo } = useBookingStore();

  // Initialize react-hook-form
  const {
    register, // Function to register input fields
    handleSubmit, // Function to wrap your submit handler and trigger validation
    formState: { errors }, // Object containing validation errors
    // control, // Needed for integrating with controlled components like Shadcn Select if not registering directly
  } = useForm<PersonalInfoFormData>({
    defaultValues: personalInfo || {
      // Set default values, using data from store if available
      title: "Mr", // Default from HTML
      fullName: "",
      phone: "",
      email: "",
    },
    mode: "onTouched", // Validate on blur
  });

  // This function is called by handleSubmit ONLY if validation passes
  const onSubmit: SubmitHandler<PersonalInfoFormData> = (data) => {
    onSuccess(data); // Call the onSuccess callback from the parent page
  };

  return (
    // The form element needs an ID so the submit button outside this component can reference it
    <form
      id="personalInfoForm"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-sm rounded p-6 mb-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Personal Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Select */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="title">Title</Label>
          {/* Using native select registered with RHF */}
          <div className="relative">
            {" "}
            {/* Container for custom arrow positioning */}
            <select
              id="title"
              {...register("title")} // Register the select field
              className={cn(
                "w-full bg-white border border-gray-300 rounded text-gray-700 py-2 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#B4846C] focus:border-[#B4846C]",
                "block appearance-none" // Use appearance-none to hide default arrow
              )}
            >
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
            </select>
            {/* Custom arrow icon */}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Full Name Input */}
        <div className="relative flex flex-col gap-3">
          {" "}
          {/* relative container for error message */}
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            type="text"
            id="fullName"
            placeholder="John Smith"
            {...register("fullName", { required: "Full Name is required" })} // Register with validation rule
            // Apply error styling conditionally
            className={cn(
              errors.fullName && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {/* Display error message */}
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="relative flex flex-col gap-3">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            type="tel"
            id="phone"
            placeholder="+447123456789"
            {...register("phone", { required: "Phone Number is required" })}
            className={cn(
              errors.phone && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Email Address Input */}
        <div className="relative flex flex-col gap-3">
          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            id="email"
            placeholder="john.smith@example.com"
            {...register("email", {
              required: "Email Address is required",
              pattern: {
                // Basic email pattern validation
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid email address",
              },
            })}
            className={cn(
              errors.email && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>
      {/* The "Next" button (rendered in page.tsx) needs type="submit" and form="personalInfoForm" */}
      {/* to trigger this form's submission and validation */}
    </form>
  );
};

export default PersonalInfoForm;
