import { DeliveryFormData } from "@/components/DeliveryForm";
import { IMealPlan } from "@/types";
import { create } from "zustand";

// export type Plan = 10 | 14;
export type Step = 1 | 2 | 3 | 4;

// Update MealState - mealQuantities keys should be productId (string)
interface MealState {
  currentStep: Step;
  selectedPlan: IMealPlan | null;
  mealLimit: number;
  mealQuantities: { [productId: string]: number };
  deliveryFee: number;
  deliveryFormData: DeliveryFormData | null;
  selectedPaymentMethod: "creditCard" | "paypal" | "applePay" | null;
}

interface MealActions {
  setCurrentStep: (step: Step) => void;
  setSelectedPlan: (plan: IMealPlan) => void;
  increaseMealQuantity: (productId: string) => void;
  decreaseMealQuantity: (productId: string) => void;
  resetMealQuantities: () => void;
  saveDeliveryFormData: (data: DeliveryFormData) => void;
  setSelectedPaymentMethod: (
    method: MealState["selectedPaymentMethod"]
  ) => void;
  getSelectedCount: () => number;
  getTotalPrice: () => number;
  getSelectedPlanId: () => string | null;
}

const initialState: MealState = {
  currentStep: 1,
  selectedPlan: null,
  mealLimit: 0,
  mealQuantities: {},
  deliveryFee: 0,
  deliveryFormData: {
    prefix: "Mr",
    name: "",
    email: "",
    phoneNumber: "",
    deliveryAddress: "",
    deliveryDate: "",
    address: "",
  },
  selectedPaymentMethod: "creditCard",
};

// Helper to calculate total selected meals (remains the same, uses productId as key)
const getSelectedCount = (quantities: {
  [productId: string]: number;
}): number => {
  return Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
};

// Helper to calculate total price (uses selectedPlan amount)
const calculateTotal = (
  selectedPlan: IMealPlan | null,
  deliveryFee: number
): number => {
  const planPrice = selectedPlan?.amount ?? 0;
  return planPrice + deliveryFee;
};

export const useMealStore = create<MealState & MealActions>((set, get) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),

  setSelectedPlan: (plan: IMealPlan) => {
    const match = plan.name.match(/(\d+)\s*Meal Plan/i);
    const newLimit = match ? parseInt(match[1]) : 0;
    set({ selectedPlan: plan, mealLimit: newLimit });
  },

  increaseMealQuantity: (productId) =>
    set((state) => {
      const currentQuantity = state.mealQuantities[productId] || 0;
      const currentSelected = getSelectedCount(state.mealQuantities);
      if (state.selectedPlan && currentSelected >= state.mealLimit) {
        // Check limit only if plan is selected
        console.warn("Cannot add more meals, limit reached.");
        return state;
      }
      return {
        mealQuantities: {
          ...state.mealQuantities,
          [productId]: currentQuantity + 1,
        },
      };
    }),

  decreaseMealQuantity: (productId) =>
    set((state) => {
      const currentQuantity = state.mealQuantities[productId] || 0;
      if (currentQuantity <= 0) return state;
      return {
        mealQuantities: {
          ...state.mealQuantities,
          [productId]: currentQuantity - 1,
        },
      };
    }),

  resetMealQuantities: () => set({ mealQuantities: {} }),

  // New action to save delivery form data
  saveDeliveryFormData: (data) => set({ deliveryFormData: data }),

  // New action to set selected payment method
  setSelectedPaymentMethod: (method) => set({ selectedPaymentMethod: method }),

  // Getters/Selectors
  getSelectedCount: () => getSelectedCount(get().mealQuantities),
  getTotalPrice: () => calculateTotal(get().selectedPlan, get().deliveryFee),
  getSelectedPlanId: () => get().selectedPlan?._id || null,
}));

// Add a separate store for delivery form data for better separation if preferred
interface DeliveryState {
  deliveryFormData: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
    instructions: string;
  };
}

interface DeliveryActions {
  setDeliveryFormData: (
    data: Partial<DeliveryState["deliveryFormData"]>
  ) => void;
  resetDeliveryFormData: () => void;
}

const initialDeliveryFormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
  instructions: "",
};

export const useDeliveryStore = create<DeliveryState & DeliveryActions>(
  (set) => ({
    deliveryFormData: initialDeliveryFormData,
    setDeliveryFormData: (data) =>
      set((state) => ({
        deliveryFormData: { ...state.deliveryFormData, ...data },
      })),
    resetDeliveryFormData: () =>
      set({ deliveryFormData: initialDeliveryFormData }),
  })
);
