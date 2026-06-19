import { prisma } from "../../config/db.js";
import { OrderStatus } from "@prisma/client";
export class OrderRepository {
    async create(buyerId, farmerId, data, totalPrice, deliveryDistance, deliveryFee = 0) {
        return prisma.order.create({
            data: {
                listingId: data.listingId,
                buyerId,
                farmerId,
                quantity: data.quantity,
                totalPrice,
                deliveryMethod: data.deliveryMethod,
                deliveryDistance: deliveryDistance ?? null,
                deliveryFee,
                status: "PENDING",
            },
            include: {
                listing: { select: { crop: true, unit: true, location: true } },
                buyer: { select: { id: true, name: true, phoneNumber: true } },
                farmer: { select: { id: true, name: true, phoneNumber: true } },
            },
        });
    }
    async findById(id) {
        return prisma.order.findUnique({
            where: { id },
            include: {
                listing: {
                    select: { crop: true, unit: true, price: true, location: true },
                },
                buyer: { select: { id: true, name: true, phoneNumber: true } },
                farmer: { select: { id: true, name: true, phoneNumber: true } },
                transaction: true,
            },
        });
    }
    async findByBuyer(buyerId, page, limit) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { buyerId },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    listing: { select: { crop: true, unit: true, location: true } },
                    farmer: { select: { id: true, name: true } },
                },
            }),
            prisma.order.count({ where: { buyerId } }),
        ]);
        return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findByFarmer(farmerId, page, limit) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where: { farmerId },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    listing: { select: { crop: true, unit: true, location: true } },
                    buyer: { select: { id: true, name: true, phoneNumber: true } },
                },
            }),
            prisma.order.count({ where: { farmerId } }),
        ]);
        return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async updateStatus(id, status) {
        return prisma.order.update({
            where: { id },
            data: { status },
        });
    }
}
//# sourceMappingURL=repository.js.map