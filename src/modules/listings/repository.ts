import { prisma } from "../../config/db.js";
import type {
  CreateListingInput,
  UpdateListingInput,
  ListingFilterInput,
} from "./types.js";

export class ListingRepository {
  async create(farmerId: string, data: CreateListingInput) {
    return prisma.listing.create({
      data: {
        ...data,
        farmerId,
      },
      include: { farmer: { select: { id: true, name: true, location: true } } },
    });
  }

  async findById(id: string) {
    return prisma.listing.findUnique({
      where: { id },
      include: {
        farmer: {
          select: { id: true, name: true, location: true, phoneNumber: true },
        },
        _count: { select: { orders: true } },
      },
    });
  }

  async findMany(filters: ListingFilterInput) {
    const {
      category,
      location,
      crop,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = filters;
    const skip = (page - 1) * limit;

    const where = {
      status: "ACTIVE" as const,
      ...(category && { category }),
      ...(crop && { crop: { contains: crop, mode: "insensitive" as const } }),
      ...(location && {
        location: { contains: location, mode: "insensitive" as const },
      }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice && { gte: minPrice }),
              ...(maxPrice && { lte: maxPrice }),
            },
          }
        : {}),
    };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          farmer: { select: { id: true, name: true, location: true } },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return {
      listings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByFarmer(farmerId: string) {
    return prisma.listing.findMany({
      where: { farmerId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { orders: true } },
      },
    });
  }

  async update(id: string, data: UpdateListingInput) {
    return prisma.listing.update({
      where: { id },
      data,
      include: {
        farmer: { select: { id: true, name: true, location: true } },
      },
    });
  }

  async softDelete(id: string) {
    return prisma.listing.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  }
}
