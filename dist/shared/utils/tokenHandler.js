import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
/**
 * Generates a JWT token for authenticated users.
 *
 * Purpose:
 * - Used after login or signup
 * - Encodes user identity securely
 * - Enables stateless authentication
 *
 * Payload typically contains:
 * - userId
 * - email or role (optional)
 */
// const ACCESS_EXPIRES = (process.env.ACCESS_TOKEN_EXPIRES_IN || "15m") as SignOptions["expiresIn"];
// const REFRESH_EXPIRES = (process.env.REFRESH_TOKEN_EXPIRES_IN || "7d") as SignOptions["expiresIn"];
export const generateAccessToken = (userId, role) => {
    return jwt.sign({ userId, role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
//# sourceMappingURL=tokenHandler.js.map