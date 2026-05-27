import jwt from "jsonwebtoken";
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

export const auth = (req: Request, res: Response, next: NextFunction) => {
    
    try {
        //Get authoriztion header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: "No token provided." });
        }

        //Extract token from header (format: "Bearer <token>")
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ error: "No token provided." });
        }   

        //Verify token and extract user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;


        // req.userId = decoded.userId;  // Now you have the user ID!
        next();

    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};
