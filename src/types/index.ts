export interface IProduct {
  _id: string;
  name: string;
  amount: number;
  description: string;
  imageurl?: string;
  calories?: number;
  category: string;
  productType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IProductData {
  totalCount: number;
  data: IProduct[];
}

export interface IGetProductsResponse {
  data: IProductData;
  success: boolean;
  code: number;
  message: string;
  limit: number;
  page: number;
}

export interface BookingPayload {
  prefix: string;
  name: string; // Assuming API 'name' is just the full name string
  email: string;
  phoneNumber: string;
  numberOfGuests: number;
  eventDate: string; // YYYY-MM-DD format from form
  serviceTime: number; // Mapped from string like '6-10'
  eventStyle: string;
  eventVenue: string; // Mapping eventAddress to eventVenue
  eventType: string;
  paymentOption: number; // Mapped from 'full' | 'deposit'
  itemsNeeded: Array<{ productId: string; quantity: number }>; // Now comes from selectedItems state
}

export interface IMealPlan {
  _id: string;
  name: string; // e.g., "10 Meal Plan", "14 Meal Plan"
  amount: number; // The price
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Define the type for the API response structure
export interface GetPlansResponse {
  data: IMealPlan[];
  success: boolean;
  code: number;
  message: string;
}

interface ItemSelectedPayload {
  productId: string;
  quantity: number;
}

// Define the API payload structure for creating a meal order
export interface CreateMealOrderPayload {
  prefix: string; // Need to get this from the form/state
  name: string; // Full name from delivery form
  planId: string; // From selectedPlan._id in store
  email: string; // From delivery form
  deliveryDate: string; // Formatted date/time string
  phoneNumber: string; // From delivery form
  deliveryAddress: string; // From delivery form (address field)
  itemsSelected: ItemSelectedPayload[]; // Array of selected meals
}

export interface Foodbox {
  _id: string;
  prefix: string;
  name: string;
  email: string;
  deliveryDate: string; // ISO date string
  planId: string;
  itemsSelected: ItemSelectedPayload[];
  paymentStatus: string;
  phoneNumber: string;
  deliveryAddress: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  sessionId: string;
}

export interface CreateMealOrderResponseData {
  paymentLink: string;
  foodbox: Foodbox;
}

export interface CreateMealOrderApiResponse {
  data: CreateMealOrderResponseData;
  success: boolean;
  code: number;
  message: string;
}
