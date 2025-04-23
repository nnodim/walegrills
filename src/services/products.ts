import axios from "@/lib/axios";
import { IGetProductsResponse } from "@/types";

export const getProducts = async (query: string) => {
  const res = await axios.get<IGetProductsResponse>(`/product?${query}`);
  return res.data.data.data;
};
