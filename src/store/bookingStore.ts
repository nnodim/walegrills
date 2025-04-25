/* eslint-disable @typescript-eslint/no-explicit-any */
// store/bookingStore.ts
import { create } from "zustand";

// Update BookingStep type to include the new step
export type BookingStep = 1 | 2 | 3 | 4 | 5; // Added Step 3 for Item Selection, shifted others

export type PaymentOption = "full" | "deposit";

// Define types for form data for each step
export interface PersonalInfoData {
  title: string;
  fullName: string;
  phone: string;
  email: string;
}

export interface EventDetailsData {
  guests: number;
  date: string;
  bookingType: "On-site";
  serviceTime: number;
  eventType: string;
  eventStyle: string;
  eventAddress: string;
  note?: string;
}

// Define the type for the selected items, matching the API structure
interface SelectedItem {
  productId: string;
  quantity: number;
  name?: string; // Optional: store name for display
}

// State shape
export interface BookingState {
  currentStep: BookingStep;
  personalInfo: PersonalInfoData | null; // Store data after step 1
  eventDetails: EventDetailsData | null; // Store data after step 2
  selectedItems: SelectedItem[]; // Store items needed after new step 3
  selectedPaymentOption: PaymentOption; // Store selected option from step 4 (old step 3)
  bookingReference: string | null; // For confirmation step (new step 5)
}

// Actions
interface BookingActions {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: BookingStep) => void; // Optional: Allow jumping
  savePersonalInfo: (data: PersonalInfoData) => void;
  saveEventDetails: (data: EventDetailsData) => void;
  saveSelectedItems: (items: SelectedItem[]) => void; // New action to save items
  setPaymentOption: (option: PaymentOption) => void; // Still needed for step 4
  finalizeBooking: (apiResponseData: any) => void;
  resetBooking: () => void; // Action to reset the entire booking state
}

const initialState: BookingState = {
  currentStep: 1,
  personalInfo: null,
  eventDetails: null,
  selectedItems: [], // Initialize as empty array
  selectedPaymentOption: "full", // Default payment option from HTML
  bookingReference: null,
};

export const useBookingStore = create<BookingState & BookingActions>((set) => ({
  ...initialState, // Initialize with default state

  nextStep: () =>
    set((state) => {
      const next = Math.min(state.currentStep + 1, 5) as BookingStep; // Max step is now 5
      return { currentStep: next };
    }),

  prevStep: () =>
    set((state) => {
      const prev = Math.max(state.currentStep - 1, 1) as BookingStep; // Min step is 1
      return { currentStep: prev };
    }),

  goToStep: (step) => set({ currentStep: step }), // Allow jumping directly

  savePersonalInfo: (data) => set({ personalInfo: data }),

  saveEventDetails: (data) => set({ eventDetails: data }),

  saveSelectedItems: (items) => set({ selectedItems: items }), // New action

  setPaymentOption: (option) => set({ selectedPaymentOption: option }),

  finalizeBooking: (apiResponseData: any) =>
    set((state) => {
      const bookingData = apiResponseData;
      const bookingRef = bookingData?._id || state.bookingReference; // Use API _id as reference

      // Optionally update other state based on API response if needed
      // e.g., paymentStatus: bookingData?.paymentStatus,

      return {
        bookingReference: bookingRef,
        currentStep: 5, // Move to the confirmation step (new step 5)
      };
    }),

  resetBooking: () => set(initialState), // Reset all state back to initial
}));
