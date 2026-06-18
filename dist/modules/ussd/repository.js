import { PrismaClient, Role } from "@prisma/client";
import redisClient from "../../config/redis.js";
import { hashPassword } from "../../shared/utils/hashPassword.js";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
export class UssdRepository {
    // ─── Redis session methods ───────────────────────────────────────
    async getSession(phoneNumber) {
        const raw = await redisClient.get(`ussd:session:${phoneNumber}`);
        return raw ? JSON.parse(raw) : null;
    }
    async saveSession(phoneNumber, session) {
        await redisClient.set(`ussd:session:${phoneNumber}`, JSON.stringify(session), { EX: 60 * 5 });
    }
    async deleteSession(phoneNumber) {
        await redisClient.del(`ussd:session:${phoneNumber}`);
    }
    // ─── Prisma methods (unchanged) ──────────────────────────────────
    async findUserByPhone(phoneNumber) {
        return prisma.user.findFirst({ where: { phoneNumber } });
    }
    async createUser(data) {
        const hashedPin = await hashPassword(data.pin);
        return prisma.user.create({ data: { ...data, pin: hashedPin } });
    }
    async verifyPin(phoneNumber, pin) {
        const user = await this.findUserByPhone(phoneNumber);
        if (!user || !user.pin)
            return false;
        return bcrypt.compare(pin, user.pin);
    }
    async createListing(data) {
        // prisma.listing.create(...)
    }
    async getListingsByCrop(crop) {
        return prisma.listing.findMany({
            where: {
                crop: { contains: crop, mode: "insensitive" },
                status: "ACTIVE",
            },
            take: 3,
            orderBy: { createdAt: "desc" },
        });
    }
    async getListingsByPhone(phoneNumber) {
        const user = await prisma.user.findUnique({ where: { phoneNumber } });
        if (!user)
            return [];
        return prisma.listing.findMany({
            where: { farmerId: user.id, status: "ACTIVE" },
            orderBy: { createdAt: "desc" },
            take: 3,
        });
    }
    async updateListingStatus(id, status) {
        return prisma.listing.update({ where: { id }, data: { status } });
    }
    async getIncomingOrders(phoneNumber) {
        const user = await prisma.user.findUnique({ where: { phoneNumber } });
        if (!user)
            return [];
        return prisma.order.findMany({
            where: { farmerId: user.id, status: "PENDING" },
            include: {
                listing: { select: { crop: true } },
                buyer: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 3,
        });
    }
    async updateOrderStatus(id, status) {
        return prisma.order.update({ where: { id }, data: { status } });
    }
    async linkFarmerToAgent(data) {
        // prisma.agentFarmer.create(...)
    }
    async createTransaction(data) {
        // prisma.transaction.create(...)
    }
}
// async getTempUser(phoneNumber: string) {
//   return prisma.tempUser.findUnique({
//     where: { phoneNumber },
//   });
// }
// async deleteTempUser(phoneNumber: string) {
//   return prisma.tempUser.delete({
//     where: { phoneNumber },
//   });
// }
// /**
//  * MAIN USER
//  */
// async getUser(phoneNumber: string) {
//   return prisma.user.findUnique({
//     where: { phoneNumber },
//   });
// }
// async createUser(data: {
//   phoneNumber: string;
//   name: string;
//   location: string;
//   role: string;
//   pin?: string;
// }) {
//   return prisma.user.create({
//     data,
//   });
// }
// async updateUser(
//   phoneNumber: string,
//   data: Partial<{
//     name: string;
//     location: string;
//     role: string;
//     pin: string;
//   }>
// ) {
//   return prisma.user.update({
//     where: { phoneNumber },
//     data,
//   });
// }
// /**
//  * USSD REQUESTS (BUY/SELL)
//  */
// async createBuyRequest(data: {
//   phoneNumber: string;
//   crop: string;
//   sessionId: string;
// }) {
//   return prisma.ussdRequest.create({
//     data: {
//       phoneNumber: data.phoneNumber,
//       crop: data.crop,
//       type: "BUY",
//       sessionId: data.sessionId,
//     },
//   });
// }
// async createSellRequest(data: {
//   phoneNumber: string;
//   crop: string;
//   sessionId: string;
// }) {
//   return prisma.ussdRequest.create({
//     data: {
//       phoneNumber: data.phoneNumber,
//       crop: data.crop,
//       type: "SELL",
//       sessionId: data.sessionId,
//     },
//   });
// }
//# sourceMappingURL=repository.js.map