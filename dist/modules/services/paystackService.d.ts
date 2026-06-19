import type { PaystackInitResponse, PaystackVerifyResponse } from "../payments/types.js";
export declare const initializePaystackPayment: (email: string, amountInNaira: number, reference: string) => Promise<PaystackInitResponse>;
export declare const verifyPaystackPayment: (reference: string) => Promise<PaystackVerifyResponse>;
//# sourceMappingURL=paystackService.d.ts.map