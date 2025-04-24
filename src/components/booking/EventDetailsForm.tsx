// components/booking/EventDetailsForm.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"; // Assuming cn utility
import { useBookingStore } from "@/store/bookingStore"; // Adjust import path
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form"; // Import Controller for Shadcn components
// No need for RiArrowDownSLine import here if using Shadcn Select's trigger arrow

// Define the type for this step's form data
interface EventDetailsFormData {
  guests: number;
  date: string; // YYYY-MM-DD format
  bookingType: "On-site"; // Readonly in HTML, still included in form data
  serviceTime: number;
  eventType: string;
  eventStyle: string;
  eventAddress: string;
}

interface EventDetailsFormProps {
  onSuccess: (data: EventDetailsFormData) => void; // Callback
}

const EventDetailsForm: React.FC<EventDetailsFormProps> = ({ onSuccess }) => {
  // Get existing data from the store to pre-fill the form
  const { eventDetails } = useBookingStore();

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventDetailsFormData>({
    defaultValues: eventDetails || {
      // Set default values, using data from store if available
      guests: 50, // Default from HTML
      date: "",
      bookingType: "On-site", // Readonly value
      serviceTime: 8, // Default from HTML
      eventType: "wedding", // Default from HTML
      eventStyle: "buffet", // Default from HTML
      eventAddress: "",
    },
    mode: "onTouched", // Validate on blur or submit
  });

  // Custom validation function for the date field (weekend only)
  const validateWeekend = (value: string) => {
    if (!value) return "Event Date is required";
    const selectedDate = new Date(value);
    const day = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) {
      return "Please select a weekend date (Saturday or Sunday)";
    }
    return true; // Validation passes
  };

  // This function is called by handleSubmit ONLY if validation passes
  const onSubmit: SubmitHandler<EventDetailsFormData> = (data) => {
    // data object includes all registered fields, including itemsNeeded array
    onSuccess(data); // Call the onSuccess callback from the parent page
  };

  return (
    <form
      id="eventDetailsForm"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-sm rounded p-6 mb-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Event Details
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Number of Guests Input */}
        <div className="relative flex flex-col gap-3">
          <Label htmlFor="guests">Number of Guests</Label>
          <Input
            type="number"
            id="guests"
            placeholder="50"
            {...register("guests", {
              required: "Number of Guests is required",
              min: { value: 1, message: "Must be at least 1 guest" },
              valueAsNumber: true, // Convert input value to a number
            })}
            className={cn(
              errors.guests && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.guests && (
            <p className="text-red-500 text-sm mt-1">{errors.guests.message}</p>
          )}
        </div>

        {/* Event Date Input */}
        <div className="relative flex flex-col gap-3">
          <Label htmlFor="date">Event Date (Sat/Sun only)</Label>
          <Input
            type="date"
            id="date"
            {...register("date", { validate: validateWeekend })} // Use custom validation
            className={cn(
              errors.date && "border-red-500 focus-visible:ring-red-500"
            )}
            // Note: Custom styling for the date picker icon is challenging.
            // The CSS in globals.css might work in some browsers/setups.
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        {/* Booking Type (Readonly) */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="bookingType">Booking Type</Label>
          <Input
            type="text"
            id="bookingType"
            value="On-site"
            readOnly // Make it readonly as in the HTML
            {...register("bookingType")} // Still register to include in form data
            className="w-full bg-gray-100 border border-gray-300 rounded text-gray-700 py-2 px-3 cursor-not-allowed"
          />
        </div>

        {/* Service Time Select (Using Controller for Shadcn Select) */}
        <div className="relative flex flex-col gap-3">
          <Label htmlFor="serviceTime">Service Time</Label>
          <Input
            type="number"
            id="serviceTime"
            placeholder="8"
            {...register("serviceTime", {
              required: "Service Time is required",
              min: { value: 1, message: "Must be at least 1 guest" },
              valueAsNumber: true,
            })}
            className={cn(
              errors.serviceTime && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.serviceTime && (
            <p className="text-red-500 text-sm mt-1">
              {errors.serviceTime.message}
            </p>
          )}
        </div>

        {/* Event Type Select (Using Controller for Shadcn Select) */}
        <div className="relative flex flex-col gap-3">
          <Label htmlFor="eventType">Event Type</Label>
          <Input
            id="eventType"
            placeholder="Wedding"
            {...register("eventType", {
              required: "Event Type is required",
            })}
            className={cn(
              errors.eventType && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.eventType && (
            <p className="text-red-500 text-sm mt-1">
              {errors.eventType.message}
            </p>
          )}
        </div>

        {/* Event Style Select (Using Controller for Shadcn Select) */}
        <div className="relative flex flex-col gap-3">
          <Label htmlFor="eventStyle">Event Style</Label>
          <Input
            id="eventStyle"
            placeholder="Buffet..."
            {...register("eventStyle", {
              required: "Event Style is required",
            })}
            className={cn(
              errors.eventStyle && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.eventStyle && (
            <p className="text-red-500 text-sm mt-1">
              {errors.eventStyle.message}
            </p>
          )}
        </div>

        {/* Event Address Textarea */}
        <div className="md:col-span-2 relative flex flex-col gap-3">
          <Label htmlFor="eventAddress">Event Address</Label>
          <Textarea
            id="eventAddress"
            rows={3}
            placeholder="123 Main Street, London, SW1A 1AA"
            {...register("eventAddress", {
              required: "Event Address is required",
            })}
            className={cn(
              errors.eventAddress && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.eventAddress && (
            <p className="text-red-500 text-sm mt-1">
              {errors.eventAddress.message}
            </p>
          )}
        </div>
        {/* The "Next" button (in page.tsx) needs type="submit" and form="eventDetailsForm" */}
      </div>
    </form>
  );
};

export default EventDetailsForm;
