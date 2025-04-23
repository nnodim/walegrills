// components/booking/ReviewPayment.tsx
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// Import the updated BookingState and other types
import {
  useBookingStore,
  EventDetailsData,
  PaymentOption,
  // BookingState,
} from "@/store/bookingStore";
import { cn } from "@/lib/utils";

// Dummy Price Breakdown Calculation (replace with actual logic if needed)
// This function is based on the hardcoded values and structure in the original HTML
// It might need significant updates if item selection affects the price calculation
const calculatePrice = (
  eventDetails: EventDetailsData | null,
  // selectedItems: BookingState["selectedItems"]
): { breakdown: { label: string; amount: string }[]; total: string } => {
  // This is a simplified example based on the HTML's static breakdown.
  // A real calculation would consider guests, time, and the specific selectedItems quantities and their prices.
  // For now, we'll keep the original HTML's example breakdown values but note the selected items.

  if (!eventDetails) {
    return {
      breakdown: [],
      total: "£0.00",
    };
  }

  // Hardcoded values from the HTML example
  const baseRatePerHour = 37.0; // £37.00/hr
  const serviceHours = 8; // 8 hours (assuming this is the duration for the £296 breakdown line)
  const waiterCost = 360.0; // £360.00
  const equipmentRental = 120.0; // £120.00
  const travelFee = 45.0; // £45.00

  const baseCost = baseRatePerHour * serviceHours;
  const total = baseCost + waiterCost + equipmentRental + travelFee; // This calculation matches the HTML total

  const breakdown = [
    {
      label: `Base Rate (2 chefs × £18.50/hr)`,
      amount: `£${baseRatePerHour.toFixed(2)}/hr`,
    },
    {
      label: `Service Duration (${serviceHours} hours)`,
      amount: `£${baseCost.toFixed(2)}`,
    },
    {
      label: `Waiter Service (3 waiters × £15.00/hr)`,
      amount: `£${waiterCost.toFixed(2)}`,
    },
    { label: "Equipment Rental", amount: `£${equipmentRental.toFixed(2)}` },
    { label: "Travel Fee", amount: `£${travelFee.toFixed(2)}` },
  ];

  // Note: This calculation *does not* currently use the selectedItems quantity/price.
  // You would need product prices to make this dynamic.

  return {
    breakdown,
    total: `£${total.toFixed(2)}`, // Format the total
  };
};

