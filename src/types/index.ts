export interface IProduct {
  _id: string;
  name: string;
  amount: number;
  description: string;
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