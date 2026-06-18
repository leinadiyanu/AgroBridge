import { prisma } from "../../config/db.js";
export class ListingRepository {
    async create(farmerId, data) {
        return prisma.listing.create({
            data: {
                ...data,
                farmerId,
            },
            include: { farmer: { select: { id: true, name: true, location: true } } },
        });
    }
    async findById(id) {
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
    async findMany(filters) {
        const { category, location, crop, minPrice, maxPrice, page = 1, limit = 20, } = filters;
        const skip = (page - 1) * limit;
        const where = {
            status: "ACTIVE",
            ...(category && { category }),
            ...(crop && { crop: { contains: crop, mode: "insensitive" } }),
            ...(location && {
                location: { contains: location, mode: "insensitive" },
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
    async findByFarmer(farmerId) {
        return prisma.listing.findMany({
            where: { farmerId },
            orderBy: { createdAt: "desc" },
            include: {
                _count: { select: { orders: true } },
            },
        });
    }
    async update(id, data) {
        return prisma.listing.update({
            where: { id },
            data,
            include: {
                farmer: { select: { id: true, name: true, location: true } },
            },
        });
    }
    async softDelete(id) {
        return prisma.listing.update({
            where: { id },
            data: { status: "CANCELLED" },
        });
    }
}
//# sourceMappingURL=repository.js.map