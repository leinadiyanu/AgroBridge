import { PrismaClient, Role } from "@prisma/client";
import redisClient from "../../config/redis.js";
const prisma = new PrismaClient();
const PENDING_TTL_SECONDS = 15 * 60; // 15 min — slightly longer than OTP TTL
export class AuthRepository {
    // ── User queries ─────────────────────────────────────────────────────────
    async findByPhone(phoneNumber) {
        return prisma.user.findUnique({ where: { phoneNumber } });
    }
    async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }
    async findById(id) {
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
    async createUser(data) {
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
    async deleteUser(id) {
        return prisma.user.delete({ where: { id } });
    }
    // ── Pending registration (Redis) ─────────────────────────────────────────
    async savePendingRegistration(phoneNumber, data) {
        await redisClient.setEx(`pending:register:${phoneNumber}`, PENDING_TTL_SECONDS, JSON.stringify(data));
    }
    async getPendingRegistration(phoneNumber) {
        const raw = await redisClient.get(`pending:register:${phoneNumber}`);
        if (!raw)
            return null;
        return JSON.parse(raw);
    }
    async clearPendingRegistration(phoneNumber) {
        await redisClient.del(`pending:register:${phoneNumber}`);
    }
    // ── Refresh tokens ────────────────────────────────────────────────────────
    async createRefreshToken(userId, token, expiresAt) {
        return prisma.refreshToken.create({ data: { token, userId, expiresAt } });
    }
    async findRefreshToken(token) {
        return prisma.refreshToken.findUnique({ where: { token } });
    }
    async deleteRefreshToken(token) {
        return prisma.refreshToken.deleteMany({ where: { token } });
    }
    async rotateRefreshToken(oldToken, userId, newToken, expiresAt) {
        return prisma.$transaction([
            prisma.refreshToken.deleteMany({ where: { token: oldToken } }),
            prisma.refreshToken.create({
                data: { token: newToken, userId, expiresAt },
            }),
        ]);
    }
}
//# sourceMappingURL=repository.js.map