// components/booking/Confirmation.tsx
"use client"; // This component reads from the store

import Link from "next/link"; // Use Next.js Link for navigation
import React from "react";
// Import the updated BookingState and other types
import { useBookingStore } from "@/store/bookingStore";
import { Check } from "lucide-react";


const Confirmation: React.FC = () => {
  // Read confirmation details and selected items from the store
  const {
    bookingReference,
    personalInfo,
    eventDetails,
    selectedItems,
    selectedPaymentOption,
  } = useBookingStore();

  // Determine payment status display based on selected option
  const paymentStatus =
    selectedPaymentOption === "full" ? "Paid in Full" : "Deposit Paid";

  return (
    <div id="step5" className="bg-white shadow-sm rounded p-6 mb-6">
      {" "}
      {/* Updated ID to step5 */}
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="ri-2x text-green-500" size={40} />{" "}
          {/* Use react-icons size */}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h2>
        <p className="text-gray-600 mb-6">
          Your catering service has been successfully booked.
        </p>

        {/* Confirmation Details Summary */}
        <div className="bg-gray-50 rounded p-4 text-left mb-8 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm text-gray-600">Booking Reference:</div>
            <div className="text-sm font-medium text-gray-900">
              {bookingReference ?? "-"}
            </div>{" "}
            {/* Display generated reference */}
            <div className="text-sm text-gray-600">Event Date:</div>
            {/* Display and format the date from stored eventDetails */}
            <div className="text-sm font-medium text-gray-900">
              {eventDetails?.date
                ? new Date(eventDetails.date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "-"}
            </div>
            <div className="text-sm text-gray-600">Name:</div>
            <div className="text-sm font-medium text-gray-900">
              {personalInfo
                ? `${personalInfo.title}. ${personalInfo.fullName}`
                : "-"}
            </div>
            {/* Display Selected Items if any */}
            {selectedItems && selectedItems.length > 0 && (
              <>
                <div className="text-sm text-gray-600 col-span-2">
                  Selected Items:
                </div>
                <div className="text-sm font-medium text-gray-900 col-span-2">
                  <ul className="list-disc list-inside">
                    {selectedItems.map((item) => (
                      <li key={item.productId}>
                        {item.name ?? `Item ${item.productId}`} x{item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
            <div className="text-sm text-gray-600">Payment Status:</div>
            <div className="text-sm font-medium text-green-600 col-span-1">
              {paymentStatus}
            </div>{" "}
            {/* Display payment status */}
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          A confirmation email has been sent to your email address with all the
          details.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="#"
            className="bg-primary text-white px-6 py-2 rounded-button font-medium hover:bg-primary/90 whitespace-nowrap text-center"
          >
            View Booking Details {/* Link placeholder */}
          </Link>
          <Link
            href="/"
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-button font-medium hover:bg-gray-50 whitespace-nowrap text-center"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
