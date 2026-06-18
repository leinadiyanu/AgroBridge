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



export const generateAccessToken = (userId: string, role: Role): string => {
  return jwt.sign(
    { userId, role },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m"}
  );
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as {
    userId: string;
    role: Role;
  };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as {
    userId: string;
  };
};