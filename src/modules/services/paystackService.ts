import axios from "axios";
import { AppError } from "../../shared/middleware/index.js";
import type { PaystackInitResponse, PaystackVerifyResponse } from "../payments/types.js";

const PAYSTACK_BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

const paystackClient = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${PAYSTACK_SECRET}`,
    "Content-Type": "application/json",
  },
});

export const initializePaystackPayment = async (
  email: string,
  amountInNaira: number,
  reference: string,
): Promise<PaystackInitResponse> => {
  try {
    const { data } = await paystackClient.post<PaystackInitResponse>(
      "/transaction/initialize",
      {
        email,
        amount: Math.round(amountInNaira * 100), // Paystack expects kobo
        reference,
      },
    );
    return data;
  } catch (err) {
    throw new AppError("Failed to initialize payment", 503);
  }
};

export const verifyPaystackPayment = async (
  reference: string,
): Promise<PaystackVerifyResponse> => {
  try {
    const { data } = await paystackClient.get<PaystackVerifyResponse>(
      `/transaction/verify/${reference}`,
    );
    return data;
  } catch (err) {
    throw new AppError("Failed to verify payment", 503);
  }
};