import type { Request, Response, NextFunction } from "express";
/**
 * Authentication Middleware
 *
 * Protects secured routes by validating user identity using JWT tokens.
 *
 * Responsibilities:
 * - Extract and verify authentication token from request headers
 * - Decode token and attach user data to request object
 * - Block unauthorized or invalid requests
 *
 * Ensures only authenticated users can access protected resources.
 */
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map