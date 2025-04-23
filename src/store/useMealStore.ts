import { create } from "zustand";

// Define the meal data structure
export interface Meal {
  id: string;
  name: string;
  description: string;
  calories: number;
  imageUrl: string;
}

// Dummy meal data (replace with actual data source if needed)
export const meals: Meal[] = [
  {
    id: "grilled-salmon",
    name: "Grilled Salmon",
    description:
      "Wild-caught salmon with roasted asparagus and lemon herb sauce. 450 calories.",
    calories: 450,
    imageUrl:
      "https://readdy.ai/api/search-image?query=A%20professionally%20plated%20grilled%20salmon%20fillet%20with%20asparagus%20and%20lemon%20wedge%20on%20a%20white%20plate.%20The%20salmon%20has%20perfect%20grill%20marks%2C%20the%20asparagus%20is%20bright%20green%2C%20and%20theres%20a%20small%20garnish%20of%20fresh%20herbs.%20The%20lighting%20is%20bright%20and%20clean%2C%20highlighting%20the%20fresh%2C%20healthy%20meal.&width=600&height=400&seq=1&orientation=landscape",
  },
  {
    id: "teriyaki-chicken",
    name: "Teriyaki Chicken Bowl",
    description:
      "Grilled chicken with teriyaki glaze, steamed broccoli and brown rice. 520 calories.",
    calories: 520,
    imageUrl:
      "https://readdy.ai/api/search-image?query=A%20beautifully%20arranged%20chicken%20teriyaki%20bowl%20with%20steamed%20white%20rice%2C%20grilled%20chicken%20pieces%20glazed%20with%20teriyaki%20sauce%2C%20steamed%20broccoli%2C%20and%20carrots.%20The%20bowl%20is%20white%20ceramic%2C%20and%20the%20food%20is%20arranged%20artistically%20with%20sesame%20seeds%20sprinkled%20on%20top.%20The%20lighting%20is%20bright%20and%20appetizing.&width=600&height=400&seq=2&orientation=landscape",
  },
  {
    id: "mediterranean-quinoa",
    name: "Mediterranean Quinoa Bowl",
    description:
      "Quinoa with roasted vegetables, feta cheese, olives and lemon herb dressing. 380 calories.",
    calories: 380,
    imageUrl:
      "https://readdy.ai/api/search-image?query=A%20fresh%20Mediterranean%20quinoa%20salad%20in%20a%20white%20bowl.%20The%20salad%20contains%20fluffy%20quinoa%2C%20cherry%20tomatoes%2C%20cucumber%2C%20red%20onion%2C%20kalamata%20olives%2C%20and%20feta%20cheese%2C%20with%20a%20sprinkle%20of%20fresh%20herbs.%20A%20small%20dish%20of%20olive%20oil%20and%20lemon%20dressing%20sits%20beside%20it.%20The%20lighting%20is%20bright%20and%20natural%2C%20highlighting%20the%20vibrant%20colors%20of%20the%20fresh%20ingredients.&width=600&height=400&seq=3&orientation=landscape",
  },
  {
    id: "hearty-beef-stew",
    name: "Hearty Beef Stew",
    description:
      "Slow-cooked beef with root vegetables and herbs in a rich broth. 490 calories.",
    calories: 490,
    imageUrl:
      "https://readdy.ai/api/search-image?query=A%20hearty%20beef%20stew%20in%20a%20white%20bowl.%20The%20stew%20contains%20tender%20chunks%20of%20beef%2C%20carrots%2C%20potatoes%2C%20and%20peas%20in%20a%20rich%20brown%20gravy.%20A%20sprig%20of%20fresh%20thyme%20garnishes%20the%20top.%20The%20lighting%20is%20warm%20and%20inviting%2C%20suggesting%20comfort%20food.&width=600&height=400&seq=4&orientation=landscape",
  },
  {
    id: "vegetable-stir-fry",
    name: "Vegetable Stir Fry",
    description:
      "Crisp vegetables and tofu in a ginger-garlic sauce with brown rice. 410 calories.",
    calories: 410,
    imageUrl:
      "https://readdy.ai/api/search-image?query=A%20colorful%20vegetable%20stir%20fry%20with%20tofu%20in%20a%20white%20bowl.%20The%20stir%20fry%20contains%20crisp%20broccoli%2C%20red%20bell%20peppers%2C%20carrots%2C%20snap%20peas%2C%20and%20cubes%20of%20golden-brown%20tofu%2C%20all%20glistening%20with%20sauce.%20A%20pair%20of%20chopsticks%20rests%20beside%20the%20bowl.%20The%20lighting%20is%20bright%20and%20clean%2C%20highlighting%20the%20fresh%20vegetables.&width=600&height=400&seq=5&orientation=landscape",
  },
  {
    id: "turkey-meatloaf",
    name: "Turkey Meatloaf",
    description:
      "Lean turkey meatloaf with sweet potato mash and green beans. 470 calories.",
    calories: 470,
    imageUrl:
      "https://readdy.ai/api/search-image?query=A%20perfectly%20cooked%20turkey%20meatloaf%20slice%20on%20a%20white%20plate%20with%20a%20side%20of%20mashed%20sweet%20potatoes%20and%20green%20beans.%20The%20meatloaf%20has%20a%20glossy%20glaze%20on%20top%2C%20the%20sweet%20potatoes%20are%20smooth%20and%20buttery%2C%20and%20the%20green%20beans%20are%20bright%20and%20crisp.%20The%20lighting%20is%20warm%20and%20homey%2C%20suggesting%20comfort%20food.&width=600&height=400&seq=6&orientation=landscape",
  },
];

