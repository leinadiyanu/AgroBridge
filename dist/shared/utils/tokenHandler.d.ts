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
export declare const generateAccessToken: (userId: string, role: Role) => string;
export declare const generateRefreshToken: (userId: string) => string;
export declare const verifyAccessToken: (token: string) => {
    userId: string;
    role: Role;
};
export declare const verifyRefreshToken: (token: string) => {
    userId: string;
};
//# sourceMappingURL=tokenHandler.d.ts.map