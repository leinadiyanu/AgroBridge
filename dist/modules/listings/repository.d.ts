import type { CreateListingInput, UpdateListingInput, ListingFilterInput } from "./types.js";
export declare class ListingRepository {
    create(farmerId: string, data: CreateListingInput): Promise<{
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
    findById(id: string): Promise<({
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
    }) | null>;
    findMany(filters: ListingFilterInput): Promise<{
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
    findByFarmer(farmerId: string): Promise<({
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
    update(id: string, data: UpdateListingInput): Promise<{
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
    softDelete(id: string): Promise<{
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
//# sourceMappingURL=repository.d.ts.map