export type Plan = 10 | 14;
export type Step = 1 | 2 | 3 | 4;

interface MealState {
  currentStep: Step;
  plan: Plan;
  mealLimit: number;
  mealQuantities: { [mealId: string]: number };
  deliveryFee: number;
  paymentMethod: "creditCard" | "paypal" | "applePay";
}

interface MealActions {
  setCurrentStep: (step: Step) => void;
  setPlan: (plan: Plan) => void;
  increaseMealQuantity: (mealId: string) => void;
  decreaseMealQuantity: (mealId: string) => void;
  resetMealQuantities: () => void;
  setPaymentMethod: (method: MealState["paymentMethod"]) => void;
}

// Helper to calculate total selected meals
const getSelectedCount = (quantities: { [mealId: string]: number }): number => {
  return Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
};

// Helper to calculate total price
const calculateTotal = (plan: Plan, deliveryFee: number): number => {
  // Note: Original HTML had fixed prices per plan, not calculated from meal quantity prices.
  // Let's stick to the original logic: fixed plan price + delivery fee.
  const planPrice = plan === 10 ? 69.99 : 94.99;
  return planPrice + deliveryFee;
};

export const useMealStore = create<MealState & MealActions>((set, get) => ({
  // State
  currentStep: 1,
  plan: 10, // Default plan
  mealLimit: 10, // Default limit
  mealQuantities: {}, // { mealId: quantity }
  deliveryFee: 4.99, // Example delivery fee
  paymentMethod: "creditCard", // Default payment method

  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),

  setPlan: (plan) => {
    const newLimit = plan === 10 ? 10 : 14;
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const currentSelected = getSelectedCount(state.mealQuantities);
      // Optionally reset quantities if changing plan drastically exceeds new limit
      // For simplicity, let's just update the limit and warning will appear
      return {
        plan: plan,
        mealLimit: newLimit,
      };
    });
  },

  increaseMealQuantity: (mealId) =>
    set((state) => {
      const currentQuantity = state.mealQuantities[mealId] || 0;
      const newQuantities = {
        ...state.mealQuantities,
        [mealId]: currentQuantity + 1,
      };
      const currentSelected = getSelectedCount(state.mealQuantities); // Count before update
      if (currentSelected < state.mealLimit) {
        return {
          mealQuantities: newQuantities,
        };
      } else {
        // Prevent increasing if limit is reached, unless it's increasing
        // a meal that already has quantity > 0 (original JS behavior)
        // Let's enforce strict limit: cannot increase ANY meal if at limit
        console.warn("Cannot add more meals, limit reached."); // Or handle with UI feedback
        return state; // No state change if at limit
      }
    }),

  decreaseMealQuantity: (mealId) =>
    set((state) => {
      const currentQuantity = state.mealQuantities[mealId] || 0;
      if (currentQuantity <= 0) return state; // Cannot go below 0
      return {
        mealQuantities: {
          ...state.mealQuantities,
          [mealId]: currentQuantity - 1,
        },
      };
    }),

  resetMealQuantities: () => set({ mealQuantities: {} }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  // You can also add selectors or getters here if needed
  getSelectedCount: () => getSelectedCount(get().mealQuantities), // Zustand v4/v5 allows this
  getTotalPrice: () => calculateTotal(get().plan, get().deliveryFee),
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
