// components/booking/ReviewPayment.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// Import the updated BookingState and other types
import {
  useBookingStore,
  EventDetailsData,
  PaymentOption,
  SelectedItem,
  // BookingState,
} from "@/store/bookingStore";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

export const calculateDistance = async (
  origin: string,
  destination: string
): Promise<{ distance: number; duration: number }> => {
  const res = await axios.get("/api", {
    params: { origin, destination },
  });

  return res.data;
};

// Pricing calculation function matching backend logic
const calculatePrice = async (
  eventDetails: EventDetailsData | null,
  selectedItems: SelectedItem[]
): Promise<{
  breakdown: { label: string; amount: string }[];
  total: number;
  staffCost: number;
  equipmentCost: number;
  transportationCost: number;
  itemsTotal: number;
}> => {
  if (!eventDetails) {
    return {
      breakdown: [],
      total: 0,
      staffCost: 0,
      equipmentCost: 0,
      transportationCost: 0,
      itemsTotal: 0,
    };
  }

  const guests = eventDetails.guests;
  const serviceTime = eventDetails.serviceTime;

  // Calculate distance if event address is provided
  let distance = { distance: 0, duration: 0 };
  if (eventDetails.eventAddress) {
    distance = await calculateDistance("", eventDetails.eventAddress);
  }

  // Staff & equipment calculation based on guest count
  let chefs = 0;
  let waiters = 0;
  let equipmentCost = 0;

  if (guests <= 100) {
    chefs = 1;
    waiters = 2;
    equipmentCost = 50;
  } else if (guests <= 200) {
    chefs = 2;
    waiters = 4;
    equipmentCost = 100;
  } else if (guests <= 300) {
    chefs = 4;
    waiters = 5;
    equipmentCost = 250;
  } else if (guests <= 400) {
    chefs = 4;
    waiters = 6;
    equipmentCost = 300;
  } else if (guests <= 500) {
    chefs = 4;
    waiters = 8;
    equipmentCost = 350;
  }

  // Staff rates based on service time
  let chefRate = 0;
  let waiterRate = 0;

  if (serviceTime <= 5) {
    chefRate = 18.5;
    waiterRate = 12.5;
  } else if (serviceTime <= 10) {
    chefRate = 20;
    waiterRate = 13.5;
  } else if (serviceTime <= 15) {
    chefRate = 22.5;
    waiterRate = 14.5;
  }

  // Driver charge calculation based on travel time
  let driverChargePh = 0;
  const distanceHour = distance.duration;

  if (distanceHour < 1) driverChargePh = 10;
  else if (distanceHour < 2) driverChargePh = 20;
  else if (distanceHour < 3) driverChargePh = 30;
  else if (distanceHour < 4) driverChargePh = 40;

  // Transportation cost calculation
  let chargePermile = 0;
  if (distance.distance < 10) {
    chargePermile = 1;
  } else if (distance.distance <= 20) {
    chargePermile = 0.9;
  } else {
    chargePermile = 0.8;
  }

  const transportationCost = chargePermile * distance.distance + driverChargePh;

  // Staff cost calculation
  const chefCost = chefs * chefRate * serviceTime;
  const waiterCost = waiters * waiterRate * serviceTime;
  const staffCost = chefCost + waiterCost;

  // Items total calculation
  const itemsTotal = selectedItems.reduce((total, item) => {
    return total + item.amount * item.quantity;
  }, 0);

  // Total fee calculation
  const total = staffCost + equipmentCost + transportationCost + itemsTotal;

  // Generate breakdown for UI
  const breakdown = [
    {
      label: `Chef Service (${chefs} chefs × £${chefRate.toFixed(
        2
      )}/hr × ${serviceTime} hrs)`,
      amount: `£${chefCost.toFixed(2)}`,
    },
    {
      label: `Waiter Service (${waiters} waiters × £${waiterRate.toFixed(
        2
      )}/hr × ${serviceTime} hrs)`,
      amount: `£${waiterCost.toFixed(2)}`,
    },
    {
      label: "Equipment Rental",
      amount: `£${equipmentCost.toFixed(2)}`,
    },
    {
      label: `Transportation (${distance.distance.toFixed(
        1
      )} miles at £${chargePermile.toFixed(
        2
      )}/mile + £${driverChargePh} driver fee)`,
      amount: `£${transportationCost.toFixed(2)}`,
    },
    ...selectedItems.map((item) => ({
      label: `${item.name || "Item"} (x${item.quantity})`,
      amount: `£${(item.amount * item.quantity).toFixed(2)}`,
    })),
  ];

  return {
    breakdown,
    total,
    staffCost,
    equipmentCost,
    transportationCost,
    itemsTotal,
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

  const [priceDetails, setPriceDetails] = useState<{
    breakdown: { label: string; amount: string }[];
    total: number;
    staffCost: number;
    equipmentCost: number;
    transportationCost: number;
    itemsTotal: number;
  }>({
    breakdown: [],
    total: 0,
    staffCost: 0,
    equipmentCost: 0,
    transportationCost: 0,
    itemsTotal: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Calculate price when component mounts or inputs change
  useEffect(() => {
    const fetchPriceDetails = async () => {
      setIsLoading(true);
      try {
        const details = await calculatePrice(eventDetails, selectedItems);
        setPriceDetails(details);
      } catch (error) {
        console.error("Error calculating price:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceDetails();
  }, [eventDetails, selectedItems]);

  // Calculate deposit amount (40% of total)
  const totalAmount = priceDetails.total;
  const depositAmount = totalAmount * 0.4;

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
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <>£{totalAmount.toFixed(2)}</>
            )}
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
            {isLoading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <>
                £{depositAmount.toFixed(2)}{" "}
                <span className="text-xs text-gray-600">now</span>
              </>
            )}
          </div>
        </div>
      </RadioGroup>
      {/* The "Confirm & Pay" button (in page.tsx) will trigger the finalize action */}
    </div>
  );
};

export default ReviewPayment;
