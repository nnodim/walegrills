import axios from "@/lib/axios";
import { GetPlansResponse, IMealPlan } from "@/types";

export const getPlans = async (): Promise<IMealPlan[]> => {
  const response = await axios.get<GetPlansResponse>("/plan");
  return response.data.data;
};
