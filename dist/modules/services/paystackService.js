import axios from "axios";
import { AppError } from "../../shared/middleware/index.js";
const PAYSTACK_BASE_URL = "https://api.paystack.co";
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const paystackClient = axios.create({
    baseURL: PAYSTACK_BASE_URL,
    headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
    },
});
export const initializePaystackPayment = async (email, amountInNaira, reference) => {
    try {
        const { data } = await paystackClient.post("/transaction/initialize", {
            email,
            amount: Math.round(amountInNaira * 100), // Paystack expects kobo
            reference,
        });
        return data;
    }
    catch (err) {
        throw new AppError("Failed to initialize payment", 503);
    }
};
export const verifyPaystackPayment = async (reference) => {
    try {
        const { data } = await paystackClient.get(`/transaction/verify/${reference}`);
        return data;
    }
    catch (err) {
        throw new AppError("Failed to verify payment", 503);
    }
};
//# sourceMappingURL=paystackService.js.map