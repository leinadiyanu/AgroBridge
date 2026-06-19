export interface InitiatePaymentInput {
    orderId: string;
}
export interface PaystackInitResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}
export interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data: {
        status: string;
        reference: string;
        amount: number;
        paid_at: string;
    };
}
//# sourceMappingURL=types.d.ts.map