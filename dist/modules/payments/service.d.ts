import { PaymentRepository } from "./repository.js";
export declare class PaymentService {
    private repo;
    constructor(repo: PaymentRepository);
    initiatePayment(buyerId: string, orderId: string): Promise<{
        authorizationUrl: string;
        reference: string;
    }>;
    verifyPayment(reference: string): Promise<{
        message: string;
        transaction: {
            order: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                quantity: number;
                status: import("@prisma/client").$Enums.OrderStatus;
                farmerId: string;
                totalPrice: number;
                listingId: string;
                buyerId: string;
                deliveryMethod: import("@prisma/client").$Enums.DeliveryMethod;
                deliveryDistance: number | null;
                deliveryFee: number;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.TransactionStatus;
            farmerId: string;
            buyerId: string;
            amount: number;
            platformFee: number;
            farmerPayout: number;
            paystackRef: string | null;
            escrowRef: string | null;
            escrowStatus: string | null;
            agentId: string | null;
            orderId: string | null;
        };
    }>;
    releasePayment(orderId: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=service.d.ts.map