import type { CreateOrderInput } from "./types.js";
import { OrderStatus } from "@prisma/client";
export declare class OrderRepository {
    create(buyerId: string, farmerId: string, data: CreateOrderInput, totalPrice: number, deliveryDistance?: number, deliveryFee?: number): Promise<{
        listing: {
            location: string;
            crop: string;
            unit: string;
        };
        farmer: {
            id: string;
            phoneNumber: string;
            name: string;
        };
        buyer: {
            id: string;
            phoneNumber: string;
            name: string;
        };
    } & {
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
    }>;
    findById(id: string): Promise<({
        listing: {
            location: string;
            crop: string;
            price: number;
            unit: string;
        };
        farmer: {
            id: string;
            phoneNumber: string;
            name: string;
        };
        buyer: {
            id: string;
            phoneNumber: string;
            name: string;
        };
        transaction: {
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
        } | null;
    } & {
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
    }) | null>;
    findByBuyer(buyerId: string, page: number, limit: number): Promise<{
        orders: ({
            listing: {
                location: string;
                crop: string;
                unit: string;
            };
            farmer: {
                id: string;
                name: string;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findByFarmer(farmerId: string, page: number, limit: number): Promise<{
        orders: ({
            listing: {
                location: string;
                crop: string;
                unit: string;
            };
            buyer: {
                id: string;
                phoneNumber: string;
                name: string;
            };
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    updateStatus(id: string, status: OrderStatus): Promise<{
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
    }>;
}
//# sourceMappingURL=repository.d.ts.map