import { PrismaClient } from "@prisma/client";
import redisClient from "../../config/redis.js";

const prisma = new PrismaClient();

const PHONE_CHANGE_TTL = 10 * 60; // 10 min

// ── Reusable selects ─────────────────────────────────────────────────────────

const baseSelect = {
  id: true,
  phoneNumber: true,
  email: true,
  name: true,
  location: true,
  role: true,
  farmSize: true,
  deliveryAddress: true,
  coverageArea: true,
  createdAt: true,
  updatedAt: true,
} as const;

const publicSelect = {
  id: true,
  name: true,
  role: true,
  location: true,
} as const;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface UpdateProfileInput {
  name?: string;
  location?: string;
  email?: string;
  farmSize?: string;
  deliveryAddress?: string;
  coverageArea?: string;
}

export class UserRepository {
  // ── Lookups ───────────────────────────────────────────────────────────────

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        ...baseSelect,
        passwordHash: true, // needed for password change — caller strips it
        pin: true,
      },
    });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findByPhone(phoneNumber: string) {
    return prisma.user.findUnique({ where: { phoneNumber } });
  }

  // ── Own profile (full, safe) ──────────────────────────────────────────────

  async getMe(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        ...baseSelect,
        // Farmer: include assigned agent
        agentOf: {
          select: {
            agent: {
              select: { id: true, name: true, phoneNumber: true },
            },
          },
          take: 1,
        },
        // Agent: count managed farmers
        managedFarmers: {
          select: { id: true },
        },
      },
    });
  }

  // ── Public profile ────────────────────────────────────────────────────────

  async getPublicProfile(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: publicSelect,
    });
  }

  // ── Update ────────────────────────────────────────────────────────────────

  async updateProfile(id: string, data: UpdateProfileInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: baseSelect,
    });
  }

  async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
      select: { id: true },
    });
  }

  async updatePhone(id: string, phoneNumber: string) {
    return prisma.user.update({
      where: { id },
      data: { phoneNumber },
      select: { id: true, phoneNumber: true },
    });
  }

  // ── Lists ─────────────────────────────────────────────────────────────────

  async listFarmers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [farmers, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: "FARMER" },
        select: {
          ...publicSelect,
          farmSize: true,
          agentOf: {
            select: {
              agent: { select: { id: true, name: true } },
            },
            take: 1,
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where: { role: "FARMER" } }),
    ]);
    return { farmers, total, page, limit };
  }

  async listAgents(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [agents, total] = await Promise.all([
      prisma.user.findMany({
        where: { role: "AGENT" },
        select: {
          ...publicSelect,
          coverageArea: true,
          managedFarmers: { select: { id: true } },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where: { role: "AGENT" } }),
    ]);
    return { agents, total, page, limit };
  }

  // ── Phone change (Redis) ──────────────────────────────────────────────────

  async savePendingPhoneChange(userId: string, newPhone: string) {
    await redisClient.setEx(
      `pending:phone-change:${userId}`,
      PHONE_CHANGE_TTL,
      newPhone,
    );
  }

  async getPendingPhoneChange(userId: string): Promise<string | null> {
    return redisClient.get(`pending:phone-change:${userId}`);
  }

  async clearPendingPhoneChange(userId: string) {
    await redisClient.del(`pending:phone-change:${userId}`);
  }
}