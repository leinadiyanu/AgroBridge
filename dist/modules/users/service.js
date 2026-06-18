import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { UserRepository } from "./repository.js";
import { AppError } from "../../shared/middleware/index.js";
import { generateOtp, saveOtp, verifyOtp } from "../auth/otpService.js";
import { sendSmsOtp } from "../auth/smsService.js";
export class UserService {
    constructor() {
        this.repo = new UserRepository();
    }
    // ── Get own profile ───────────────────────────────────────────────────────
    async getMe(userId) {
        const raw = await this.repo.getMe(userId);
        if (!raw)
            throw new AppError("User not found", 404);
        const { agentOf, managedFarmers, ...base } = raw;
        // Shape role-specific extras
        if (base.role === "FARMER") {
            return {
                ...base,
                agent: agentOf[0]?.agent ?? null,
            };
        }
        if (base.role === "AGENT") {
            return {
                ...base,
                managedFarmersCount: managedFarmers.length,
            };
        }
        // BUYER or ADMIN — return base fields only
        return base;
    }
    // ── Update profile ────────────────────────────────────────────────────────
    async updateProfile(userId, data) {
        if (data.email) {
            const existing = await this.repo.findByEmail(data.email);
            if (existing && existing.id !== userId) {
                throw new AppError("Email is already taken", 409);
            }
        }
        const updated = await this.repo.updateProfile(userId, data);
        return updated;
    }
    // ── Change password ───────────────────────────────────────────────────────
    async changePassword(userId, data) {
        const { oldPassword, newPassword } = data;
        if (newPassword.length < 8) {
            throw new AppError("New password must be at least 8 characters", 400);
        }
        const user = await this.repo.findById(userId);
        if (!user)
            throw new AppError("User not found", 404);
        if (!user.passwordHash) {
            throw new AppError("No password set on this account. Use your PIN to log in via USSD.", 403);
        }
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch)
            throw new AppError("Current password is incorrect", 401);
        if (oldPassword === newPassword) {
            throw new AppError("New password must be different from current password", 400);
        }
        const newHash = await bcrypt.hash(newPassword, 12);
        await this.repo.updatePassword(userId, newHash);
    }
    // ── Change phone — step 1: send OTP to new number ─────────────────────────
    async initiatePhoneChange(userId, newPhone) {
        const existing = await this.repo.findByPhone(newPhone);
        if (existing) {
            throw new AppError("This phone number is already in use", 409);
        }
        const otp = generateOtp();
        await Promise.all([
            saveOtp("phone", newPhone, otp),
            sendSmsOtp(newPhone, otp),
            this.repo.savePendingPhoneChange(userId, newPhone),
        ]);
        return {
            message: "OTP sent to the new phone number. It expires in 5 minutes.",
        };
    }
    // ── Change phone — step 2: verify OTP + commit ────────────────────────────
    async verifyPhoneChange(userId, otp) {
        const newPhone = await this.repo.getPendingPhoneChange(userId);
        if (!newPhone) {
            throw new AppError("No pending phone change found. Please start again.", 400);
        }
        const isValid = await verifyOtp("phone", newPhone, otp);
        if (!isValid)
            throw new AppError("OTP is invalid or expired", 400);
        await this.repo.updatePhone(userId, newPhone);
        await this.repo.clearPendingPhoneChange(userId);
        return { phoneNumber: newPhone };
    }
    // ── Public profile ────────────────────────────────────────────────────────
    async getPublicProfile(targetId) {
        const user = await this.repo.getPublicProfile(targetId);
        if (!user)
            throw new AppError("User not found", 404);
        return user;
    }
    // ── Lists ─────────────────────────────────────────────────────────────────
    async listFarmers(page, limit) {
        const result = await this.repo.listFarmers(page, limit);
        // Flatten agent out of agentOf join
        const farmers = result.farmers.map(({ agentOf, ...f }) => ({
            ...f,
            agent: agentOf[0]?.agent ?? null,
        }));
        return { ...result, farmers };
    }
    async listAgents(page, limit) {
        const result = await this.repo.listAgents(page, limit);
        // Replace raw array with count
        const agents = result.agents.map(({ managedFarmers, ...a }) => ({
            ...a,
            managedFarmersCount: managedFarmers.length,
        }));
        return { ...result, agents };
    }
}
//# sourceMappingURL=service.js.map