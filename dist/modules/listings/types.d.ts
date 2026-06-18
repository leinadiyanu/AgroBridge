import { ListingCategory, ListingStatus } from "@prisma/client";
export interface CreateListingInput {
    crop: string;
    description?: string;
    category: ListingCategory;
    quantity: number;
    unit: string;
    price: number;
    location: string;
    images?: string[];
    availableFrom: Date;
}
export interface UpdateListingInput {
    crop?: string;
    description?: string;
    category?: ListingCategory;
    quantity?: number;
    unit?: string;
    price?: number;
    location?: string;
    images?: string[];
    availableFrom?: Date;
    status?: ListingStatus;
}
export interface ListingFilterInput {
    category?: ListingCategory;
    location?: string;
    crop?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
}
//# sourceMappingURL=types.d.ts.map