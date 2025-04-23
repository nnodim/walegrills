import axios from "@/lib/axios";
import { BookingPayload } from "@/types";

export const createBooking = async (data: BookingPayload) => {
    const res = await axios.post("/booking", data);
    return res.data.data;
};