import jwt from "jsonwebtoken";

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

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d", // token expires in 1 day
  });
};