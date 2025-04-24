import axios from "@/lib/axios";
import { BookingPayload, CreateMealOrderApiResponse, CreateMealOrderPayload, CreateMealOrderResponseData } from "@/types";

export const createBooking = async (data: BookingPayload) => {
  const res = await axios.post("/booking", data);
  return res.data.data;
};

export const createMealOrder = async (
  payload: CreateMealOrderPayload
): Promise<CreateMealOrderResponseData> => {
  const response = await axios.post<CreateMealOrderApiResponse>(
    "/foodbox",
    payload
  );
  return response.data.data;
};
