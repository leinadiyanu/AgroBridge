import { PrismaClient, Role } from "@prisma/client";
import redisClient from "../../config/redis.js";

const prisma = new PrismaClient();

const PENDING_TTL_SECONDS = 15 * 60; // 15 min — slightly longer than OTP TTL

export interface CreateUserInput {
  phoneNumber: string;
  email?: string;
  name: string;
  location: string;
  role: Role;
  passwordHash: string;
}

export class AuthRepository {
  // ── User queries ─────────────────────────────────────────────────────────

  async findByPhone(phoneNumber: string) {
    return prisma.user.findUnique({ where: { phoneNumber } });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        phoneNumber: true,
        email: true,
        name: true,
        location: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async createUser(data: CreateUserInput) {
    return prisma.user.create({
      data,
      select: {
        id: true,
        phoneNumber: true,
        email: true,
        name: true,
        location: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    return prisma.user.delete({ where: { id } });
  }

  // ── Pending registration (Redis) ─────────────────────────────────────────

  async savePendingRegistration(phoneNumber: string, data: CreateUserInput) {
    await redisClient.setEx(
      `pending:register:${phoneNumber}`,
      PENDING_TTL_SECONDS,
      JSON.stringify(data),
    );
  }

  async getPendingRegistration(
    phoneNumber: string,
  ): Promise<CreateUserInput | null> {
    const raw = await redisClient.get(`pending:register:${phoneNumber}`);
    if (!raw) return null;
    return JSON.parse(raw) as CreateUserInput;
  }

  async clearPendingRegistration(phoneNumber: string) {
    await redisClient.del(`pending:register:${phoneNumber}`);
  }

  // ── Refresh tokens ────────────────────────────────────────────────────────

  async createRefreshToken(userId: string, token: string, expiresAt: Date) {
    return prisma.refreshToken.create({ data: { token, userId, expiresAt } });
  }

  async findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async deleteRefreshToken(token: string) {
    return prisma.refreshToken.deleteMany({ where: { token } });
  }

  async rotateRefreshToken(
    oldToken: string,
    userId: string,
    newToken: string,
    expiresAt: Date,
  ) {
    return prisma.$transaction([
      prisma.refreshToken.deleteMany({ where: { token: oldToken } }),
      prisma.refreshToken.create({
        data: { token: newToken, userId, expiresAt },
      }),
    ]);
  }
}
