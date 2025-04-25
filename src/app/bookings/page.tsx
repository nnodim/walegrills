// app/booking/page.tsx
"use client";

import ProgressIndicator from "@/components/ProgressIndicator";
import SectionHeader from "@/components/SectionHeader";
import BookingSidebar from "@/components/booking/BookingSidebar";
import Confirmation from "@/components/booking/Confirmation";
import EventDetailsForm from "@/components/booking/EventDetailsForm";
import ItemSelection from "@/components/booking/ItemSelection";
import PersonalInfoForm from "@/components/booking/PersponalInfoForm";
import ReviewPayment from "@/components/booking/ReviewPayment";
import { Button } from "@/components/ui/button";
import { createBooking } from "@/services/booking";
import { getProducts } from "@/services/products";
import {
  EventDetailsData,
  PersonalInfoData,
  useBookingStore,
} from "@/store/bookingStore";
import { BookingPayload } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const steps = [
  { id: 1, name: "Personal Info" },
  { id: 2, name: "Event Details" },
  { id: 3, name: "Item Selection" },
  { id: 4, name: "Review & Pay" },
  { id: 5, name: "Confirmation" },
];

const BookingPage: React.FC = () => {
  // Access state and actions from the Zustand store
  const {
    currentStep,
    nextStep,
    prevStep,
    savePersonalInfo,
    saveEventDetails,
    saveSelectedItems,
    personalInfo,
    eventDetails,
    selectedItems,
    selectedPaymentOption,
    finalizeBooking, // Action for Step 3 -> 4 (handles final processing/reference)
  } = useBookingStore();

  const {
    data: products,
    isLoading,
    isError: isErrorProducts,
    error: productsError,
  } = useQuery({
    queryKey: ["getProducts", "productType=general"],
    queryFn: async () => await getProducts("productType=general"),
    enabled: currentStep === 3,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const {
    mutate: createBookingMutation,
    isPending: isPlacingBooking,
    // isSuccess: isBookingSuccess,
    // isError: isBookingError,
    // error: bookingError,
  } = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      console.log("Booking successful:", data);
      // Assuming the API response structure includes data.paymentLink
      const paymentLink = data?.paymentLink;
      const bookingDetails = data?.booking; // Get booking details from response

      if (paymentLink) {
        // Save the booking reference (API's _id) to the store
        if (bookingDetails?._id) {
          finalizeBooking({ booking: { _id: bookingDetails._id } }); // Pass response data to finalizeBooking
        } else {
          // If API doesn't return _id immediately, finalize with partial data or handle differently
          finalizeBooking(data?.data); // Pass what's available
        }

        toast("Booking successful. Redirecting to payment...");

        // Redirect the user to the payment link
        // Use router.push for client-side navigation within Next.js
        window.location.href = data?.paymentLink;

        // Note: The user is being redirected, so the Confirmation step (Step 5)
        // will not be shown immediately in this flow. The user would see Step 5
        // upon returning from the payment link or revisiting the booking page
        // if localStorage persists the step.
      } else {
        // Handle case where paymentLink is missing in successful response
        console.error("Booking successful, but no paymentLink received:", data);
        toast.message("Booking successful, but no paymentLink received.", {
          description: "Please try again.",
        });
        // Optionally still move to step 5 or show a different success state
        if (bookingDetails?._id) {
          finalizeBooking({ booking: { _id: bookingDetails._id } });
        } else {
          finalizeBooking(data?.data);
        }
      }

      // Optionally reset form data here after successful API call
      // resetBooking(); // Decide when to reset state - maybe after final confirmation or on a new booking start
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Booking failed:", error);
      toast.message("Booking failed. Please try again.", {
        description: error.response?.data?.message,
      });
      // Optionally stay on Step 4 or show an error step/message
    },
  });

  // --- Handlers for Form Submissions (Called by onSuccess prop from form components) ---

  // This function is called by PersonalInfoForm when Step 1 form is valid and submitted
  const handlePersonalInfoSuccess = (data: PersonalInfoData) => {
    savePersonalInfo(data); // Save the valid data to the Zustand store
    nextStep(); // Move to the next step (Step 2)
    window.scrollTo(0, 0); // Scroll to top after changing step
  };

  // This function is called by EventDetailsForm when Step 2 form is valid and submitted
  const handleEventDetailsSuccess = (data: EventDetailsData) => {
    saveEventDetails(data); // Save the valid data to the Zustand store
    nextStep(); // Move to the next step (Step 3)
    window.scrollTo(0, 0); // Scroll to top
  };

  const handleItemSelectionSuccess = (
    items: Array<{ productId: string; quantity: number, amount: number }>
  ) => {
    // Filter out items with quantity 0 before saving
    const selectedItemsWithQuantity = items.filter((item) => item.quantity > 0);
    saveSelectedItems(selectedItemsWithQuantity); // Save the selected items to Zustand
    nextStep(); // Move to Review & Pay (New Step 4)
    window.scrollTo(0, 0);
  };

  // --- Handler for the "Confirm & Pay" button (On Step 3) ---

  const handleConfirmPay = () => {
    // Ensure we have all necessary data from previous steps before attempting to send
    if (!personalInfo || !eventDetails || !selectedItems) {
      console.error("Missing data from previous steps for booking.");
      toast("Missing data from previous steps for booking.");
      // Optionally navigate back to the first incomplete step
      return;
    }

    // --- Construct the API Payload ---
    // Map data from Zustand store state to the required API format
    // Address the mapping issues identified previously
    const payload: BookingPayload = {
      prefix: personalInfo.title,
      name: personalInfo.fullName, // Assuming API 'name' is the full name
      email: personalInfo.email,
      phoneNumber: personalInfo.phone,
      numberOfGuests: eventDetails.guests,
      // API expects 'YYYY-MM-DD HH:mm:ss'. Form provides 'YYYY-MM-DD'.
      // Sending date string. API might need time, add inputs if so.
      eventDate: eventDetails.date,
      // API expects a number for serviceTime, form provides a string like '6-10'.
      // Need to map this string to a number. Use a clear mapping or prompt user for duration.
      // Using a basic mapping based on the string value.
      serviceTime: eventDetails.serviceTime, // **Mapping serviceTime string to number**
      eventStyle: eventDetails.eventStyle,
      eventVenue: eventDetails.eventAddress, // Mapping eventAddress to eventVenue
      eventType: eventDetails.eventType,
      // API expects a string like '100', store has 'full' | 'deposit'. Map store value to API value.
      paymentOption: selectedPaymentOption === "full" ? 100 : 40, // **Mapping paymentOption**
      // `selectedItems` is already in the correct format { productId, quantity }[]
      itemsNeeded: selectedItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })), // Use the data saved from the new Step 3
    };

    console.log("Attempting to create booking with payload:", payload);

    // Trigger the mutation
    createBookingMutation(payload);
  };

  // --- Render the correct step component based on currentStep ---
  const renderStepComponent = () => {
    if (currentStep === 3 && (isLoading || isErrorProducts)) {
      return (
        <div className="h-full flex p-6 justify-center items-center">
          {isLoading && <Loader2 className="animate-spin mr-2" />}
          {isLoading
            ? "Loading items..."
            : `Error loading items: ${productsError?.message}`}
        </div>
      );
    }

    switch (currentStep) {
      case 1:
        return <PersonalInfoForm onSuccess={handlePersonalInfoSuccess} />;
      case 2:
        return <EventDetailsForm onSuccess={handleEventDetailsSuccess} />;
      case 3:
        // ReviewPayment component reads data directly from the store
        return (
          <ItemSelection
            products={products || []}
            onSuccess={handleItemSelectionSuccess}
            defaultSelectedItems={selectedItems}
          />
        );
      case 4:
        // ReviewPayment component reads data directly from the store
        return <ReviewPayment />;
      case 5:
        // Confirmation component reads data directly from the store
        return <Confirmation />;
      default:
        return <div>Error: Unknown step</div>; // Fallback
    }
  };

  // --- Logic to determine which navigation buttons to show ---
  const showPrevButton = currentStep > 1 && currentStep < 5; // Show Prev on Steps 2, 3, 4
  const showNextButton = currentStep < 4; // Show Next on Steps 1, 2, 3
  const showPayButton = currentStep === 4; // Show Confirm & Pay on Step 4

  // Disable the Pay button while mutation is in progress
  const isPayButtonDisabled = isPlacingBooking;

  // Disable Next button while loading products (if on Step 3)
  const isNextButtonDisabled = currentStep === 3 && isLoading;

  // Note: The enabled/disabled state of the "Next" button on form steps
  // is handled by react-hook-form internally because the button is type="submit"
  // and associated with the form ID.
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Page Title and Description */}
      <SectionHeader
        title="Book Our Catering Service"
        description="Fill out the form below to book our premium catering service for your special event."
      />

      {/* Progress Indicator (Reads currentStep from store) */}
      <ProgressIndicator
        variant="compact"
        steps={steps}
        currentStep={currentStep}
      />

      {/* Main Content Grid: Form/Review Area and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Form/Review/Confirmation */}
        <div className="lg:col-span-3">
          {renderStepComponent()} {/* Render the active step component */}
        </div>

        {/* Right Column: Sidebar (Sticky positioning handled in component CSS) */}
        <div className="lg:col-span-1">
          <BookingSidebar />
        </div>
      </div>

      {/* --- Navigation Buttons --- */}
      <div className="flex justify-between mt-6">
        {/* Previous Button */}
        {showPrevButton && (
          <Button
            variant="outline" // Use Shadcn outline variant
            className="rounded-button whitespace-nowrap" // Apply custom border radius
            onClick={prevStep} // Trigger prevStep action from store
            // Disable Previous button if a mutation is in progress or products are loading for next step
            disabled={isPlacingBooking || (currentStep === 4 && isLoading)} // Disable prev if placing order OR loading products for the step you'd go back to
          >
            <ArrowLeft className="mr-1" size={16} /> Previous{" "}
            {/* Use Lucide icon with size */}
          </Button>
        )}

        {/* Spacer div to push the right buttons to the end */}
        <div className="ml-auto flex gap-2">
          {/* Next Button (Appears on Step 1, 2, 3) */}
          {showNextButton && (
            <Button
              className="bg-primary text-white px-6 py-2 rounded-button font-medium hover:bg-primary/90 whitespace-nowrap"
              type="submit"
              // Link the button to the ID of the current step's form
              // Add the new form ID for Step 3
              form={
                currentStep === 1
                  ? "personalInfoForm"
                  : currentStep === 2
                  ? "eventDetailsForm"
                  : "itemSelectionForm"
              }
              // Disable while loading products (if on Step 3) or placing booking
              disabled={isNextButtonDisabled || isPlacingBooking}
            >
              {isNextButtonDisabled && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" size={16} />
              )}{" "}
              {/* Show spinner if loading */}
              Next <ArrowRight className="ml-1" size={16} />{" "}
              {/* Use Lucide icon with size */}
            </Button>
          )}

          {/* Confirm & Pay Button (Appears on Step 4) */}
          {showPayButton && (
            <Button
              className="bg-primary text-white px-6 py-2 rounded-button font-medium hover:bg-primary/90 whitespace-nowrap"
              onClick={handleConfirmPay} // Trigger the API call
              disabled={isPayButtonDisabled} // Disable while loading
            >
              {isPlacingBooking && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" size={16} />
              )}{" "}
              {/* Show spinner */}
              Confirm & Pay
            </Button>
          )}
        </div>
      </div>
    </main>
  );
};

export default BookingPage;
