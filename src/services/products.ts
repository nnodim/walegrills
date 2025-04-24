import axios from "@/lib/axios";
import { IGetProductsResponse, IProduct } from "@/types";

export const getProducts = async (query: string): Promise<IProduct[]> => {
  const res = await axios.get<IGetProductsResponse>(`/product?${query}`);
  return res.data.data.data;
};
