import { Role } from "@prisma/client";
export interface UssdSession {
    step: string;
    data: Record<string, string>;
}
export declare class UssdRepository {
    getSession(phoneNumber: string): Promise<UssdSession | null>;
    saveSession(phoneNumber: string, session: UssdSession): Promise<void>;
    deleteSession(phoneNumber: string): Promise<void>;
    findUserByPhone(phoneNumber: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        phoneNumber: string;
        email: string | null;
        name: string;
        location: string;
        pin: string | null;
        passwordHash: string | null;
        farmSize: string | null;
        deliveryAddress: string | null;
        coverageArea: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    createUser(data: {
        phoneNumber: string;
        name: string;
        location: string;
        role: Role;
        pin: string;
    }): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        phoneNumber: string;
        email: string | null;
        name: string;
        location: string;
        pin: string | null;
        passwordHash: string | null;
        farmSize: string | null;
        deliveryAddress: string | null;
        coverageArea: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    verifyPin(phoneNumber: string, pin: string): Promise<boolean>;
    createListing(data: {
        phoneNumber: string;
        crop: string;
        quantity: number;
        price: number;
        location: string;
        availableFrom: string;
    }): Promise<void>;
    getListingsByCrop(crop: string): Promise<any[]>;
    getListingsByPhone(phoneNumber: string): Promise<{
        id: string;
        location: string;
        createdAt: Date;
        updatedAt: Date;
        crop: string;
        description: string | null;
        quantity: number;
        price: number;
        availableFrom: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        images: string[];
        category: import("@prisma/client").$Enums.ListingCategory;
        unit: string;
        farmerId: string;
    }[]>;
    updateListingStatus(id: string, status: "SOLD" | "CANCELLED"): Promise<{
        id: string;
        location: string;
        createdAt: Date;
        updatedAt: Date;
        crop: string;
        description: string | null;
        quantity: number;
        price: number;
        availableFrom: Date;
        status: import("@prisma/client").$Enums.ListingStatus;
        images: string[];
        category: import("@prisma/client").$Enums.ListingCategory;
        unit: string;
        farmerId: string;
    }>;
    getIncomingOrders(phoneNumber: string): Promise<({
        listing: {
            crop: string;
        };
        buyer: {
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
    })[]>;
    updateOrderStatus(id: string, status: "CONFIRMED" | "CANCELLED"): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        quantity: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        farmerId: string;
        totalPrice: number;
        listingId: string;
        buyerId: string;
    }>;
    linkFarmerToAgent(data: {
        agentPhone: string;
        farmerPhone: string;
    }): Promise<void>;
    createTransaction(data: {
        agentPhone: string;
        farmerPhone: string;
        buyerPhone: string;
        amount: number;
    }): Promise<void>;
}
//# sourceMappingURL=repository.d.ts.map