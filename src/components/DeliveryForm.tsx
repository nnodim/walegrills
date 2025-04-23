"use client";

import React from "react";
import { useForm } from "react-hook-form"; // Import useForm and SubmitHandler
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"; // Assuming you have this utility

// Define the type for your form data
interface DeliveryFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string; // Optional field
  city: string;
  state: string;
  zipCode: string;
  instructions?: string; // Optional field
}

interface DeliveryFormProps {
  onSubmit: (data: DeliveryFormData) => void; // Callback to handle valid form submission
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({ onSubmit }) => {
  // Initialize react-hook-form
  const {
    register, // Function to register inputs
    handleSubmit, // Function to handle form submission
    formState: { errors, }, // Access form state like errors and validity
  } = useForm<DeliveryFormData>({
    // You can set default values here if needed
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      apartment: "", // Initialize optional fields
      city: "",
      state: "",
      zipCode: "",
      instructions: "", // Initialize optional fields
    },
    mode: "onTouched", // Validate on blur
  });

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
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              type="text"
              id="fullName"
              // Register the input field
              {...register("fullName", { required: "Full Name is required" })}
              // className is spread after register to allow customization
              className={cn(
                errors.fullName && "border-red-500 focus-visible:ring-red-500"
              )} // Highlight invalid input
            />
            {/* Display validation error */}
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </p>
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
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              {...register("phone", { required: "Phone Number is required" })}
              className={cn(
                errors.phone && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          {/* Empty div for grid alignment on smaller screens if needed */}
          <div className="hidden md:block"></div>{" "}
          {/* Keep for layout consistency */}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="address">Street Address</Label>
          <Input
            type="text"
            id="address"
            {...register("address", { required: "Street Address is required" })}
            className={cn(
              errors.address && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="apartment">Apartment, Suite, etc. (optional)</Label>
          <Input
            type="text"
            id="apartment"
            // Register optional fields without 'required'
            {...register("apartment")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              id="city"
              {...register("city", { required: "City is required" })}
              className={cn(
                errors.city && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="state">State</Label>
            {/* Consider using a select dropdown for states */}
            <Input
              type="text"
              id="state"
              {...register("state", { required: "State is required" })}
              className={cn(
                errors.state && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              type="text"
              id="zipCode"
              {...register("zipCode", { required: "ZIP Code is required" })}
              className={cn(
                errors.zipCode && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm mt-1">
                {errors.zipCode.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="instructions">Delivery Instructions (optional)</Label>
          <Textarea
            id="instructions"
            rows={3}
            // Register optional textarea
            {...register("instructions")}
          />
        </div>

        {/*
          The submit button will be outside this component (in page.tsx)
          but it must be of type="submit" and within the form element
          (or associated using the form attribute if outside, though less common)
          We pass the onSubmit handler down as a prop.
        */}
        {/*
         Example Submit Button (not rendered here, but for reference):
         <Button type="submit">Place Order</Button>
         */}
      </form>
    </div>
  );
};

export default DeliveryForm;
