"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // Assuming you have this utility
import { ChevronDown } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form"; // Import useForm and SubmitHandler

// Define the type for your form data
export interface DeliveryFormData {
  prefix: string;
  name: string;
  email: string;
  address: string;
  deliveryDate: string;
  phoneNumber: string;
  deliveryAddress: string;
}

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormData) => void; // Callback to handle valid form submission
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onSubmit }) => {
  // Initialize react-hook-form
  const {
    register, // Function to register inputs
    handleSubmit, // Function to handle form submission
    formState: { errors }, // Access form state like errors and validity
  } = useForm<DeliveryFormData>({
    // You can set default values here if needed
    defaultValues: {
      prefix: "Mr",
      name: "",
      email: "",
      phoneNumber: "",
      deliveryAddress: "",
      deliveryDate: "",
      address: "",
    },
    mode: "onTouched", // Validate on blur
  });

  const validateWeekend = (value: string) => {
    if (!value) return "Event Date is required";
    const selectedDate = new Date(value);
    const day = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) {
      return "Please select a weekend date (Saturday or Sunday)";
    }
    return true; // Validation passes
  };

  // react-hook-form handles the onSubmit logic internally via handleSubmit
  // The form element itself should use the handleSubmit provided by the hook

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>
      {/* The form tag now uses react-hook-form's handleSubmit */}
      {/* The onSubmit callback passed to handleSubmit will only run if validation passes */}
      <form
        id="deliveryForm"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="prefix">prefix</Label>
            {/* Using native select registered with RHF */}
            <div className="relative">
              {" "}
              {/* Container for custom arrow positioning */}
              <select
                id="prefix"
                {...register("prefix")} // Register the select field
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
          <div className="flex flex-col gap-3">
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              // Register the input field
              {...register("name", { required: "Full Name is required" })}
              // className is spread after register to allow customization
              className={cn(
                errors.name && "border-red-500 focus-visible:ring-red-500"
              )} // Highlight invalid input
            />
            {/* Display validation error */}
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
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
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              type="tel"
              id="phoneNumber"
              {...register("phoneNumber", {
                required: "Phone Number is required",
              })}
              className={cn(
                errors.phoneNumber &&
                  "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          {/* Empty div for grid alignment on smaller screens if needed */}
          <div className="relative flex flex-col gap-3">
            <Label htmlFor="deliveryDate">Delivery Date</Label>
            <Input
              type="date"
              id="deliveryDate"
              {...register("deliveryDate", { validate: validateWeekend })} // Use custom validation
              className={cn(
                errors.deliveryDate &&
                  "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.deliveryDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.deliveryDate.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="deliveryAddress">Delivery Address</Label>
          <Input
            type="text"
            id="deliveryAddress"
            {...register("deliveryAddress", {
              required: "Street Address is required",
            })}
            className={cn(
              errors.address && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.deliveryAddress && (
            <p className="text-red-500 text-sm mt-1">
              {errors.deliveryAddress.message}
            </p>
          )}
        </div>
        {/*
          The submit button will be outside this component (in page.tsx)
          but it must be of type="submit" and within the form element
          (or associated using the form attribute if outside, though less common)
          We pass the onSubmit handler down as a prop.
        */}
      </form>
    </div>
  );
};

export default DeliveryForm;
