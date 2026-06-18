import { Role } from "@prisma/client";
import { ListingRepository } from "./repository.js";
import { AppError } from "../../shared/middleware/index.js";
export class ListingService {
    constructor(repo) {
        this.repo = repo;
    }
    async createListing(userId, userRole, data) {
        if (userRole !== Role.FARMER) {
            throw new AppError("Only farmers can create listings", 403);
        }
        if (data.quantity <= 0) {
            throw new AppError("Quantity must be greater than 0", 400);
        }
        if (data.price <= 0) {
            throw new AppError("Price must be greater than 0", 400);
        }
        return this.repo.create(userId, data);
    }
    async getListing(id) {
        const listing = await this.repo.findById(id);
        if (!listing)
            throw new AppError("Listing not found", 404);
        return listing;
    }
    async getListings(filters) {
        return this.repo.findMany(filters);
    }
    async getMyListings(userId, userRole) {
        if (userRole !== Role.FARMER) {
            throw new AppError("Only farmers have listings", 403);
        }
        return this.repo.findByFarmer(userId);
    }
    async updateListing(userId, userRole, listingId, data) {
        if (userRole !== Role.FARMER) {
            throw new AppError("Only farmers can update listings", 403);
        }
        const listing = await this.repo.findById(listingId);
        if (!listing)
            throw new AppError("Listing not found", 404);
        if (listing.farmerId !== userId) {
            throw new AppError("You can only update your own listings", 403);
        }
        // Prevent updating a sold or expired listing
        if (listing.status === "SOLD" || listing.status === "EXPIRED") {
            throw new AppError(`Cannot update a ${listing.status.toLowerCase()} listing`, 400);
        }
        return this.repo.update(listingId, data);
    }
    async deleteListing(userId, userRole, listingId) {
        if (userRole !== Role.FARMER) {
            throw new AppError("Only farmers can delete listings", 403);
        }
        const listing = await this.repo.findById(listingId);
        if (!listing)
            throw new AppError("Listing not found", 404);
        if (listing.farmerId !== userId) {
            throw new AppError("You can only delete your own listings", 403);
        }
        if (listing.status === "SOLD") {
            throw new AppError("Cannot delete a sold listing", 400);
        }
        return this.repo.softDelete(listingId);
    }
}
//# sourceMappingURL=service.js.map