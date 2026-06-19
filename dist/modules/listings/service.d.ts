import { Role } from "@prisma/client";
import { ListingRepository } from "./repository.js";
import type { CreateListingInput, UpdateListingInput, ListingFilterInput } from "./types.js";
export declare class ListingService {
    private repo;
    constructor(repo: ListingRepository);
    createListing(userId: string, userRole: Role, data: CreateListingInput): Promise<{
        farmer: {
            id: string;
            name: string;
            location: string;
        };
    } & {
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
        priceAlertEnabled: boolean;
    }>;
    getListing(id: string): Promise<{
        _count: {
            orders: number;
        };
        farmer: {
            id: string;
            phoneNumber: string;
            name: string;
            location: string;
        };
    } & {
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
        priceAlertEnabled: boolean;
    }>;
    getListings(filters: ListingFilterInput): Promise<{
        listings: ({
            farmer: {
                id: string;
                name: string;
                location: string;
            };
        } & {
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
            priceAlertEnabled: boolean;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getMyListings(userId: string, userRole: Role): Promise<({
        _count: {
            orders: number;
        };
    } & {
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
        priceAlertEnabled: boolean;
    })[]>;
    updateListing(userId: string, userRole: Role, listingId: string, data: UpdateListingInput): Promise<{
        farmer: {
            id: string;
            name: string;
            location: string;
        };
    } & {
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
        priceAlertEnabled: boolean;
    }>;
    deleteListing(userId: string, userRole: Role, listingId: string): Promise<{
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
        priceAlertEnabled: boolean;
    }>;
}
//# sourceMappingURL=service.d.ts.map