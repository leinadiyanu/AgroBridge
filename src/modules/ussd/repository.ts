import { PrismaClient, Role } from "@prisma/client";
import redisClient from "../../config/redis.js";
import { hashPassword } from "../../shared/utils/hashPassword.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Shape of a USSD session stored in Redis
export interface UssdSession {
  step: string; // which step the user is currently on
  data: Record<string, string>; // collected inputs so far e.g. { name: "John", location: "Lagos" }
}

export class UssdRepository {
  // ─── Redis session methods ───────────────────────────────────────

  async getSession(phoneNumber: string): Promise<UssdSession | null> {
    const raw = await redisClient.get(`ussd:session:${phoneNumber}`);
    return raw ? JSON.parse(raw) : null;
  }

  async saveSession(phoneNumber: string, session: UssdSession): Promise<void> {
    await redisClient.set(
      `ussd:session:${phoneNumber}`,
      JSON.stringify(session),
      { EX: 60 * 5 }, // expire after 5 minutes of inactivity
    );
  }

  async deleteSession(phoneNumber: string): Promise<void> {
    await redisClient.del(`ussd:session:${phoneNumber}`);
  }

  // ─── Prisma methods (unchanged) ──────────────────────────────────

  async findUserByPhone(phoneNumber: string) {
    return prisma.user.findFirst({ where: { phoneNumber } });
  }

  async createUser(data: {
    phoneNumber: string;
    name: string;
    location: string;
    role: Role;
    pin: string;
  }) {
    const hashedPin = await hashPassword(data.pin);
    return prisma.user.create({ data: { ...data, pin: hashedPin } });
  }

  async verifyPin(phoneNumber: string, pin: string): Promise<boolean> {
    const user = await this.findUserByPhone(phoneNumber);
    if (!user || !user.pin) return false;
    return bcrypt.compare(pin, user.pin);
  }

  async createListing(data: {
    phoneNumber: string;
    crop: string;
    quantity: number;
    price: number;
    location: string;
    availableFrom: string;
  }) {
    // prisma.listing.create(...)
  }

 async getListingsByCrop(crop: string): Promise<any[]> {
  return prisma.listing.findMany({
    where: {
      crop: { contains: crop, mode: "insensitive" },
      status: "ACTIVE",
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
}

  async linkFarmerToAgent(data: { agentPhone: string; farmerPhone: string }) {
    // prisma.agentFarmer.create(...)
  }

  async createTransaction(data: {
    agentPhone: string;
    farmerPhone: string;
    buyerPhone: string;
    amount: number;
  }) {
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
