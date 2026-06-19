import { Role } from "@prisma/client";
import { OrderRepository } from "./repository.js";
import { ListingRepository } from "../listings/repository.js";
import type { CreateOrderInput, OrderFilterInput } from "./types.js";
export declare class OrderService {
    private repo;
    private listingRepo;
    constructor(repo: OrderRepository, listingRepo: ListingRepository);
    placeOrder(buyerId: string, userRole: Role, data: CreateOrderInput): Promise<{
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
    getMyOrders(userId: string, userRole: Role, filters: OrderFilterInput): Promise<{
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
    } | {
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
    getOrder(userId: string, userRole: Role, orderId: string): Promise<{
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
    }>;
    confirmOrder(userId: string, userRole: Role, orderId: string): Promise<{
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
    cancelOrder(userId: string, userRole: Role, orderId: string): Promise<{
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
    completeOrder(userId: string, userRole: Role, orderId: string): Promise<{
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
//# sourceMappingURL=service.d.ts.map