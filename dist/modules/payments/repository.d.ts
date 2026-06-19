export declare class PaymentRepository {
    createTransaction(data: {
        orderId: string;
        farmerId: string;
        buyerId: string;
        agentId?: string;
        amount: number;
        platformFee: number;
        farmerPayout: number;
        paystackRef: string;
    }): Promise<{
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
    }>;
    findByPaystackRef(ref: string): Promise<({
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
    }) | null>;
    findByOrderId(orderId: string): Promise<{
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
    } | null>;
    updateStatus(id: string, status: "PENDING" | "COMPLETED" | "FAILED"): Promise<{
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
    }>;
    updateEscrow(id: string, escrowRef: string, escrowStatus: string): Promise<{
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
    }>;
}
//# sourceMappingURL=repository.d.ts.map