const ReviewPayment: React.FC = () => {
  // Access state directly from the store
  const {
    personalInfo,
    eventDetails,
    selectedItems,
    selectedPaymentOption,
    setPaymentOption,
  } = useBookingStore();

  // Calculate price details (using dummy logic for now)
  const priceDetails = calculatePrice(eventDetails);
  const totalAmount = parseFloat(priceDetails.total.replace("£", "")); // Parse total for deposit calculation
  const depositAmount = totalAmount * 0.4; // 40% deposit

  return (
    <div id="step4" className="bg-white shadow-sm rounded p-6 mb-6">
      {" "}
      {/* Updated ID to step4 */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Review & Payment
      </h2>
      {/* Booking Summary */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Booking Summary
        </h3>
        <div className="bg-gray-50 rounded p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-2">
            {/* Display Personal Info */}
            <div className="text-sm text-gray-600">Name:</div>
            <div
              className="text-sm font-medium text-gray-900"
              id="summary-name"
            >
              {personalInfo
                ? `${personalInfo.title}. ${personalInfo.fullName}`
                : "-"}
            </div>
            {/* Display Event Details */}
            <div className="text-sm text-gray-600">Event Date:</div>
            {/* Format date to match HTML output */}
            <div
              className="text-sm font-medium text-gray-900"
              id="summary-date"
            >
              {eventDetails?.date
                ? new Date(eventDetails.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </div>
            <div className="text-sm text-gray-600">Number of Guests:</div>
            <div
              className="text-sm font-medium text-gray-900"
              id="summary-guests"
            >
              {eventDetails?.guests ?? "-"}
            </div>{" "}
            {/* Use ?? for nullish coalescing */}
            <div className="text-sm text-gray-600">Service Time:</div>
            <div
              className="text-sm font-medium text-gray-900"
              id="summary-time"
            >
              {eventDetails?.serviceTime ?? "-"}
            </div>
            <div className="text-sm text-gray-600">EventType:</div>
            <div
              className="text-sm font-medium text-gray-900"
              id="summary-type"
            >
              {eventDetails?.eventType ?? "-"}
            </div>
            <div className="text-sm text-gray-600">Event Style:</div>
            <div
              className="text-sm font-medium text-gray-900"
              id="summary-style"
            >
              {eventDetails?.eventStyle ?? "-"}
            </div>
            {/* Display Event Address */}
            <div className="text-sm text-gray-600 col-span-2">
              Event Address:
            </div>
            <div className="text-sm font-medium text-gray-900 col-span-2">
              {eventDetails?.eventAddress ?? "-"}
            </div>
          </div>

          {/* Display Selected Items (New section from Step 3) */}
          {selectedItems && selectedItems.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 col-span-2">
                Selected Items:
              </div>
              {selectedItems.map((item) => (
                <React.Fragment key={item.productId}>
                  <div className="text-sm text-gray-900">
                    {item.name ?? `Item ${item.productId}`}
                  </div>{" "}
                  {/* Display item name */}
                  <div className="text-sm font-medium text-gray-900 text-right">
                    x{item.quantity}
                  </div>{" "}
                  {/* Display quantity */}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Price Breakdown
        </h3>
        <div className="bg-gray-50 rounded p-4">
          {priceDetails.breakdown.map((item, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {item.amount}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-200 my-2"></div>
          <div className="flex justify-between font-medium">
            <span className="text-gray-900">Total Amount</span>
            <span className="text-primary text-lg">{priceDetails.total}</span>
          </div>
        </div>
      </div>
      {/* Payment Options */}
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Payment Options
      </h3>
      {/* Use Shadcn RadioGroup */}
      <RadioGroup
        defaultValue={selectedPaymentOption} // Control selected state with Zustand
        onValueChange={(value: PaymentOption) => setPaymentOption(value)} // Update Zustand state on change
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        {/* Full Payment Option */}
        <div
          className={cn(
            "border border-gray-200 rounded p-4 hover:border-primary cursor-pointer",
            selectedPaymentOption === "full" && "border-primary" // Highlight active option
          )}
        >
          <div className="flex items-start mb-2">
            <RadioGroupItem
              value="full"
              id="full-payment"
              className="mt-1 mr-2"
            />{" "}
            {/* Add margin */}
            <div>
              <Label
                htmlFor="full-payment"
                className="block text-sm font-medium text-gray-900 mb-1 cursor-pointer"
              >
                Pay Full Amount
              </Label>
              <p className="text-xs text-gray-600">
                Pay the entire amount now and your booking is confirmed. There
                are all set.
              </p>
            </div>
          </div>
          <div className="text-lg font-medium text-primary">
            £{totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Deposit Payment Option */}
        <div
          className={cn(
            "border border-gray-200 rounded p-4 hover:border-primary cursor-pointer",
            selectedPaymentOption === "deposit" && "border-primary" // Highlight active option
          )}
        >
          <div className="flex items-start mb-2">
            <RadioGroupItem
              value="deposit"
              id="deposit-payment"
              className="mt-1 mr-2"
            />{" "}
            {/* Add margin */}
            <div>
              <Label
                htmlFor="deposit-payment"
                className="block text-sm font-medium text-gray-900 mb-1 cursor-pointer"
              >
                Pay 40% Deposit
              </Label>
              <p className="text-xs text-gray-600">
                Pay 40% now and the remaining 60% 3 days before the event.
              </p>
            </div>
          </div>
          <div className="text-lg font-medium text-primary">
            £{depositAmount.toFixed(2)}{" "}
            <span className="text-xs text-gray-600">now</span>
          </div>
        </div>
      </RadioGroup>
      {/* The "Confirm & Pay" button (in page.tsx) will trigger the finalize action */}
    </div>
  );
};

export default ReviewPayment;
