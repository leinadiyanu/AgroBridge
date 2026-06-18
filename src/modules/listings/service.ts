import { Role } from "@prisma/client";
import { ListingRepository } from "./repository.js";
import type { CreateListingInput, UpdateListingInput, ListingFilterInput } from "./types.js";
import { AppError } from "../../shared/middleware/index.js";

export class ListingService {
  constructor(private repo: ListingRepository) {}

  async createListing(userId: string, userRole: Role, data: CreateListingInput) {
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

  async getListing(id: string) {
    const listing = await this.repo.findById(id);
    if (!listing) throw new AppError("Listing not found", 404);
    return listing;
  }

  async getListings(filters: ListingFilterInput) {
    return this.repo.findMany(filters);
  }

  async getMyListings(userId: string, userRole: Role) {
    if (userRole !== Role.FARMER) {
      throw new AppError("Only farmers have listings", 403);
    }
    return this.repo.findByFarmer(userId);
  }

  async updateListing(
    userId: string,
    userRole: Role,
    listingId: string,
    data: UpdateListingInput,
  ) {
    if (userRole !== Role.FARMER) {
      throw new AppError("Only farmers can update listings", 403);
    }

    const listing = await this.repo.findById(listingId);
    if (!listing) throw new AppError("Listing not found", 404);

    if (listing.farmerId !== userId) {
      throw new AppError("You can only update your own listings", 403);
    }

    // Prevent updating a sold or expired listing
    if (listing.status === "SOLD" || listing.status === "EXPIRED") {
      throw new AppError(`Cannot update a ${listing.status.toLowerCase()} listing`, 400);
    }

    return this.repo.update(listingId, data);
  }

  async deleteListing(userId: string, userRole: Role, listingId: string) {
    if (userRole !== Role.FARMER) {
      throw new AppError("Only farmers can delete listings", 403);
    }

    const listing = await this.repo.findById(listingId);
    if (!listing) throw new AppError("Listing not found", 404);

    if (listing.farmerId !== userId) {
      throw new AppError("You can only delete your own listings", 403);
    }

    if (listing.status === "SOLD") {
      throw new AppError("Cannot delete a sold listing", 400);
    }

    return this.repo.softDelete(listingId);
  }
}